# Static binary triage

Applies before any tooling: know what kind of problem you have.

## First question: is type information present at all?

```bash
readelf -hS libfoo.so | head -40        # sections
readelf -d libfoo.so | grep NEEDED      # dependencies
readelf --dyn-syms -W libfoo.so | wc -l # exported symbols (stripped => ~0)
nm -D libfoo.so 2>/dev/null | head      # dynamic symbols
strings -a -t x libfoo.so | head -50    # located strings
```

Three cases:

1. **Metadata sidecar present** (`global-metadata.dat`, Mono assemblies, Unreal
   reflection tables). You can recover names and field layouts
   without reverse-engineering any code. See `il2cpp-metadata.md`. This is the
   good case.
2. **Symbols present** (unstripped, or a `.debug`/`.sym` companion, or a
   `BUILD_ID` you can match). Use them.
3. **Fully stripped, no metadata.** Everything must come from strings, xrefs and
   runtime probing. Expect to spend most of your time in case 3's techniques.

Check for a debug companion before assuming case 3:

```bash
readelf -S libfoo.so | grep -E 'debug|symtab'
strings -a libfoo.so | grep -iE 'build_?id|commit|git'
```

## Stripped binaries: recovering functions from strings

Type names, error messages and format strings survive stripping and often sit
in `.rodata` while the code that references them sits in `.text`.

Workflow, per target string:

1. Locate the string: `strings -a -t x libfoo.so | grep -F 'ShowEntity'`
2. Find the address range that contains it (map file offset → vaddr using the
   section headers; `.rodata` file offset usually equals vaddr for these builds,
   but check rather than assume).
3. Search `.text` for a relocation or an instruction pair referencing it.
   - PIC code (arm64/amd64) typically materialises the address with a
     PC-relative load: `ADRP` + `ADD`/`LDR` on arm64, `LEA`/`MOV` after
     `RIP-relative` on amd64.
   - Searching for the raw bytes of a small offset usually fails. Search for
     the **page-aligned page** reference instead.
4. Recover the function boundary (prologue pattern, or the largest surrounding
   symbol-less region the linker agreed on) and check what else it touches.

Tooling: `readelf -x` for hex dumps, `objdump -d` / `llvm-objdump -d` for
disassembly, `rizin` or `radare2` for cross-reference analysis (much faster than
doing it by hand), Ghidra for bulk analysis and scripting.

Rules of thumb:

- Search in the **game's** library first, then in the engine library. Game
  business logic has the readable names; the engine has the generic ones.
- Name candidates are only *candidates*. Confirm by structure: the offset you
  read at that address must be plausible (HP is 4 bytes, a list pointer is
  8-byte aligned and points into a mapped region, an enum is a small int).
- String proximity means nothing. Two unrelated classes can share a rodata
  neighbourhood.

## Calling conventions and signatures from call sites

You rarely need the exact prototype. You need argument registers/widths and the
return value:

- arm64 AAPCS64: args `x0..x7`, return `x0`; 32-bit values arrive zero-extended
  but **floats and doubles use `d0..d7`** — mixing up an int/float read looks
  like "the value is always a small number" and sends you chasing ghosts.
- amd64 SysV: args in `rdi, rsi, rdx, rcx, r8, r9`, floats in `xmm0..`, return
  in `rax`/`xmm0`.

Read the call site, not the callee, when the callee is a thin accessor — the
width the caller uses is the ground truth for the field's type.

## Data structures without symbols

Recover shape by walking:

1. Find a pointer that is dereferenced (a list head, a singleton accessor).
2. Look for the stride: an array accessor typically loads `base + i*stride`.
   The stride is often visible as an immediate in the multiply/shift.
3. Validate the shape by scanning a few hundred instances and checking that the
   fields stay in plausible ranges. A stride that yields garbage within three
   entries is wrong.
4. Cross-check with a live dump: read the same structure from two different
   entities and diff. Real structure shows a small, meaningful delta.

## Disassembly hygiene

- Match the tool to the ABI. Aarch64 disassembled as x86 produces confident
  nonsense.
- Keep a scratch note per function: address, presumed purpose, evidence.
  Without it you will re-derive the same wrong answer twice.
- Prefer reading a decompiler over a disassembler for control flow, and verify
  the decompiler's guesses (especially inlined code) against the
  disassembly before trusting them.

## Quick triage checklist

- [ ] Library pulled **from the running process**, not from the APK
- [ ] Section list reviewed; metadata sidecar located or ruled out
- [ ] Exported dynamic symbols reviewed (often enough for entry points)
- [ ] Section chosen for string hunting identified
- [ ] Disassembler configured for the correct architecture
- [ ] Every offset claim backed by a runtime read, not by inspection alone