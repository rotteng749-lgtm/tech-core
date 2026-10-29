# tech-core

OpenCode skill: playbook for **reverse engineering**, **cracking**, and **tools
building**.

## Install

```bash
npx tech-core-skill install --global     # every project for this user
npx tech-core-skill install --project    # ./.opencode/skills/
npx tech-core-skill install --dir <p>   # explicit destination
npx tech-core-skill path --global        # print the target, install nothing
npx tech-core-skill uninstall --global
```

Restart OpenCode after installing.

The target is `$XDG_CONFIG_HOME/opencode/skills` when that is set, else
`~/.config/opencode/skills`. An existing install is renamed to
`<name>.bak-<timestamp>` unless you pass `--force`.

## What is inside

`SKILL.md` — the payload: non-negotiables, the RE loop, a symptom-to-reference
decision table, and the five facts that cost the most hours when learned late.

`references/` — loaded on demand:

| File | Covers |
|---|---|
| `static-binary.md` | Triage of a stripped `.so`/EXE; recovering functions from strings; PC-relative xref search; calling conventions |
| `il2cpp-metadata.md` | `global-metadata.dat`, `Il2CppClass`, Unity type layouts, runtime metadata APIs |
| `live-probing.md` | Probing a running process on a rooted Android phone; choosing the right process; multi-class sweeps |
| `offset-table-and-heal.md` | Name-to-offset tables that revalidate against a live build instead of going stale |
| `cracking.md` | Server/client/native license gates, patching workflow, integrity checks, anti-debug, and how to build auth that is not trivially bypassed |
| `tools-builder.md` | Architecture matrix, `/proc/<pid>/mem` reader, uinput touch injection, EGL overlay, NDK build gates, common failures |
| `verification.md` | One-command gates for a project that fails quietly |
| `cleo-samp.md` | GTA SA static addresses (1.0 US only), CLEO opcodes, timers, self-scanning |
| `panel-lisensi.md` | Working Node + SQLite license server: key issuance, HWID binding, rate limiting |
| `bot-template.md` | Three bot routes: memory, ADB input, OpenCV vision |

`eval/eval_set.json` — 14 trigger queries for measuring the skill description.

## Related skills

- `mlbb-panxcz` — Mobile Legends overlay tools specifically
- `panxcz-reversal-reversing` — the reverse-engineering half, packaged
  separately for GitHub
- `codebase-notes` — build and triage notes for the panxcz codebase

## License

Apache-2.0. References adapted from `panxcz-reversal-reversing` (Apache-2.0)
and `x-ai` (MIT).