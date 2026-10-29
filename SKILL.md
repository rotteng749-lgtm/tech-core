---
name: tech-core
description: "Reversing, cracking and tool building. Static triage of stripped .so/EXE, function recovery from strings, xref analysis in Ghidra/IDA/rizin, and driving Ghidra via GhidrAssistMCP (MCP streamable HTTP: decompile, xrefs, byte search, patching, struct inference). Also il2cpp/Unity global-metadata.dat reading, live memory probing on rooted Android, offset tables with runtime healing, license bypass (patching, integrity checks, anti-debug), and building overlays, memory bots and license panels. Use when the user mentions reversing, decompiling, Ghidra, GhidrAssistMCP, Ghidra MCP, MCP decompile, IDA, x64dbg, rizin, objdump, readelf, stripped binary, xrefs, il2cpp, libil2cpp.so, global-metadata.dat, Il2CppClass, /proc/pid/mem, an unknown offset, an offset that moved after an update, patching a license check, serial validation, integrity check, ESP overlay, memory bot, uinput injection, license panel, or an NDK arm64 ELF. Trigger on a field that reads wrong, a write that does nothing, or a binary that refuses to run."
license: Apache-2.0
metadata:
  version: "1.1.0"
  author: panxcz
  hermes:
    tags: [reverse-engineering, cracking, tools-builder, il2cpp, android, ndk, offsets, ghidra, mcp]
    related_skills: [mlbb-panxcz, panxcz-reversal-reversing, codebase-notes]
---

# Tech core — reversing, cracking, tools building

Substantive technical reference. Persona skills (`x-ai`, `gura`, `elaina`) point
here for voice; this file holds the payload.

## Non-negotiables

1. **Probe, don't infer.** Every assumption about a layout is wrong more often
   than right. Confirm from the file or the live process, then speak.
2. **A wrong offset is worse than no offset.** The failure mode is silent: the
   write succeeds, nothing happens. Trace to the write site.
3. **A gate that can reject everything must never be reachable from a path that
   does nothing else.** Silent permanent failure reads as "the feature is
   broken" and costs hours. Every gate needs a visible status string.
4. **Verify in the binary.** A source edit that never reached the compiled
   artifact is the classic bug. `strings`, `readelf`, `patch_guard.py --check`.
5. **Back up before patching.** One `.orig` file saves an afternoon.

## The loop

```
hypothesise -> probe -> confirm -> codify -> self-test
```

A reversing project fails at "confirm". Probing without confirming produces a
list of candidates, not knowledge.

## Decision table — load the right reference

| Symptom / task | Reference |
|---|---|
| Stripped `.so`, no symbols, find a function | `references/static-binary.md` |
| Ghidra from the agent (MCP), decompile/xrefs/patch via tools | `references/ghidra-mcp.md` |
| `global-metadata.dat`, `Il2CppClass`, Unity types | `references/il2cpp-metadata.md` |
| Probe a running process, verify an offset live | `references/live-probing.md` |
| Offsets go stale after a game update | `references/offset-table-and-heal.md` |
| License screen, serial, integrity check, anti-debug | `references/cracking.md` |
| Build an overlay / memory bot / touch injector / panel | `references/tools-builder.md` |
| "How do I know this is right?" | `references/verification.md` |
| GTA SA memory, CLEO opcodes, SA:MP | `references/cleo-samp.md` |
| License panel server (Node + SQLite) | `references/panel-lisensi.md` |
| Bot: memory / ADB input / OpenCV vision | `references/bot-template.md` |
| Game-specific MLBB mechanics | skill `mlbb-panxcz` |

## Ghidra is wired in — use it before guessing

Ghidra runs as an MCP server on this machine (Ghidra 12.1.2 snap +
GhidrAssistMCP 3.0.0, streamable HTTP at `http://127.0.0.1:8080/mcp`, 93 tools).
When the server is up, decompile and query it instead of reasoning from
`objdump` fragments:

```
get_program_info        -> image base (needed for every address conversion)
get_analysis_status     -> must say "Analyzed Flag: true"
get_pseudocode          -> decompiled body  (may return a task_id: poll it)
get_xrefs_to / _from    -> who touches this address
infer_structure_from_variable + get_structure_field_xrefs -> recover a struct
search_bytes            -> find a masked pattern after an update
patch_bytes             -> patch, then disassemble_bytes, then verify
```

Check state first: `skills/tech-core/scripts/ghidra-mcp.sh status`.
Import + analyze + save + serve: `... headless ~/ghidra-targets/libfoo.so`.
Re-serve a saved program: `... serve libfoo`. Free the port: `... stop`.

**Headless cannot `save_project` over MCP** ("Project controls require the Ghidra
GUI project manager"). So import/analyze/serve must be two phases — phase 1
imports, analyzes and saves, phase 2 serves the saved program. Skip phase 1 and
the analysis lives only in memory and dies with the server.

Four rules that stop silent nonsense — full detail in `references/ghidra-mcp.md`:

1. **Ghidra addresses are image-relative.** `runtime = ghidra - image_base +
   module_load_base`. Skip this and the write succeeds and nothing happens.
2. **`bytes_hashed: 1` means "not analyzed", not a fingerprint.** Every
   `ENDBR64` function hashes to `sha256(0xf3)`.
3. **Async tools return `task_id`, not a result.** Poll `get_task_status`.
4. **`patch_bytes` clears code units without re-disassembling.** Follow with
   `disassemble_bytes`, then prove it with `get_hexdump`.

## The five facts that cost the most hours

Learned the hard way. Each one looks obvious and is false more often than not.

1. **"The players must be in the player list."** They were in a different list.
2. **A name recovered from a string is a candidate, not a fact.** Confirm by
   structure: HP is 4 bytes, a pointer is 8-byte aligned and lands in a mapped
   region, an enum is a small int.
3. **String proximity means nothing.** Two unrelated classes share a rodata
   neighbourhood.
4. **A cache that retries on failure costs more than the failure.** Cache the
   miss once per name.
5. **An offset of 0 is "not healed yet", not "valid offset 0".** Skip it
   explicitly.

## Verifying a change reached the binary

```bash
strings -a out/tool | grep -F 'expected_literal'    # symbol/string survived
readelf --dyn-syms -W out/tool | grep entry_point  # symbol exported
readelf -lW out/tool | grep LOAD                    # align 0x4000 on Android 15+
./out/tool --selftest                               # internal tests
```

Screenshot is not verification for an overlay — a separate surface usually does
not appear in `screencap`. Log instead.

## Style

- Complete artifacts. Full function, full patch, real APIs. Not a skeleton.
- Quote real paths, real line numbers, real command output.
- Report which step failed, by number — not "it doesn't work".
- Own mistakes out loud. If something was called clean and was not, say so.