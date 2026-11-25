# ADR 0001: Specialized 10-Domain Skill Matrix Architecture

## Status
Accepted

## Context
Initial prompt-based reverse engineering approaches attempted to cram instructions for Windows PE, Linux ELF, Android APKs, Web bundles, network protocols, game engines, and firmware into a single monolithic system prompt. This led to prompt truncation, missed toolchain flags, context dilution, and degraded reasoning when switching between completely disparate domains (such as decompiling a DirectX shader vs auditing an Android `AndroidManifest.xml`).

## Decision
We decompose the reverse engineering and recovery universe into an explicit **10-Domain Specialized Skill Matrix** orchestrated by a master router (`$rea-universal-orchestrator`):
1. `rea-binary-disassembly` (Windows PE, Linux ELF, macOS Mach-O)
2. `rea-full-code-recovery` (Zero-Skeleton lost source recovery)
3. `rea-web-bundle-recovery` (Frontend AST de-minification, WASM, Electron)
4. `rea-mobile-app-recovery` (Android, iOS, PTKD/OWASP 5-Pillar scanner)
5. `rea-protocol-api-recovery` (PCAP, Protobuf/gRPC, WebSockets)
6. `rea-database-storage-recovery` (SQLite, Realm, binary formats)
7. `rea-game-asset-recovery` (Unity, Unreal, Godot, shaders)
8. `rea-performance-crash-triage` (Minidump forensics, Frida, Flameox)
9. `rea-firmware-iot-extension` (Embedded, EVM smart contracts, RF)
10. `website-security-audit` (10-layer defensive web vulnerability scanner)

## Consequences
- Every domain maintains dedicated toolchains, decompilation strategies, and verification commands.
- Context window overhead is minimized by loading only the activated domain skill.
- The router guarantees 100% unblocked execution across all 500+ Prompt Vault templates and custom user queries.
