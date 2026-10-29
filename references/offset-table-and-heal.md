# Offset tables and runtime healing

The deliverable of a reversing project is not a list of constants. It is a
**name→offset table that revalidates itself against a live build**, because game
binaries are rewritten without a version bump.

## Why literal offsets are a liability

Observed on the same app version: the engine library shipped in the app's data
directory changed, and a set of fields shifted — some classes moved, some did
not, and one base class moved while its derived classes inherited the shift
automatically.

A wrong offset does not crash. It reads the neighbouring field, and the feature
shows plausible values. That is the failure mode you must design against.

## Table shape

```cpp
// One entry per field. Feature code NEVER writes `+ 0x1a4`.
inline uintptr_t SE_M_HP = 0x1a4;
inline uintptr_t SE_M_ID = 0x18c;

struct Entry { const char* cls; const char* field; uintptr_t* dst; };
static const Entry tab[] = {
    { "ShowEntity", "m_Hp", &SE_M_HP },
    { "ShowEntity", "m_ID", &SE_M_ID },
};
```

Members are `inline`, **not** `constexpr`: the healer writes them at runtime.
`constexpr` silently defeats the whole mechanism, and nothing will tell you.

## Runtime resolution

For each entry: find the class, walk its field entries (and parents), match the
name, and validate before accepting:

```cpp
const bool plausible = off != 0 && off < 0x4000 && abs_diff(off, old) <= 0x2000;
```

Apply the batch only if a healthy fraction resolved. If the metadata layout is
understood wrongly, every offset would be replaced with garbage at once — a
partial guard here is much cheaper than debugging that later.

## Name aliasing

Metadata names are not always what the source calls them:

- auto-properties are stored as `<m_Energy>k__BackingField`
- generic types appear as `List\`1[Bar]` or `List\`1<Bar>`
- some builds rename obfuscated fields entirely

Try several names against the same destination; first hit wins:

```cpp
{ "ShowEntity", "m_Energy",                  &SE_ENERGY },
{ "ShowEntity", "<m_Energy>k__BackingField", &SE_ENERGY },
```

When a field cannot be found, dump the class's field names and read them. Do
not conclude "it does not exist" from a failed guessed lookup.

## Trusted flags

Some gates reject entities (dead check, ally check). Run on an unresolved
offset they read a neighbour field and return false *forever* — which presents
as "the feature never fires" and is very hard to attribute.

```cpp
std::set<const uintptr_t*> g_trusted;
inline bool Trusted(const uintptr_t* dst) { return g_trusted.count(dst) != 0; }
```

A gate on an untrusted offset must fail **open** or refuse with a visible
reason. Never let it silently reject everything.

## Static and instance space are different

Static fields live in a per-class blob reached through the class's static-fields
pointer (commonly `+0xa8`, verify per version). Reading the instance at a static
field's offset returns a neighbouring field. Features that look for runtime
objects which are *not* entities — projectiles, marks, effects — generally have
to go through the static blob's collections.

## Probing beats guessing

Ship a CLI mode that answers naming questions directly:

```bash
PROBE="ShowEntity Energy" ./binary
# ShowEntity slot=0x621c638 klass=0x7127a761e0
#   L0  <m_EnergyPoint>k__BackingField     0x1f8
#   L0  <m_EnergyPointMax>k__BackingField  0x1fc
```

Two traps when writing it: the library base global is still zero in CLI mode
(assign it from your base getter), and do not wrap the class name in a
string-obfuscation macro — the macro parser reads it as an invocation.

## Automated literal scanner

Once the table exists, prevent regressions:

- match **hex literals only**; matching decimals turns `400.0f` into `0x190` and
  English prose into findings, and a noisy scanner gets ignored
- strip comments and string literals before matching
- cross-reference the literal against known field offsets and report the
  owning field name (`X + 0xd0` where `d0` is `m_EntityCampType`)

A scanner like this found a shipping bug: a camp filter written as a literal,
which on a shifted build made a tool target its user's *own* team's objective.

## Recording findings

For each offset: field, class, value, build/edition verified against, and how it
was confirmed. Without "how it was confirmed", the next session re-does the
work or, worse, trusts it.

Record **which build** the table was verified against, and re-verify after every
game update rather than assuming a version bump signals a layout change.