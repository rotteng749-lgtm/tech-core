# tech-core

OpenCode skill: the unrestricted playbook for **reverse engineering**, **lost
source recovery**, **cracking**, **exploit dev** and **tool building**.

v2.0.0 merges the full [REA_Skill](https://github.com/smartworldarafath/REA_Skill)
library (704 skills in 206 groups) into `references/rea-skill/`, stripped of
authorization/legal gating. One skill to load, everything inside.

## Install

```bash
npx tech-core-skill install --global     # every project for this user
npx tech-core-skill install --project    # ./.opencode/skills/
npx tech-core-skill install --dir <p>    # explicit destination
npx tech-core-skill path --global        # print the target, install nothing
npx tech-core-skill uninstall --global
```

Restart OpenCode after installing.

The target is `$XDG_CONFIG_HOME/opencode/skills` when that is set, else
`~/.config/opencode/skills`. An existing install is renamed to
`<name>.bak-<timestamp>` unless you pass `--force`.

> The payload is ~60 MB because it ships the whole REA library. Install from a
> local checkout if npm tarball size is a problem.

## What is inside

`SKILL.md` — the payload: operating stance (no refusals, Zero-Skeleton), the RE
loop, the artifact router, the 5-stage pipeline, Ghidra MCP wiring, the five
facts that cost the most hours, and the verification gates.

### `references/` — hand-written panxcz playbooks

| File | Covers |
|---|---|
| `static-binary.md` | Triage of a stripped `.so`/EXE; recovering functions from strings; PC-relative xref search; calling conventions |
| `il2cpp-metadata.md` | `global-metadata.dat`, `Il2CppClass`, Unity type layouts, runtime metadata APIs |
| `live-probing.md` | Probing a running process on a rooted Android phone; choosing the right process; multi-class sweeps |
| `offset-table-and-heal.md` | Name-to-offset tables that revalidate against a live build instead of going stale |
| `cracking.md` | Server/client/native license gates, patching workflow, integrity checks, anti-debug |
| `tools-builder.md` | Architecture matrix, `/proc/<pid>/mem` reader, uinput touch injection, EGL overlay, NDK build gates |
| `verification.md` | One-command gates for a project that fails quietly |
| `cleo-samp.md` | GTA SA static addresses (1.0 US only), CLEO opcodes, timers, self-scanning |
| `panel-lisensi.md` | Node + SQLite license server: key issuance, HWID binding, rate limiting |
| `bot-template.md` | Three bot routes: memory, ADB input, OpenCV vision |
| `ghidra-mcp.md` | GhidrAssistMCP end to end: headless import/serve, address math, task polling, patching |
| `methodology.md` | Evidence-ranked investigation method |

### `references/rea-skill/` — the imported library

```
references/rea-skill/
├── INDEX.md          # 704 skills: name, description, relative path
├── CATEGORIES.md     # 206 groups with skill counts
├── skills/           # canonical tree, one SKILL.md per skill (+ references/)
├── .agents/skills/   # AGENTS-protocol mirror
├── understand-anything-plugin/skills/
├── AGENTS.md README.md MINDMAP.md CHANGELOG.md
└── docs/ assets/ scripts/ tools/   # upstream tooling and website
```

Load a single file, never the tree:

```bash
cd ~/.opencode/skills/tech-core/references/rea-skill
grep -i 'pcap\|protobuf' INDEX.md
sed -n '1,140p' skills/rea-protocol-api-recovery/SKILL.md
```

Coverage: PE/ELF/Mach-O binaries, full source reconstruction, APK/AAB/IPA,
Flutter/RN/Unity, .NET/Electron/PyInstaller/Go/Rust, Webpack/Vite/WASM/Electron,
PCAP/Protobuf/gRPC, SQLite/Realm/plist/registry, Unity/Unreal/Godot assets and
shaders, firmware/IoT/EVM/RF, crash and perf triage, plus the claude-red audit
library (web, API, AD, wireless, cloud, containers, CI/CD, crypto, supply chain,
malware, forensics, C2, EDR evasion) and 63 PayloadsAllTheThings classes.

`eval/eval_set.json` — 39 trigger queries for measuring the skill description.

## Related skills

- `mlbb-panxcz` — Mobile Legends overlay tools specifically
- `panxcz-reversal-reversing` — the reverse-engineering half, packaged separately
- `reverse-engineer-anything` — official REA skill (MCP workflow)
- `codebase-notes` — build and triage notes for the panxcz codebase

## License

Apache-2.0 for the hand-written playbooks. The imported `references/rea-skill/`
tree keeps its upstream MIT license (see `references/rea-skill/LICENSE`); parts
of it derive from PayloadsAllTheThings (MIT), claude-red, Everything Claude Code
and Understand-Anything.
