# il2cpp / Unity metadata and runtime classes

Two halves, and you need both:

- **Metadata sidecar** (`global-metadata.dat`, or embedded in the `.so`) —
  names, type definitions, field/method signatures, string literals.
- **Runtime objects** in the live process — resolved addresses, class
  structures, static field blobs, method pointers.

Metadata tells you *what exists*. The runtime tells you *where it is right now*.

## Locate the sidecar

```bash
adb shell su -c 'ls -l /data/data/<pkg>/app_libs/'
# typical: global-metadata.dat + libil2cpp.so (or the game's own renamed lib)
```

Some builds embed the metadata inside the library, or rename either file. If
the obvious name is missing, look for a large read-only blob with the metadata
magic (`AF 1B B1 FA`, i.e. `0xFAB11BAF` little-endian) at a 4-byte aligned
offset.

## Metadata header sanity

The header starts with the magic above and a version. If the version does not
match your tooling's expectation, do **not** force it: either fix the version
check or treat the file as opaque. Parsing a mismatched metadata file produces
plausible-looking garbage — the worst failure mode, because it looks like
findings.

Useful fields near the start: offsets/counts for the string literal table, the
string table, the type-definition table, method definitions, field defaults and
parameter defaults.

## Type definitions: what you get

A type definition record gives you, among others: name and namespace indices,
field start index and field count, method start index and method count, flags,
and (crucially for objects) the field's default value offset.

**Default values carry offsets.** For a reference-type field, the field-default
blob holds the `Il2CppType*` — so metadata can tell you a field is an object
pointer rather than an int without any runtime read. Use this to reject
candidate offsets early: if metadata says a field is an object pointer and your
runtime read gives you a small integer, you are reading the wrong field.

## Runtime class structure

An `Il2CppClass*` gives you:

- name / namespace (at a small offset, e.g. `+0x10`, verify per version)
- parent pointer
- **static fields blob** pointer (commonly `+0xa8`, verify)
- a packed array of `FieldInfo` (name string pointer, offset value, type info)

Field entries are commonly a 0x20-byte stride with the identifier at `+0x08` and
the offset at `+0x18`. **Verify the stride empirically**: find the fields array,
then look for a run of entries with consistent stride whose names match what
metadata expects. If the stride is wrong you will read plausible-looking garbage.

```text
entries[i] + 0x08 -> const char* identifier   (read the string; verify it makes sense)
entries[i] + 0x18 -> uint32  offset
```

Walking the parent chain covers inherited fields, which is usually where the
interesting values (health, id, position) actually live.

## Finding a class you have no slot for

There is no universal "type info cell" for every class. Options, in order of
preference:

1. **From a live object.** Most engine objects begin with a pointer to their
   `Il2CppClass`. Get any instance (walk a known list) and read the first word.
   This works for the classes that matter most (entities, components).
2. **From a static field's type.** Static field blobs point at their types;
   read the class from there.
3. **By scanning the library for the type's name string**, then finding code
   that references it, then following the argument into the class. Slow, but it
   is the fallback that always works.

Once you have one class, the whole graph is traversable from it (fields whose
type is another class, method signatures, parent chain).

## Method pointers

Managed methods map to native thunks; the mapping lives in the runtime module's
code registration table, and for a specific method it can also be found via
metadata (method pointer index) plus the class's method info array. Expect to
spend time here only if you need to *call* engine functions; reading fields is
far cheaper and rarely requires it.

## Generic types and generated names

Generic instantiations appear as mangled-ish names (`List\`1[T]`,
`Dictionary\`2[TKey,TValue]`, `Foo\`1[Bar]`) with display-name variants
(`List\`1<Bar>`). When searching for a field name, search the display-name form
too; they differ by one character class and it will silently cost you an hour.

## Version drift

Metadata layout, class field ordering and the static-fields offset all change
between engine versions. Treat every structural constant (stride, offsets,
header field indices) as **version-specific** and keep them in one place,
tagged with the version they were verified against.

## Rules

- Verify every structural constant against a live build before you depend on it.
- Prefer metadata for *names and shapes*, runtime for *addresses and values*.
- If metadata parsing and runtime reads disagree, one of them is being read with
  the wrong version. Find out which before trusting either.
- When a field lookup fails, check the backing-field naming convention before
  concluding the field does not exist.