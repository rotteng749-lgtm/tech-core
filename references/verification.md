# Verification

A reversing project fails quietly. Every check you can automate should be
automated, and every gate should be one command.

## The gates

1. **Layout alignment.** Android 15+ rejects page-misaligned code segments.
   ```bash
   readelf -lW ./binary | grep LOAD     # every Align must be 0x4000
   ```
2. **Symbols/entry points.** If you export entry points (visibility hidden
   elsewhere), they must stay exported:
   ```bash
   readelf --dyn-syms -W ./binary | grep <entry_symbol>
   ```
3. **Self-test.** Must run with **no game running**, so it can gate a commit:
   ```bash
   SELFTEST=1 ./binary
   ```
4. **Provenance.** Record a checksum of the exact artifact you deployed, so
   "the build on the device" is a provable claim rather than an assumption.
5. **Integrity check.** If the tool hashes its own code to detect tampering,
   re-verify on a timer in a separate thread; a check that runs once at
   startup is defeated by everything that happens after it.

## Self-test design

Extract decisions into pure functions and test the decision, not the effect.
High-value candidates:

- target selection and tie-breaking priority
- range / distance / angle gating
- phase gating (pre-match draft vs in-match)
- alive/dead and ally/enemy classification
- sequences (combo steps, ability rotation)
- string→offset lookup, including alias fallback
- classification of unknown enum values (should degrade, not crash)

Discipline that pays off:

- Save and restore every global a test mutates. Tests share a binary with live
  code; leaking state makes failures order-dependent and therefore intermittent.
- Assertion labels should name the **rule**, not the code:
  `target beyond max distance is dropped`.
- A failing self-test is usually a wrong expectation, not wrong code. Work out
  which before editing anything — I have "fixed" correct logic to match a bad
  test twice.
- A test run that prints nothing is a failed run. Count PASS/FAIL explicitly.

## Regression checks worth having

- **Literal scanner** for hardcoded offsets that should be table entries.
- **Table sync check**: every offset constant appears in the heal table, and
  every table entry has a sane default.
- **Config clamp test**: stale configs from other devices must not push values
  out of range.
- **Field-name presence check**: after a metadata update, verify the names your
  table depends on still exist. Catches renames before users report breakage.

## Deploy discipline

```bash
adb push ./binary /data/local/tmp/
adb shell su -c 'chmod 755 /data/local/tmp/binary'
```

- Cannot execute from `/sdcard` (no exec bit). Push to `/data/local/tmp`, and
  copy a versioned keep to `/sdcard/...` for archiving.
- Do not deploy over a live session unless asked. Restarting the tool is
  invisible; restarting someone's match is not.
- A binary that is also a script (`.sh` suffix) must be run directly:
  `su -c '/path/to/tool'`. Some Android shells will treat it as a script and
  fail.

## Evidence standard

Before declaring an offset verified, require at least one of:

- read from a live entity and sanity-checked against its max/range
- read from two different entities and the delta is meaningful
- a code path that uses it produces visibly correct behaviour

"Found it in a decompiler" is a hypothesis, not a verification. Write the
verification step down next to the offset so the next person does not repeat it.

## Minimum report

For each offset: field, class, value, build and edition verified against, and
how it was confirmed. That table is the project's real documentation.