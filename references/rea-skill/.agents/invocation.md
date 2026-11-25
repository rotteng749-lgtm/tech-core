# Model-Invoked vs. User-Invoked Skills Architecture

Every skill in this repository complies with the Agent Skills standard specification. The skills are split across two distinct invocation modes:

## 1. User-Invoked Skills
- **Reachability**: Reachable **only when the human user explicitly types its name** or invokes its slash command (e.g., `/rea-grill-me`).
- **Configuration**: Marked with `disable-model-invocation: true` in `SKILL.md` frontmatter and paired with `policy.allow_implicit_invocation: false` in `agents/openai.yaml`.
- **Description**: Human-facing concise summary without auto-trigger phrasing.
- **Purpose**: High-agency gates, interactive interviews, or explicit owner authorization declarations that must never fire automatically without human consent.
- **Skills in this Category**:
  - `rea-grill-me`: Interactive interview to sharpen and scope reverse engineering plans.

## 2. Model-Invoked Skills
- **Reachability**: Reachable autonomously by the AI agent (Antigravity, Codex, Claude Code, Cursor) whenever intent matches, or callable explicitly by name.
- **Configuration**: Default mode (omits `disable-model-invocation` and policy blocks).
- **Description**: Model-facing rich trigger phrasing detailing file extensions, technologies, and intent patterns.
- **Purpose**: Autonomous task routing, decompilation, code reconstruction, vulnerability scanning, and toolchain execution.
- **Skills in this Category**:
  - `rea-universal-orchestrator`: Master router across 500+ templates and arbitrary artifacts.
  - `rea-grilling`: Active interrogation engine called by `rea-grill-me`.
  - `rea-full-code-recovery`: Zero-Skeleton lost source code recovery.
  - `rea-binary-disassembly`: Windows, Linux, macOS binary analysis.
  - `rea-mobile-app-recovery`: Android & iOS reverse engineering + 5-pillar security scan.
  - `rea-web-bundle-recovery`: Webpack/Vite AST de-minification, WASM, Electron asar.
  - `rea-protocol-api-recovery`: PCAP, Protobuf/gRPC, WebSockets, REST APIs.
  - `rea-database-storage-recovery`: SQLite, Realm, LevelDB, binary schemas.
  - `rea-game-asset-recovery`: Unity, Unreal, Godot assets & compiled shaders.
  - `rea-performance-crash-triage`: Minidumps, Frida runtime, CPU flamegraphs.
  - `rea-firmware-iot-extension`: Embedded firmware, EVM bytecode, RF signals.
  - `website-security-audit`: 10-layer defensive web vulnerability & OWASP audit.
  - `ecc-workflow`: Engineering rigor, TDD, and autonomous code review.
  - Supporting research & automation MCPs: `agent-reach`, `surfsense`, `brightdata-mcp`, `hyperbrowser-mcp`, `playwright-mcp`.

## Dependencies Between Skills
Dependencies are strictly expressed by instructing the agent to **call the Skill tool with the named skill** (e.g. `Call the Skill tool with "rea-grilling"`), rather than relying on deep relative directory cross-references.
