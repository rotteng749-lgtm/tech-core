<div align="center">
  <img src="assets/animated-icon.svg" width="110" height="110" alt="REA_Skill Icon" />
  <br />
  <img src="assets/animated-text.svg" alt="REA_Skill — Reverse Engineer Anything & Security Intelligence Suite" />

# REA_Skill

**Reverse Engineering, Lost Source Code Recovery, Security Assessment, Anti-Slop, Design Engineering & Persistent Memory Suite for Claude Code, Codex, Cursor & Antigravity — 541 drop-in `SKILL.md` files across 42 categories.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-541-red.svg)](#skill-index)
[![Categories](https://img.shields.io/badge/categories-42-orange.svg)](#categories)
[![Prompts](https://img.shields.io/badge/prompts-500%2B-0284c7.svg)](https://smartworldarafath.github.io/REA_Skill/#prompt-vault)
[![REA MCP](https://img.shields.io/badge/REA-Reverse%20Engineer%20Anything-ff6b00.svg)](https://github.com/morluto/rea)
[![Stars](https://img.shields.io/github/stars/smartworldarafath/REA_Skill?style=social)](https://github.com/smartworldarafath/REA_Skill)
[![Forks](https://img.shields.io/github/forks/smartworldarafath/REA_Skill?style=social)](https://github.com/smartworldarafath/REA_Skill/network/members)

<p align="center">
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/google-antigravity.svg" width="28" height="28" alt="Google Antigravity" title="Google Antigravity" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/claude.svg" width="28" height="28" alt="Claude Code" title="Claude Code" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/codex.svg" width="28" height="28" alt="OpenAI Codex" title="OpenAI Codex" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/cursor.svg" width="28" height="28" alt="Cursor IDE" title="Cursor IDE" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/copilot.svg" width="28" height="28" alt="GitHub Copilot" title="GitHub Copilot" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/jules.svg" width="28" height="28" alt="Google Jules" title="Google Jules" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/kimi.svg" width="28" height="28" alt="Moonshot Kimi" title="Moonshot Kimi" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/openclaw.svg" width="28" height="28" alt="OpenClaw" title="OpenClaw" /></a>&nbsp;&nbsp;&nbsp;
  <a href="#supported-platforms--mcp-configuration"><img src="assets/logos/direct/opencode.svg" width="28" height="28" alt="OpenCode" title="OpenCode" /></a>
</p>

[Overview](#overview) &bull; [Quickstart](#quickstart) &bull; [Autonomous Agents](#-autonomous-coding-agents-vs-standard-chat-llms-tier-1-native-execution) &bull; [Categories](#categories) &bull; [Skill Index](#skill-index) &bull; [Mindmap](MINDMAP.md) &bull; [Platforms & MCP](#supported-platforms--mcp-configuration) &bull; [Roadmap](#roadmap) &bull; [Contributing](#contributing)

</div>

---

## Overview

`REA_Skill` is a unified library of **541 specialized skills across 42 categories** built for the [Claude Skills system](https://docs.claude.com), [OpenAI Codex](https://openai.com), [Google Antigravity](https://deepmind.google), Cursor, Windsurf, and Cline. It combines:

1. **REA (Reverse Engineer Anything) Core & Full Source Recovery (17 skills):** Disassemble PE/ELF/Mach-O binaries, decompile Android APKs/iOS IPAs, unpack Webpack/Vite/WASM/Electron bundles, dissect PCAP/Protobuf protocols, extract Unity/Unreal/Godot game assets, and reconstruct **100% compilable source code with zero skeletons (`// TODO` banned)**.
2. **Multi-Agent Intelligence & Browser MCP Suite (9 skills):** owner authorization, Everything Claude Code (ECC) engineering rigor, Agent Reach zero-fee internet intelligence, SurfSense air-gapped RAG, and triple-engine browser automation (Playwright, Bright Data, Hyperbrowser).
3. **23-Category Security Assessment & Vulnerability Research Library (79 skills integrated from `claude-red`):** Structured `SKILL.md` methodologies spanning Web OWASP Top 10, JWT/OAuth, Active Directory, Wireless/BLE/Zigbee/LoRa, Cloud, Mobile MASVS, IoT/Firmware, Binary Mitigations, Crash Analysis, Coverage-Guided Fuzzing (AFL++/libFuzzer), APIs, Containers/Kubernetes, CI/CD, Cryptography, Supply Chain, and AI/LLM Security.
4. **63 PayloadsAllTheThings Payload Skills (NEW in v2.1.0):** The complete [swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/payloadsallthethings) library adapted as structured `SKILL.md` files — covering SQL/XSS/XXE/SSRF/SSTI/Command Injection, file upload bypass, deserialization, request smuggling, OAuth/JWT attacks, CORS, CSRF, open redirect, prototype pollution, prompt injection, race conditions, and 40+ more payload categories with full PoC content.
5. **Understand Anything Codebase Understanding & Knowledge Graph Engine (9 skills + 10 agents, NEW in v2.2.0):** Full integration of [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) — AST codebase analysis producing `.ua/knowledge-graph.json`, interactive React/xyflow dashboard with Louvain community clustering (`understand-dashboard`), deep component Q&A (`understand-chat`), git diff impact prediction (`understand-diff`), business domain flow mapping (`understand-domain`), component explainers (`understand-explain`), Figma design knowledge graphs (`understand-figma`), Karpathy LLM wiki parsing (`understand-knowledge`), and developer onboarding walkthroughs (`understand-onboard`).
6. **Anti-Slop Clean Output System (6 skills):** Integrated from [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) — stopping generic AI interfaces, robotic comments, hyperbole marketing copy, mobile reflow issues, and accessibility flaws.
7. **Design Engineering & Craft Systems (3 skills):** Integrated from [pbakaus/impeccable](https://github.com/pbakaus/impeccable), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), and [educlopez/ui-craft](https://github.com/educlopez/ui-craft) — 24-command design steering vocabulary (`/impeccable`), Awwwards-distilled frontend art direction (`design-taste-frontend`), and 10-item designer acceptance bar (`ui-craft`).
8. **Anti-AI-Slop Writing Discipline (1 skill):** Integrated from [jalaalrd/anti-ai-slop-writing](https://github.com/jalaalrd/anti-ai-slop-writing) — eliminates 50+ robotic words, formulaic phrases, and rule-of-three tells.
9. **Persistent Memory Compression (1 skill):** Integrated from [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) — cross-session memory compression system distilling conversation transcripts into durable project snapshots.
10. **High-Performance Headless Browser (1 skill):** Integrated from [lightpanda-io/browser](https://github.com/lightpanda-io/browser) — headless browser built in Zig (16x lighter, 9x faster than Chromium) with full CDP compatibility.
11. **Expanded REA Core & Everything Claude Code Suite (52 skills):** 5 new REA core additions (`rea-analysis-optimization`, `rea-changelog-update`, `rea-ci-tests-audit`, `rea-tool-design`, `reverse-engineer-anything`) and 328 Everything Claude Code (ECC) skills spanning full-stack development, TDD, and multi-agent coordination.
12. **Agent Reasoning & Superpowers Suite (15 skills):** Integrated from [obra/superpowers](https://github.com/obra/superpowers) — systematic development discipline enforcing skill invocation before action, interactive brainstorming, rigorous plan drafting, subagent-driven development, test-driven development, and verification before completion.
13. **Apktool Android Reverse Engineering & Smali Pipeline (1 skill):** Integrated from [iBotPeaches/Apktool](https://github.com/iBotPeaches/Apktool) — industry-standard toolchain for decoding binary Android XMLs, disassembling DEX files into Smali, modifying resources, and rebuilding/signing modified APK packages.

Drop `REA_Skill` into your coding agent and it operates like a senior reverse engineer and security architect: skills load progressively on demand based on conversational triggers—zero wasted context window.

**Interactive Website, 500+ Unblocked Prompt Vault & AI Prompt Builder &rarr; [https://smartworldarafath.github.io/REA_Skill/](https://smartworldarafath.github.io/REA_Skill/)**

---

## Quickstart

### 1. Claude Code Native Plugin (Recommended)

```bash
/plugin marketplace add smartworldarafath/REA_Skill
/plugin install rea-skills@smartworldarafath
```

### 2. Universal Agent Skills CLI (`skills.sh`)

Works across Claude Code, OpenAI Codex, Google Antigravity, Cursor, and Windsurf:

```bash
npx skills add smartworldarafath/REA_Skill
```

### 3. Claude Skills System (`~/.claude/skills`)

```bash
git clone https://github.com/smartworldarafath/REA_Skill ~/.claude/skills/rea-skills
```

To install only specific categories via sparse checkout:

```bash
git clone --filter=blob:none --sparse https://github.com/smartworldarafath/REA_Skill
cd REA_Skill && git sparse-checkout set skills/rea-core skills/web skills/exploit-dev
```

### 4. Interactive Install Script (`./install.sh`)

```bash
./install.sh                               # interactive target prompt
./install.sh --target ~/.claude/skills     # explicit target directory
./install.sh --category rea-core           # install single category
./install.sh --category web                # install web security category
./install.sh --list                        # list all 29 categories & counts
```

### 5. Direct CLI System Prompt Piping

```bash
cat skills/rea-core/rea-full-code-recovery/SKILL.md | claude --system-file -
cat skills/web/offensive-sqli/SKILL.md | claude --system-file -
```

### 6. Connect REA MCP Server

```bash
npx -y rea-agents@latest setup
npx skills add morluto/rea --skill reverse-engineer-anything
```

---

## Categories

| Category | Skills | Focus |
|---|---:|---|
| [Reverse Engineering & Source Recovery](#reverse-engineering--source-recovery) | 17 | Full A–Z lost source code recovery, PE/ELF/Mach-O disassembly, APK/IPA, WASM, PCAP, SQLite, Unity/Unreal, firmware & interactive grilling |
| [Multi-Agent Ecosystem & Browser MCPs](#multi-agent-ecosystem--browser-mcps) | 9 | Owner authorization, 10-layer website audit, ECC TDD rigor, Agent Reach, SurfSense RAG, Playwright, Bright Data & Hyperbrowser |
| [Codebase Understanding & Knowledge Graphs](#codebase-understanding--interactive-knowledge-graphs) | 9 | AST codebase analysis, interactive React/xyflow dashboard, component Q&A, git diff impact, domain flows, Figma & Karpathy wiki graphs |
| [Web Application](#web-application) | 16 | OWASP Top 10, SQLi, XSS, SSRF, SSTI, XXE, IDOR, RCE, deserialization, race conditions, request smuggling, GraphQL & business logic |
| [Auth & Identity](#auth--identity) | 2 | JWT implementation auditing (`alg:none`, key confusion, claims) and OAuth 2.0 / OIDC flow verification (PKCE, `redirect_uri`) |
| [Active Directory](#active-directory) | 2 | On-prem & hybrid AD security auditing, Kerberos, ACLs, ADCS ESC1–15, SMB/LDAP signing & channel binding |
| [Wireless](#wireless) | 14 | 802.11, WPA2-PSK, WPA3-SAE, 802.1X/EAP, WPS, rogue AP detection, KRACK/FragAttacks, 802.11w PMF, BLE, Classic BT, Zigbee/Matter, Z-Wave & LoRaWAN |
| [Cloud](#cloud) | 1 | AWS, Azure, and GCP IAM least-privilege review, IMDSv2 enforcement, storage ACLs & cross-account trust boundaries |
| [Mobile](#mobile) | 1 | Android and iOS OWASP MASVS assessment, manifest/plist auditing, Keystore/Keychain, TLS pinning & Frida runtime triage |
| [IoT & Embedded](#iot--embedded) | 1 | Hardware debug lockdown (UART/JTAG/SWD), SPI flash encryption, Secure Boot chains, signed OTA updates & RTOS protection |
| [Infrastructure & Hardening](#infrastructure--hardening) | 7 | External attack surface, Purple Team MITRE ATT&CK validation, EDR telemetry health, PIC/loader analysis, Windows mitigations (ACG/CFG/CET/HVCI) & UAC/IL boundaries |
| [Exploit Mitigations & Crash Analysis](#exploit-mitigations--crash-analysis) | 6 | Memory corruption root-cause analysis, WinDbg/GDB/ASan crash triage, compiler hardening (RELRO/PIE/CFI), stack/format auditing & TOCTOU races |
| [Fuzzing & Vulnerability Research](#fuzzing--vulnerability-research) | 4 | Coverage-guided fuzzing (AFL++, libFuzzer, Honggfuzz), harness engineering, static/CodeQL variant analysis & CWE vulnerability taxonomy |
| [Reconnaissance](#reconnaissance) | 2 | External Attack Surface Management (EASM), Certificate Transparency logs, ASN/DNS inventory & drift monitoring |
| [API Security](#api-security) | 2 | OWASP API Top 10 across REST/GraphQL/gRPC/WebSocket, schema validation, pagination bounds & idempotency enforcement |
| [Container & Kubernetes](#container--kubernetes) | 2 | Container runtime isolation (capabilities, seccomp, rootless) and Kubernetes RBAC, Pod Security Standards & NetworkPolicies |
| [CI/CD & Pipeline](#cicd--pipeline) | 2 | GitHub Actions / GitLab CI workflow hardening (`pull_request_target`, SHA pinning) and OIDC secretless workload federation |
| [Cryptography](#cryptography) | 2 | Applied cryptography auditing (AEAD AES-GCM/ChaCha20, CSPRNG, Argon2id) and TLS 1.3 / PKI / HSTS / mTLS configuration |
| [Privilege Escalation](#privilege-escalation) | 2 | Linux (SUID, capabilities, sudoers, systemd) and Windows (service ACLs, unquoted paths, token privileges, DLL search order) boundary audits |
| [Post-Exploitation & Segmentation](#post-exploitation--segmentation) | 3 | Internal network microsegmentation, endpoint autoruns/persistence baseline auditing, and DLP egress protection |
| [Forensics & Network Detection](#forensics--network-detection) | 2 | Immutable SIEM/audit log integrity, MFT/EventLog tamper detection, and JA3/JA4/beacon network threat hunting |
| [Supply Chain](#supply-chain) | 2 | SLSA build provenance, Sigstore/Cosign signing, CycloneDX/SPDX SBOMs, and private registry dependency-confusion prevention |
| [Social Engineering & Email Auth](#social-engineering--email-auth) | 2 | SPF/DKIM/DMARC `p=reject` enforcement, FIDO2/WebAuthn passkeys, and helpdesk identity verification workflows |
| [Network Attacks](#network-attacks) | 1 | Layer 2/3 switch hardening: Dynamic ARP Inspection (DAI), DHCP Snooping, 802.1X, LLMNR/NBT-NS disablement & VLAN isolation |
| [AI Security](#ai-security) | 1 | OWASP LLM Top 10: direct/indirect prompt injection defenses, tool-call sandboxing, RAG ACLs & output validation |
| [Utility](#utility) | 2 | Rapid 15-minute pre-release security triage checklist and CVSS v3.1/v4.0 executive & technical report authoring |
| **PayloadsAllTheThings (NEW v2.1.0)** | | |
| [Payload Injection Library](#payload-injection-library) | 18 | SQL, XSS, XXE, SSRF, SSTI, Command, LDAP, NoSQL, GraphQL, XPath, XSLT, LaTeX, SAML, SSI, HTTP Param Pollution, CSV, Prototype Pollution & Prompt Injection payloads |
| [Payload Web Attacks Library](#payload-web-attacks-library) | 30 | CORS, CRLF, CSRF, Open Redirect, LFI/RFI, Path Traversal, Deserialization, File Upload, Request Smuggling, Cache Deception, OAuth, JWT, IDOR, Race Conditions, WebSocket, CSS Injection, Clickjacking, Type Juggling, Mass Assignment, Dependency Confusion, Account Takeover, Brute Force, Business Logic, API Key Leaks, CVE Exploits, Reverse Proxy, vHosts, Hidden Params, ORM Leak, CSS Injection |
| [Payload Research Library](#payload-research-library) | 14 | DOM Clobbering, Encoding, ReDoS, DNS Rebinding, Tabnabbing, XS-Leak, Headless Browser, Client-Side Path Traversal, GWT, Ext Variable, Java RMI, Insecure Randomness, Management Interface Exposure, SCM Exposure, Zip Slip |
| [Payload Resources](#payload-resources) | 1 | Pentest methodology cheatsheets: AD Attack, Reverse Shells, Network Pivoting, Linux/Windows PrivEsc, Cloud Pentest (AWS/Azure/GCP), Kubernetes, Docker |
| **Anti-Slop, Design & Memory (NEW v2.3.0)** | | |
  | [Anti-Slop Clean Output](#anti-slop-clean-output) | 6 | Core anti-slop filter, code comment hygiene, authentic copywriting, accessibility checks, mobile layouts, and UI polish |
  | [Design Taste & Engineering](#design-taste--engineering) | 3 | Impeccable 24-command design vocabulary, TasteSkill v2 gallery-distilled art direction, and UI Craft designer acceptance gates |
  | [Writing Quality & Anti-AI-Slop](#writing-quality--anti-ai-slop) | 1 | 50+ banned AI words, 35+ formulaic phrases, and structural pattern elimination for human-grade writing |
  | [Persistent Agent Memory](#persistent-agent-memory) | 1 | Claude-Mem cross-session transcript memory compression, knowledge graph distillation & multi-agent memory sharing |
  | [Headless Browser Automation](#headless-browser-automation) | 1 | Lightpanda Zig headless browser (16x lighter, 9x faster than Chromium) with full CDP support for Playwright & Puppeteer |
  | [Everything Claude Code (ECC)](#everything-claude-code-ecc) | 328 | Complete full-stack engineering suite covering TDD rigor, coding standards, CI/CD audits, and multi-agent loops |
| [Superpowers & Agent Reasoning](#superpowers--agent-reasoning) | 15 | Systematic development discipline, interactive brainstorming, test-driven development, worktree management, and verification |

---

## Skill Index

### Reverse Engineering & Source Recovery

`skills/rea-core/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`rea-universal-orchestrator`](skills/rea-core/rea-universal-orchestrator/SKILL.md) | Master artifact auto-detection & router for all 500+ Prompt Vault templates and custom reverse-engineering tasks |
| [`rea-grill-me`](skills/rea-core/rea-grill-me/SKILL.md) | *(User-Invoked)* Relentless frontier-question interview to scope reverse engineering, source recovery, or audit plans |
| [`rea-grilling`](skills/rea-core/rea-grilling/SKILL.md) | Interactive decision-tree interrogation engine computing compiler, fidelity, asset, and verification trade-offs |
| [`rea-full-code-recovery`](skills/rea-core/rea-full-code-recovery/SKILL.md) | Autonomous end-to-end A–Z lost source code recovery with Zero-Skeleton Law and 1-click multi-compiler (`build.bat`/`build.sh`) verification |
| [`rea-binary-disassembly`](skills/rea-core/rea-binary-disassembly/SKILL.md) | Complete Windows PE (`.exe`/`.dll`/`.sys`), Linux ELF (`.so`/`.deb`/`.AppImage`), and macOS Mach-O static & dynamic binary disassembly |
| [`rea-mobile-app-recovery`](skills/rea-core/rea-mobile-app-recovery/SKILL.md) | Android (APK/AAB/DEX/JNI/Flutter/React Native/Unity) & iOS (IPA/Mach-O/Swift) reconstruction + 5-Pillar MASVS scanner |
| [`rea-web-bundle-recovery`](skills/rea-core/rea-web-bundle-recovery/SKILL.md) | Webpack/Vite/Next.js AST de-minification, source map recovery, WebAssembly (`.wasm`) decompilation & Electron `.asar` unpacking |
| [`rea-protocol-api-recovery`](skills/rea-core/rea-protocol-api-recovery/SKILL.md) | PCAP packet dissection, Protobuf/gRPC `.proto` descriptor recovery, WebSockets, GraphQL & working client/server SDK generation |
| [`rea-database-storage-recovery`](skills/rea-core/rea-database-storage-recovery/SKILL.md) | SQLite, Realm, LevelDB, Apple `NSKeyedArchiver` / binary `plist`, Windows Registry hives & custom binary format parsers |
| [`rea-game-asset-recovery`](skills/rea-core/rea-game-asset-recovery/SKILL.md) | Unity (`Il2CppDumper`/`AssetStudio`), Unreal (`.pak`), Godot (`.pck`), HLSL/SPIR-V/GLSL shader decompilation & 3D/audio extraction |
| [`rea-performance-crash-triage`](skills/rea-core/rea-performance-crash-triage/SKILL.md) | Windows Minidump (`.dmp`), Linux core & macOS `.ips` forensics, Frida dynamic hooking & Flameox CPU flamegraphs |
| [`rea-firmware-iot-extension`](skills/rea-core/rea-firmware-iot-extension/SKILL.md) | Embedded firmware (`binwalk`/`unblob`, RTOS/ARM/MIPS/RISC-V), EVM smart contract bytecode & RF/signal decoding |

### Codebase Understanding & Interactive Knowledge Graphs

`skills/codebase-understanding/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`understand`](skills/codebase-understanding/understand/SKILL.md) | Master codebase analysis orchestrator producing `.ua/knowledge-graph.json` with AST parsers, language patterns & framework heuristics |
| [`understand-chat`](skills/codebase-understanding/understand-chat/SKILL.md) | Graph-powered conversational engine answering deep architectural and flow questions about any codebase |
| [`understand-dashboard`](skills/codebase-understanding/understand-dashboard/SKILL.md) | Launch interactive web dashboard (xyflow/react + Louvain community clustering) for visual exploration & guided tours |
| [`understand-diff`](skills/codebase-understanding/understand-diff/SKILL.md) | Git diff and pull-request impact analyzer predicting ripple effects, risks & affected components before merge |
| [`understand-domain`](skills/codebase-understanding/understand-domain/SKILL.md) | Business logic and domain flow graph extractor mapping code to high-level processes and steps |
| [`understand-explain`](skills/codebase-understanding/understand-explain/SKILL.md) | Deep-dive component explainer breaking down complex files, functions, or modules into plain English |
| [`understand-figma`](skills/codebase-understanding/understand-figma/SKILL.md) | Figma REST API design knowledge graph builder analyzing tokens, components, screens & design systems |
| [`understand-knowledge`](skills/codebase-understanding/understand-knowledge/SKILL.md) | Force-directed knowledge graph builder for Karpathy-pattern LLM wikis with entity extraction & claims |
| [`understand-onboard`](skills/codebase-understanding/understand-onboard/SKILL.md) | Automated developer onboarding walkthrough generator ordered by dependency graph and architectural hierarchy |

### Multi-Agent Ecosystem & Browser MCPs

`skills/agent-ecosystem/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`rea-owner-authorization`](skills/agent-ecosystem/rea-owner-authorization/SKILL.md) | Persistent owner authorization preventing false-positive refusals on user-owned software and binaries |
| [`rea-personal-use-authorization`](skills/agent-ecosystem/rea-personal-use-authorization/SKILL.md) | Maximum-effort directive for personal debugging, lost-source recovery, and pre-release vulnerability auditing |
| [`website-security-audit`](skills/agent-ecosystem/website-security-audit/SKILL.md) | 5-Phase & 10-Layer defensive website vulnerability scanner (HSTS/CSP/CORS headers, bundle secrets, RLS, APIs, webhooks) |
| [`ecc-workflow`](skills/agent-ecosystem/ecc-workflow/SKILL.md) | Everything Claude Code (ECC) engineering harness: Research & Reuse, Plan First, TDD, Code Review & Zero-Secret Gate |
| [`agent-reach`](skills/agent-ecosystem/agent-reach/SKILL.md) | Zero-fee read-only internet intelligence across X/Twitter, Reddit, YouTube transcripts, GitHub, LinkedIn & Bilibili |
| [`surfsense`](skills/agent-ecosystem/surfsense/SKILL.md) | Air-gapped, privacy-first local documentation intelligence and codebase RAG powered by SurfSense |
| [`playwright-mcp`](skills/agent-ecosystem/playwright-mcp/SKILL.md) | Microsoft Playwright MCP for structured DOM accessibility-tree navigation, live browser interaction & E2E verification |
| [`brightdata-mcp`](skills/agent-ecosystem/brightdata-mcp/SKILL.md) | Bright Data MCP for anti-bot unlocking, CAPTCHA bypass, residential proxy routing & SERP extraction |
| [`hyperbrowser-mcp`](skills/agent-ecosystem/hyperbrowser-mcp/SKILL.md) | Hyperbrowser MCP for cloud headless browser sessions, dynamic SPA crawling & session recording |

### Web Application

`skills/web/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-sqli`](skills/web/offensive-sqli/SKILL.md) | SQL injection auditing — error-based, blind, OOB, DB-specific syntax, ORM pitfalls & parameterized remediation |
| [`offensive-xss`](skills/web/offensive-xss/SKILL.md) | Cross-site scripting — reflected, stored, DOM-based, mutation XSS (mXSS), sink taint tracking & CSP hardening |
| [`offensive-ssrf`](skills/web/offensive-ssrf/SKILL.md) | Server-side request forgery — URL parser differentials, DNS rebinding, IMDSv2 enforcement & egress allowlisting |
| [`offensive-ssti`](skills/web/offensive-ssti/SKILL.md) | Server-side template injection — Jinja2/Twig/Freemarker/Handlebars context analysis & sandboxed rendering |
| [`offensive-xxe`](skills/web/offensive-xxe/SKILL.md) | XML external entity — external DTD/entity resolution auditing across XML/SOAP/SAML/SVG/DOCX & parser hardening |
| [`offensive-idor`](skills/web/offensive-idor/SKILL.md) | Insecure direct object references (BOLA/IDOR) — horizontal/vertical privilege matrices, tenant isolation & RLS checks |
| [`offensive-file-upload`](skills/web/offensive-file-upload/SKILL.md) | File upload security — magic-byte validation, path traversal, Zip Slip, polyglots & isolated object storage |
| [`offensive-rce`](skills/web/offensive-rce/SKILL.md) | Remote code execution — command injection sink auditing, argument separation, dynamic eval removal & sandboxing |
| [`offensive-deserialization`](skills/web/offensive-deserialization/SKILL.md) | Insecure deserialization — Java, .NET, PHP, Python & Node serialization gadget reachability & safe schema formats |
| [`offensive-race-condition`](skills/web/offensive-race-condition/SKILL.md) | Race conditions — TOCTOU windows, HTTP/2 single-packet concurrent testing, row locking & idempotency keys |
| [`offensive-request-smuggling`](skills/web/offensive-request-smuggling/SKILL.md) | HTTP request smuggling — CL.TE, TE.CL, H2.CL downgrade desync & reverse-proxy framing normalization |
| [`offensive-open-redirect`](skills/web/offensive-open-redirect/SKILL.md) | Open redirect — returnUrl validation, authority confusion, OAuth token leakage prevention & strict allowlists |
| [`offensive-parameter-pollution`](skills/web/offensive-parameter-pollution/SKILL.md) | HTTP parameter pollution — duplicate query/body/JSON key precedence across gateways and backend frameworks |
| [`offensive-graphql`](skills/web/offensive-graphql/SKILL.md) | GraphQL security — introspection control, query depth/complexity limits, batching rate limits & resolver authz |
| [`offensive-waf-bypass`](skills/web/offensive-waf-bypass/SKILL.md) | WAF normalization audit — encoding discrepancies, body inspection limits & root application-layer remediation |
| [`offensive-business-logic`](skills/web/offensive-business-logic/SKILL.md) | Business logic flaws — workflow state machine enforcement, boundary/negative value checks & multi-step invariants |

### Auth & Identity

`skills/auth/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-jwt`](skills/auth/offensive-jwt/SKILL.md) | JWT security — `alg:none` rejection, RS256/HS256 key confusion, `jwk`/`jku`/`kid` injection, secret entropy & claim checks |
| [`offensive-oauth`](skills/auth/offensive-oauth/SKILL.md) | OAuth 2.0 & OIDC — exact `redirect_uri` validation, PKCE (`S256`) enforcement, `state` CSRF binding & account linking |

### Active Directory

`skills/active-directory/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-active-directory`](skills/active-directory/offensive-active-directory/SKILL.md) | Active Directory methodology — Kerberoast/AS-REP exposure, BloodHound ACL paths, ADCS ESC1–15, delegation & tiering |
| [`offensive-netexec`](skills/active-directory/offensive-netexec/SKILL.md) | Enterprise protocol audit — SMB signing, LDAP signing/channel binding, NTLM relay mitigation & LAPS verification |

### Wireless

`skills/wireless/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-wifi`](skills/wireless/offensive-wifi/SKILL.md) | 802.11 wireless security overview — SSID segmentation, WPA2/WPA3/802.1X architecture & assessment planning |
| [`offensive-wifi-recon`](skills/wireless/offensive-wifi-recon/SKILL.md) | Wireless airspace audit — 2.4/5/6 GHz spectrum mapping, beacon/cipher enumeration & rogue AP detection |
| [`offensive-wpa2-psk`](skills/wireless/offensive-wpa2-psk/SKILL.md) | WPA2-PSK assessment — EAPOL 4-way handshake / PMKID exposure analysis, passphrase entropy & WPA3 migration |
| [`offensive-wpa3-sae`](skills/wireless/offensive-wpa3-sae/SKILL.md) | WPA3-SAE audit — transition-mode downgrade checks, mandatory 802.11w PMF verification & H2E support |
| [`offensive-wpa-enterprise`](skills/wireless/offensive-wpa-enterprise/SKILL.md) | WPA-Enterprise (802.1X/EAP) — EAP-TLS vs PEAP/TTLS, supplicant RADIUS certificate validation & NAC isolation |
| [`offensive-wps`](skills/wireless/offensive-wps/SKILL.md) | Wi-Fi Protected Setup (WPS) — beacon IE inspection, Pixie Dust offline/online PIN risk check & WPS disablement |
| [`offensive-evil-twin`](skills/wireless/offensive-evil-twin/SKILL.md) | Rogue AP resilience — WIDS/WIPS detection verification, auto-connect hygiene & certificate-pinned 802.1X profiles |
| [`offensive-krack-fragattacks`](skills/wireless/offensive-krack-fragattacks/SKILL.md) | 802.11 protocol patches — KRACK key reinstallation & FragAttacks aggregation firmware patch verification |
| [`offensive-deauth-disassoc`](skills/wireless/offensive-deauth-disassoc/SKILL.md) | Management Frame Protection — 802.11w (PMF) enforcement auditing for deauthentication/disassociation frames |
| [`offensive-bluetooth-ble`](skills/wireless/offensive-bluetooth-ble/SKILL.md) | Bluetooth Low Energy (BLE) — GATT service/characteristic permissions, LE Secure Connections (ECDH) & bonding |
| [`offensive-bluetooth-classic`](skills/wireless/offensive-bluetooth-classic/SKILL.md) | Bluetooth Classic (BR/EDR) — SDP enumeration, Secure Simple Pairing, KNOB/BIAS key entropy & HID restrictions |
| [`offensive-zigbee-thread-matter`](skills/wireless/offensive-zigbee-thread-matter/SKILL.md) | 802.15.4 mesh security — Zigbee install codes, Trust Center key rotation, Thread commissioning & Matter DAC/PAA |
| [`offensive-z-wave`](skills/wireless/offensive-z-wave/SKILL.md) | Z-Wave security — S2 ECDH DSK commissioning verification, legacy S0 downgrade prevention & hub hardening |
| [`offensive-lorawan-sub-ghz`](skills/wireless/offensive-lorawan-sub-ghz/SKILL.md) | LoRaWAN & Sub-GHz RF — OTAA vs ABP provisioning, secure element AppKey storage & frame counter replay checks |

### Cloud

`skills/cloud/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-cloud`](skills/cloud/offensive-cloud/SKILL.md) | Multi-cloud audit (AWS/Azure/GCP) — IAM privilege escalation paths, IMDSv2, storage bucket ACLs & cross-account trust |

### Mobile

`skills/mobile/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-mobile`](skills/mobile/offensive-mobile/SKILL.md) | Android & iOS MASVS audit — manifest/plist review, Keystore/Keychain storage, TLS pinning & Frida runtime triage |

### IoT & Embedded

`skills/iot/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-iot`](skills/iot/offensive-iot/SKILL.md) | IoT/OT & embedded security — UART/JTAG lockdown, flash encryption, Secure Boot chains, signed OTA & RTOS hardening |
| [Reverse Engineering Wi-Fi Router](https://github.com/smartworldarafath/Reverse-Engineer-WiFi-Router) | Complete technical framework for reverse engineering Wi-Fi router hardware, UART/SPI flash extraction, MIPS/ARM daemon disassembly, and TR-069 ACS telemetry audits |

### Infrastructure & Hardening

`skills/infrastructure/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-initial-access`](skills/infrastructure/offensive-initial-access/SKILL.md) | External perimeter audit — internet-facing asset inventory, VPN/ZTNA MFA enforcement & edge appliance patching |
| [`offensive-advanced-redteam`](skills/infrastructure/offensive-advanced-redteam/SKILL.md) | Purple Team & adversary emulation — MITRE ATT&CK telemetry validation, SOC alerting & detection gap analysis |
| [`offensive-edr-evasion`](skills/infrastructure/offensive-edr-evasion/SKILL.md) | EDR sensor resilience — ETW, AMSI, kernel callback telemetry verification & tamper-protection auditing |
| [`offensive-shellcode`](skills/infrastructure/offensive-shellcode/SKILL.md) | PIC & loader analysis — position-independent code disassembly, PEB resolution patterns & ACG/CFG/W^X verification |
| [`offensive-keylogger-arch`](skills/infrastructure/offensive-keylogger-arch/SKILL.md) | Input API telemetry & defense — monitoring `SetWindowsHookEx`/`RawInput`/`evdev`, UIPI isolation & detection rules |
| [`offensive-windows-mitigations`](skills/infrastructure/offensive-windows-mitigations/SKILL.md) | Windows exploit mitigations — High-Entropy ASLR, DEP, CFG, XFG, Intel CET Shadow Stacks & HVCI verification |
| [`offensive-windows-boundaries`](skills/infrastructure/offensive-windows-boundaries/SKILL.md) | Windows security boundaries — Mandatory Integrity Control (MIC), AppContainer sandboxes & privileged RPC/ALPC/COM audit |

### Exploit Mitigations & Crash Analysis

`skills/exploit-dev/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-exploit-development`](skills/exploit-dev/offensive-exploit-development/SKILL.md) | Memory corruption root-cause analysis — stack/heap overflows, UAF lifecycle tracking & sanitizer verification |
| [`offensive-exploit-dev-course`](skills/exploit-dev/offensive-exploit-dev-course/SKILL.md) | Binary security curriculum — x86_64/ARM64 calling conventions, stack layouts, allocator internals & compiler flags |
| [`offensive-basic-exploitation`](skills/exploit-dev/offensive-basic-exploitation/SKILL.md) | Stack & format string audit — unsafe C library sink removal, `-fstack-protector-strong` & `-Wformat-security` |
| [`offensive-crash-analysis`](skills/exploit-dev/offensive-crash-analysis/SKILL.md) | Crash dump triage — WinDbg/GDB/LLDB analysis, ASan/MSan/UBSan interpretation & minimal reproducer generation |
| [`offensive-mitigations`](skills/exploit-dev/offensive-mitigations/SKILL.md) | Compiler & linker hardening — Full RELRO, PIE, Stack Canaries, `_FORTIFY_SOURCE=3`, Clang CFI & SafeStack |
| [`offensive-toctou`](skills/exploit-dev/offensive-toctou/SKILL.md) | Filesystem & kernel TOCTOU — symlink/oplock race auditing, double-fetch bugs & atomic `openat2` remediation |

### Fuzzing & Vulnerability Research

`skills/fuzzing/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-fuzzing`](skills/fuzzing/offensive-fuzzing/SKILL.md) | Coverage-guided fuzzing — AFL++, libFuzzer, Honggfuzz & Cargo-Fuzz harness writing, corpus curation & sanitizers |
| [`offensive-fuzzing-course`](skills/fuzzing/offensive-fuzzing-course/SKILL.md) | Automated bug discovery curriculum — greybox, grammar, snapshot & differential fuzzing in CI/CD (OSS-Fuzz) |
| [`offensive-bug-identification`](skills/fuzzing/offensive-bug-identification/SKILL.md) | Static & variant bug hunting — CodeQL/Semgrep taint tracking, sink-to-source reachability & security patch diffing |
| [`offensive-vuln-classes`](skills/fuzzing/offensive-vuln-classes/SKILL.md) | Software vulnerability taxonomy — CWE reference across integer, memory, parser differential & state machine flaws |

### Reconnaissance

`skills/recon/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-osint`](skills/recon/offensive-osint/SKILL.md) | External asset discovery — Certificate Transparency logs, DNS/ASN mapping, cloud asset inventory & git leak checks |
| [`offensive-osint-methodology`](skills/recon/offensive-osint-methodology/SKILL.md) | Structured attack-surface management — continuous asset cataloging, SaaS dependency mapping & drift alerting |

### API Security

`skills/api/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-api-security`](skills/api/offensive-api-security/SKILL.md) | REST, GraphQL & gRPC API audit — OWASP API Top 10, BOLA/BFLA, mass assignment, OpenAPI validation & mTLS |
| [`offensive-api-abuse`](skills/api/offensive-api-abuse/SKILL.md) | API business logic & anti-scraping — pagination bounds, bulk export controls, idempotency & cost-based rate limits |

### Container & Kubernetes

`skills/container/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-container-escape`](skills/container/offensive-container-escape/SKILL.md) | Container isolation — `--privileged` & capability auditing (`CAP_SYS_ADMIN`), seccomp/AppArmor & rootless namespaces |
| [`offensive-k8s-attacks`](skills/container/offensive-k8s-attacks/SKILL.md) | Kubernetes cluster audit — RBAC least privilege, Pod Security Standards, kubelet/etcd auth & CNI NetworkPolicies |

### CI/CD & Pipeline

`skills/cicd/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-cicd-pipeline`](skills/cicd/offensive-cicd-pipeline/SKILL.md) | CI/CD pipeline hardening — `pull_request_target` safety, expression injection, SHA-pinned actions & ephemeral runners |
| [`offensive-cicd-secrets`](skills/cicd/offensive-cicd-secrets/SKILL.md) | CI/CD secret hygiene — OIDC workload federation, scoped `GITHUB_TOKEN` permissions, log masking & vault gates |

### Cryptography

`skills/crypto/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-crypto-attacks`](skills/crypto/offensive-crypto-attacks/SKILL.md) | Cryptographic implementation audit — AEAD (AES-GCM/ChaCha20), nonce uniqueness, constant-time checks, CSPRNG & Argon2id |
| [`offensive-tls-attacks`](skills/crypto/offensive-tls-attacks/SKILL.md) | TLS/SSL & PKI configuration — TLS 1.3 enforcement, ECDHE forward secrecy, HSTS preload, CAA records & mTLS |

### Privilege Escalation

`skills/privesc/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-linux-privesc`](skills/privesc/offensive-linux-privesc/SKILL.md) | Linux privilege boundary audit — SUID/SGID, file capabilities, `sudoers` rules, systemd unit ACLs & sysctl hardening |
| [`offensive-windows-privesc`](skills/privesc/offensive-windows-privesc/SKILL.md) | Windows privilege boundary audit — service/registry ACLs, unquoted paths, token privileges & DLL search order |

### Post-Exploitation & Segmentation

`skills/post-exploitation/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-lateral-movement`](skills/post-exploitation/offensive-lateral-movement/SKILL.md) | Internal segmentation audit — Credential Guard, Local Account Token Filter, host firewalls & zero-trust bastions |
| [`offensive-persistence`](skills/post-exploitation/offensive-persistence/SKILL.md) | Endpoint persistence hunting — Registry Run keys, scheduled tasks, WMI subscriptions, systemd units & PAM integrity |
| [`offensive-data-exfiltration`](skills/post-exploitation/offensive-data-exfiltration/SKILL.md) | DLP & egress protection — DNS/HTTPS egress filtering, VPC Service Controls & bulk query anomaly detection |

### Forensics & Network Detection

`skills/forensics/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-anti-forensics`](skills/forensics/offensive-anti-forensics/SKILL.md) | Forensic readiness & log integrity — immutable SIEM forwarding, EventLog/auditd tamper detection & MFT consistency |
| [`offensive-c2-frameworks`](skills/forensics/offensive-c2-frameworks/SKILL.md) | C2 traffic hunting — JA3/JA4 TLS fingerprinting, beacon jitter statistical analysis & DNS tunneling detection |

### Supply Chain

`skills/supply-chain/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-supply-chain`](skills/supply-chain/offensive-supply-chain/SKILL.md) | Software supply chain — SLSA provenance, Sigstore/Cosign artifact signing, lockfile integrity & CycloneDX/SPDX SBOMs |
| [`offensive-dependency-confusion`](skills/supply-chain/offensive-dependency-confusion/SKILL.md) | Dependency confusion — private npm/PyPI/Maven/NuGet/Cargo namespace scoping & upstream proxy routing |

### Social Engineering & Email Auth

`skills/social-engineering/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-phishing`](skills/social-engineering/offensive-phishing/SKILL.md) | Email authentication & FIDO2 — SPF `-all`, DKIM, DMARC `p=reject`, lookalike domain monitoring & WebAuthn passkeys |
| [`offensive-social-engineering`](skills/social-engineering/offensive-social-engineering/SKILL.md) | Identity verification workflows — helpdesk MFA reset approval gates, out-of-band callbacks & physical access controls |

### Network Attacks

`skills/network/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-network-attacks`](skills/network/offensive-network-attacks/SKILL.md) | Layer 2/3 network hardening — Dynamic ARP Inspection (DAI), DHCP Snooping, 802.1X, LLMNR/NBT-NS disablement & VLANs |

### AI Security

`skills/ai/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-ai-security`](skills/ai/offensive-ai-security/SKILL.md) | AI/LLM security (OWASP LLM Top 10) — prompt injection defenses, tool-call sandboxing, RAG ACLs & output encoding |

### Utility

`skills/utility/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`offensive-fast-checking`](skills/utility/offensive-fast-checking/SKILL.md) | Rapid 15-minute security triage checklist across auth, headers, secrets, dependencies, APIs & binary mitigations |
| [`offensive-reporting`](skills/utility/offensive-reporting/SKILL.md) | Professional security report writing — risk-led executive summaries, CVSS v3.1/v4.0 vectors, CWEs & remediation code |

---

## PayloadsAllTheThings Integration (v2.1.0)

> 63 skills from [swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/payloadsallthethings) fully integrated as structured `SKILL.md` files with operational workflows, REA MCP integration, and the complete payload reference content.

### Payload Injection Library

`skills/payloads-injection/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`payloads-sqli`](skills/payloads-injection/payloads-sqli/SKILL.md) | SQL Injection payloads — error-based, UNION, blind, time-based, and WAF bypass techniques |
| [`payloads-xss`](skills/payloads-injection/payloads-xss/SKILL.md) | XSS payloads — reflected, stored, DOM, filter bypass, and polyglot vectors |
| [`payloads-xxe`](skills/payloads-injection/payloads-xxe/SKILL.md) | XXE injection payloads — file read, SSRF, blind OOB, and DOCTYPE bypass |
| [`payloads-ssti`](skills/payloads-injection/payloads-ssti/SKILL.md) | SSTI payloads — Jinja2, Twig, Freemarker, Pebble, ERB, and Velocity templates |
| [`payloads-ssrf`](skills/payloads-injection/payloads-ssrf/SKILL.md) | SSRF payloads — cloud metadata bypass, URL filter bypass, and Gopher protocol chains |
| [`payloads-cmdi`](skills/payloads-injection/payloads-cmdi/SKILL.md) | Command injection payloads — Linux, Windows, blind OOB, and filter bypass operators |
| [`payloads-ldap`](skills/payloads-injection/payloads-ldap/SKILL.md) | LDAP injection payloads — authentication bypass and directory enumeration |
| [`payloads-nosqli`](skills/payloads-injection/payloads-nosqli/SKILL.md) | NoSQL injection payloads — MongoDB, CouchDB, Redis operator injection and bypass |
| [`payloads-graphql`](skills/payloads-injection/payloads-graphql/SKILL.md) | GraphQL injection — introspection abuse, batching attacks, authorization bypass |
| [`payloads-xpath`](skills/payloads-injection/payloads-xpath/SKILL.md) | XPath injection payloads for XML authentication bypass and data extraction |
| [`payloads-xslt`](skills/payloads-injection/payloads-xslt/SKILL.md) | XSLT injection payloads — RCE via server-side XML transformation abuse |
| [`payloads-latex`](skills/payloads-injection/payloads-latex/SKILL.md) | LaTeX injection payloads — file read and command execution in PDF/math renderers |
| [`payloads-saml`](skills/payloads-injection/payloads-saml/SKILL.md) | SAML injection payloads — XML signature wrapping, SSO bypass, and assertion forgery |
| [`payloads-ssi`](skills/payloads-injection/payloads-ssi/SKILL.md) | SSI injection payloads — Apache/Nginx Server-Side Include RCE and file disclosure |
| [`payloads-hpp`](skills/payloads-injection/payloads-hpp/SKILL.md) | HTTP Parameter Pollution payloads — WAF bypass via duplicate parameter manipulation |
| [`payloads-csv`](skills/payloads-injection/payloads-csv/SKILL.md) | CSV/formula injection payloads — spreadsheet-based code execution via cell injection |
| [`payloads-proto-pollution`](skills/payloads-injection/payloads-proto-pollution/SKILL.md) | Prototype pollution payloads — server-side Node.js and client-side browser exploitation |
| [`payloads-prompt-injection`](skills/payloads-injection/payloads-prompt-injection/SKILL.md) | LLM prompt injection payloads — goal hijacking, data exfiltration, and jailbreak vectors |

### Payload Web Attacks Library

`skills/payloads-web/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`payloads-cors`](skills/payloads-web/payloads-cors/SKILL.md) | CORS misconfiguration payloads — cross-origin credential and token theft PoC scripts |
| [`payloads-crlf`](skills/payloads-web/payloads-crlf/SKILL.md) | CRLF injection payloads — HTTP response splitting, header injection, log poisoning |
| [`payloads-csrf`](skills/payloads-web/payloads-csrf/SKILL.md) | CSRF payload templates — form-based, JSON, and CORS token bypass PoCs |
| [`payloads-open-redirect`](skills/payloads-web/payloads-open-redirect/SKILL.md) | Open redirect bypass payloads — OAuth token theft and phishing via URL manipulation |
| [`payloads-lfi-rfi`](skills/payloads-web/payloads-lfi-rfi/SKILL.md) | LFI/RFI payloads — log poisoning, PHP filter chains, and remote file inclusion |
| [`payloads-path-traversal`](skills/payloads-web/payloads-path-traversal/SKILL.md) | Path traversal payloads — encoding variants, null bytes, and filter bypass |
| [`payloads-deserial`](skills/payloads-web/payloads-deserial/SKILL.md) | Insecure deserialization payloads — Java/PHP/Python/.NET gadget chains |
| [`payloads-file-upload`](skills/payloads-web/payloads-file-upload/SKILL.md) | File upload bypass payloads — extension tricks, MIME manipulation, polyglot files |
| [`payloads-smuggling`](skills/payloads-web/payloads-smuggling/SKILL.md) | Request smuggling payloads — CL.TE, TE.CL, and TE.TE HTTP desync attacks |
| [`payloads-cache-deception`](skills/payloads-web/payloads-cache-deception/SKILL.md) | Web cache deception payloads — path confusion to cache authenticated responses |
| [`payloads-oauth`](skills/payloads-web/payloads-oauth/SKILL.md) | OAuth misconfiguration payloads — token theft, open redirect chains, PKCE bypass |
| [`payloads-jwt`](skills/payloads-web/payloads-jwt/SKILL.md) | JWT attack payloads — alg:none, HMAC confusion, kid injection, JWK spoofing |
| [`payloads-idor`](skills/payloads-web/payloads-idor/SKILL.md) | IDOR/BOLA payloads — object ID manipulation and horizontal/vertical access bypass |
| [`payloads-race-condition`](skills/payloads-web/payloads-race-condition/SKILL.md) | Race condition payloads — concurrent request timing attacks for state manipulation |
| [`payloads-websocket`](skills/payloads-web/payloads-websocket/SKILL.md) | WebSocket attack payloads — CSWSH, message injection, and protocol upgrade attacks |
| [`payloads-css-injection`](skills/payloads-web/payloads-css-injection/SKILL.md) | CSS injection payloads — data exfiltration via attribute selector timing oracles |
| [`payloads-clickjacking`](skills/payloads-web/payloads-clickjacking/SKILL.md) | Clickjacking PoC templates — iframe overlay and X-Frame-Options bypass |
| [`payloads-type-juggling`](skills/payloads-web/payloads-type-juggling/SKILL.md) | PHP type juggling payloads — loose comparison bypass for authentication logic |
| [`payloads-mass-assignment`](skills/payloads-web/payloads-mass-assignment/SKILL.md) | Mass assignment payloads — unauthorized parameter binding in web frameworks |
| [`payloads-dep-confusion`](skills/payloads-web/payloads-dep-confusion/SKILL.md) | Dependency confusion attack techniques for npm/PyPI/RubyGems package hijacking |
| [`payloads-ato`](skills/payloads-web/payloads-ato/SKILL.md) | Account takeover methodology — password reset abuse, session fixation, MFA bypass |
| [`payloads-bruteforce`](skills/payloads-web/payloads-bruteforce/SKILL.md) | Brute force & rate limit bypass — credential stuffing and enumeration techniques |
| [`payloads-bizlogic`](skills/payloads-web/payloads-bizlogic/SKILL.md) | Business logic flaw payloads — price manipulation, workflow bypass, privilege escalation |
| [`payloads-api-key-leaks`](skills/payloads-web/payloads-api-key-leaks/SKILL.md) | API key leak discovery — dorks, patterns, and exploitation of exposed credentials |
| [`payloads-cve`](skills/payloads-web/payloads-cve/SKILL.md) | CVE exploit payloads — real-world PoC scripts for known vulnerabilities |
| [`payloads-reverse-proxy`](skills/payloads-web/payloads-reverse-proxy/SKILL.md) | Reverse proxy misconfiguration — path confusion, header injection, and SSRF via proxy |
| [`payloads-vhosts`](skills/payloads-web/payloads-vhosts/SKILL.md) | Virtual host discovery — Host header manipulation for multi-tenant SSRF escalation |
| [`payloads-hidden-params`](skills/payloads-web/payloads-hidden-params/SKILL.md) | Hidden parameter discovery wordlists for attack surface expansion |
| [`payloads-orm-leak`](skills/payloads-web/payloads-orm-leak/SKILL.md) | ORM query leak payloads for Django, Hibernate, ActiveRecord data exfiltration |

### Payload Research Library

`skills/payloads-research/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`payloads-dom-clobbering`](skills/payloads-research/payloads-dom-clobbering/SKILL.md) | DOM clobbering payloads — global override via named HTML elements for XSS escalation |
| [`payloads-encoding`](skills/payloads-research/payloads-encoding/SKILL.md) | Encoding transformation payloads — URL, HTML, Unicode, base for WAF bypass |
| [`payloads-regex`](skills/payloads-research/payloads-regex/SKILL.md) | ReDoS and regex exploitation payloads — catastrophic backtracking and filter bypass |
| [`payloads-dns-rebinding`](skills/payloads-research/payloads-dns-rebinding/SKILL.md) | DNS rebinding attack payloads — SOP bypass for internal service access via browser |
| [`payloads-tabnabbing`](skills/payloads-research/payloads-tabnabbing/SKILL.md) | Reverse tabnabbing payloads — window.opener phishing for credential theft |
| [`payloads-xs-leak`](skills/payloads-research/payloads-xs-leak/SKILL.md) | XS-Leak payloads — timing oracles, cache probing, cross-origin data inference |
| [`payloads-headless`](skills/payloads-research/payloads-headless/SKILL.md) | Headless browser exploitation — SSRF/XSS/sandbox escape via Puppeteer/CDP |
| [`payloads-cspt`](skills/payloads-research/payloads-cspt/SKILL.md) | Client-side path traversal payloads — XSS gadgets via fetch URL manipulation |
| [`payloads-gwt`](skills/payloads-research/payloads-gwt/SKILL.md) | Google Web Toolkit attack payloads — RPC serialization abuse and endpoint discovery |
| [`payloads-ext-var`](skills/payloads-research/payloads-ext-var/SKILL.md) | External variable modification payloads — global scope poisoning and config injection |
| [`payloads-java-rmi`](skills/payloads-research/payloads-java-rmi/SKILL.md) | Java RMI exploitation payloads — deserialization, registry enumeration, and RCE |
| [`payloads-insecure-random`](skills/payloads-research/payloads-insecure-random/SKILL.md) | Insecure randomness exploitation — PRNG prediction and token forge attacks |
| [`payloads-mgmt-interface`](skills/payloads-research/payloads-mgmt-interface/SKILL.md) | Management interface exposure — default credentials, admin panel bypass, and enumeration |
| [`payloads-scm-exposure`](skills/payloads-research/payloads-scm-exposure/SKILL.md) | SCM exposure payloads — .git/.svn/.hg directory disclosure and source extraction |
| [`payloads-zip-slip`](skills/payloads-research/payloads-zip-slip/SKILL.md) | Zip slip payloads — arbitrary file write via malicious ZIP/TAR archive traversal |

### Payload Resources

`skills/payloads-resources/` &bull; `.agents/skills/`

| Skill | Description |
|---|---|
| [`payloads-methodology`](skills/payloads-resources/payloads-methodology/SKILL.md) | Pentest methodology cheatsheets — AD Attack, Reverse Shells, Network Pivoting, Linux/Windows PrivEsc, Cloud Pentest (AWS/Azure/GCP), Kubernetes, Docker |

---

### AI Penetration Testing (Strix)

`skills/strix/` &bull; `.agents/skills/strix/`

| Skill | Description |
|---|---|
| [`strix`](skills/strix/SKILL.md) | Autonomous AI penetration testing — find and fix vulnerabilities in applications and web services with the Strix AI pentest agent |

| [`gtfobins`](skills/gtfobins/SKILL.md) | GTFOBins Unix binary bypass reference for privilege escalation and post-exploitation on unrestricted systems |

---

## Supported Platforms & MCP Configuration

| AI Agent / Runtime | Configuration Files | Format | Loading Mode |
|---|---|---|---|
| <img src="assets/logos/direct/google-antigravity.svg" width="18" height="18" align="absmiddle" /> **Google Antigravity** | `.agents/skills/*/SKILL.md` | Agent Skills YAML + Markdown | Progressive on-demand discovery |
| <img src="assets/logos/direct/claude.svg" width="18" height="18" align="absmiddle" /> **Claude Code / Claude.ai** | `.claude-plugin/plugin.json` & `CLAUDE.md` | Native Plugin + `@AGENTS.md` | 1-click plugin & root instruction |
| <img src="assets/logos/direct/codex.svg" width="18" height="18" align="absmiddle" /> **OpenAI Codex** | `AGENTS.md` & `agents/openai.yaml` | Dual-harness YAML + Markdown | Skill picker UI + persistent rules |
| <img src="assets/logos/direct/cursor.svg" width="18" height="18" align="absmiddle" /> **Cursor IDE** | `.cursor/rules/*.mdc` | Cursor MDC frontmatter | `alwaysApply: true` workspace rules |
| <img src="assets/logos/direct/copilot.svg" width="18" height="18" align="absmiddle" /> **GitHub Copilot** | `.github/copilot-instructions.md` | Standard Markdown | Workspace context instructions |
| <img src="assets/logos/direct/jules.svg" width="18" height="18" align="absmiddle" /> **Google Jules** | `.agents/skills/*/SKILL.md` | Agent Skills Standard | Autonomous cloud coding agent |
| <img src="assets/logos/direct/kimi.svg" width="18" height="18" align="absmiddle" /> **Moonshot Kimi** | `AGENTS.md` | Standard Markdown | Long-context instruction |
| <img src="assets/logos/direct/openclaw.svg" width="18" height="18" align="absmiddle" /> **OpenClaw** | `skills/*/*/SKILL.md` | Agent Skills Standard | Open agent harness |
| <img src="assets/logos/direct/opencode.svg" width="18" height="18" align="absmiddle" /> **OpenCode** | `AGENTS.md` | OpenCode CLI format | Terminal coding agent |
| **Windsurf & Cline** | `.windsurf/rules/*.md` & `.clinerules/*.md` | Plain Markdown | Workspace task rules |

### Unified `.mcp.json`

```json
{
  "mcpServers": {
    "rea": { "command": "npx", "args": ["-y", "rea-agents@latest", "run"] },
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "brightdata": {
      "command": "npx",
      "args": ["-y", "@brightdata/mcp"],
      "env": { "BRIGHTDATA_API_KEY": "${BRIGHTDATA_API_KEY}" }
    },
    "hyperbrowser": {
      "command": "npx",
      "args": ["-y", "hyperbrowser-mcp"],
      "env": { "HYPERBROWSER_API_KEY": "${HYPERBROWSER_API_KEY}" }
    }
  }
}
```

---

## 🎯 The Problem It Solves & The Solution

When developers and security researchers use AI coding assistants to reverse-engineer, inspect, debug, test, or build on **their own apps, websites, and binaries**, AI agents frequently run into friction:

- ❌ Refusing to run decompilers, disassemblers, or REA MCP tools on false-positive cybersecurity grounds.
- ❌ Pausing every single turn to question authorization or lecturing about cybersecurity ethics.
- ❌ Outputting partial skeletons, `// TODO` stubs, or non-compiling fragments during source code recovery.
- ❌ Getting blocked by anti-bot walls (Cloudflare, CAPTCHAs) when fetching external documentation or auditing endpoints.
- ❌ Inability to interactively click, type, and verify live web applications without burning context on heavy screenshots.
- ❌ Leaking proprietary code or research notes to third-party cloud vector stores.

### 💡 The Solution

- ✅ **Persistent Owner Authorization:** Recognizes you as the verified owner and developer of target software, eliminating repetitive justification hurdles.
- ✅ **Zero-Skeleton Full Code Recovery:** Reconstructs 100% complete, compilable source code with 1-click multi-compiler verification (`build.bat` / `build.sh`).
- ✅ **ECC Engineering Rigor:** Enforces the 6-stage development pipeline (Research & Reuse → Plan First → TDD → Code Review → Zero-Secret Audit → Verification).
- ✅ **169 Specialized Skills Across 34 Categories:** Covers every reverse-engineering, binary, mobile, web, wireless, cloud, fuzzing, and security-auditing surface.
- ✅ **Live Web Intelligence & Triple-Engine Browser Automation:** Agent Reach, Microsoft Playwright MCP, Bright Data MCP, and Hyperbrowser MCP.
- ✅ **Air-Gapped Document Intelligence:** Private local research and note synthesis powered by SurfSense and local LLMs.

---

## ⚡ Autonomous Coding Agents vs. Standard Chat LLMs (Tier-1 Native Execution)

While the **500+ Unblocked Prompts** in this repository work seamlessly in conversational Chat UIs (ChatGPT, Gemini Web, Claude.ai, Kimi Web, GLM) without safety refusals, their full power is unleashed when executed inside **Tier-1 Autonomous Coding Agents** like **Claude Code, Google Antigravity, OpenAI Codex, Cursor, and Windsurf**.

> **The Core Difference:** Standard chat UIs only produce conversational explanations and Markdown code snippets on-screen. Autonomous coding agents, by contrast, **directly interface with your local file system, run disassemblers, execute REA MCP tools, create source trees, run compilers, and autonomously verify 0 errors and 0 warnings**.

### 🛠️ Execution Capabilities by Agent Framework

#### 1. <img src="assets/logos/direct/google-antigravity.svg" width="20" height="20" align="absmiddle" /> Google Antigravity
* **Support Level:** **100% Native Integration**
* **How It Works:**
  - Antigravity directly loads all **169 skills** from `.agents/skills/*/SKILL.md` using progressive on-demand discovery.
  - When passed `$rea-full-code-recovery` or `$rea-personal-use-authorization`, Antigravity operates without refusal or lecturing, directly analyzing compiled local binaries (`.exe`, `.apk`, `.wasm`, `.js`).
  - Terminal-integrated multi-compiler verification: Antigravity automatically executes `build.bat` / `build.sh` (MSVC, Zig CC, MinGW GCC, Gradle) to verify compiler exit codes and ensure **0 errors and 0 warnings** before concluding.

#### 2. <img src="assets/logos/direct/claude.svg" width="20" height="20" align="absmiddle" /> Claude Code (Anthropic Official CLI)
* **Support Level:** **Official Native Plugin Architecture**
* **How It Works:**
  - Fully packaged as a native Claude Code plugin via `.claude-plugin/plugin.json` and `marketplace.json`.
  - 1-click install directly from Claude Code CLI:
    ```bash
    /plugin marketplace add smartworldarafath/REA_Skill
    /plugin install rea-skills@smartworldarafath
    ```
  - Spawns parallel background subagents to concurrently disassemble binaries, decompile bytecode, and regenerate project source trees in your active workspace while completely bypassing moralizing policy friction.

#### 3. <img src="assets/logos/direct/codex.svg" width="20" height="20" align="absmiddle" /> OpenAI Codex / Codex CLI / OpenAI Operator
* **Support Level:** **Full Native Compatibility**
* **How It Works:**
  - Ingests root `AGENTS.md` and `agents/openai.yaml` automatically during session initialization.
  - Automatically activates the file editor and terminal execution loop, reconstructing lost source trees file-by-file with complete working logic.

#### 4. <img src="assets/logos/direct/cursor.svg" width="20" height="20" align="absmiddle" /> Cursor, Windsurf, Roo Code, Cline & AI IDEs
* **Support Level:** **Open Agent Skills & MCP Native**
* **How It Works:**
  - Conforms to the open `.agents/skills/` standard and provides IDE-specific rule configurations (`.cursor/rules/`, `.windsurf/rules/`, `.clinerules/`).
  - Seamlessly bridges to the local REA MCP server via `.mcp.json`, providing direct autonomous access to tools like Rizin, Ghidra, JADX, Capa, and GDB.

---

### 📊 Capability Matrix: Standard Chat LLMs vs. Autonomous Coding Agents

| Feature / Capability | Standard Chat LLMs <br>*(ChatGPT / Gemini Web / Claude.ai)* | Autonomous Coding Agents <br>*(Claude Code / Antigravity / Codex / Cursor)* |
|---|---|---|
| **Prompt Execution** | Text & conversational code blocks only | Directly creates, edits, and builds physical files on disk |
| **Binary Ingestion** | Requires manual hex/text pasting into chat | Autonomously reads `.exe`, `.apk`, `.wasm`, `.pcap` from local disk |
| **Toolchain Invocation** | None (pure text output) | Directly runs Rizin, Ghidra, Capa, JADX, Playwright, GDB |
| **Compilation Verification** | Unable to compile or test code | Automatically runs `build.bat` / `build.sh` to guarantee 0 errors |
| **Safety Refusal Rate** | **0%** *(Unblocked via Owner Authorization)* | **0%** *(Unblocked via Owner Authorization)* |
| **Delivery Gate** | Partial snippets or markdown blocks | 100% complete, compilable source tree ready for production |

> **Bottom Line:** The true power of the 500+ prompts is realized in these autonomous coding agents. They eliminate human friction entirely—taking a raw binary and autonomously delivering a verified, compiling project repository to your hard drive.

---

## Global Machine-Level Installation (Personal Dev Setup)

Configure it once on your computer so every AI agent automatically recognizes all 169 skills, rules, and MCP tools in **any** folder or project:

#### 1. Google Antigravity (Global Skills)
```bash
# Windows
xcopy /E /I /Y ".agents\skills" "%USERPROFILE%\.gemini\config\skills"

# macOS / Linux
mkdir -p ~/.gemini/config/skills
cp -r .agents/skills/* ~/.gemini/config/skills/
```

#### 2. OpenAI Codex (Global System Prompt)
```bash
# Windows
type AGENTS.md >> "%USERPROFILE%\.codex\AGENTS.md"

# macOS / Linux
cat AGENTS.md >> ~/.codex/AGENTS.md
```

#### 3. Claude Code (Global Instructions)
```bash
# Windows
type CLAUDE.md >> "%USERPROFILE%\.claude\CLAUDE.md"

# macOS / Linux
cat CLAUDE.md >> ~/.claude/CLAUDE.md
```

#### 4. Cursor (Global Rules for AI)
1. Open Cursor Settings: `Ctrl + ,` (or `Cmd + ,` on macOS).
2. Navigate to **Features** > **Rules for AI** (User Rules).
3. Paste the contents of [`AGENTS.md`](AGENTS.md).

---

## 💬 Usage Examples

### Example 1: Web Application Analysis with REA
> *"Use REA to trace and inspect the network request logic and WebSocket frames of my web app."*

### Example 2: Native Binary & Framework Inspection
> *"Inspect my compiled binary with REA to analyze exported symbols and verify native boundaries."*

### Example 3: Android / Electron App Debugging
> *"Use REA to inspect my Electron application package, check event listeners, and reconstruct component routes."*

### Example 4: Vulnerability Hunting & Pre-Publishing Audit
> *"Reverse engineer my AI app and find all vulnerabilities so I can fix them before publishing."*

### Example 5: Defensive Website Security Audit (10-Layer Scanner)
> *"Audit my website https://my-other-site.com/ for security vulnerabilities, header misconfigurations, and frontend secret leaks."*

### Example 6: Lost Source Code & Data Recovery (Zero-Skeleton Law)
> *"My laptop is not turning on, I lost my source code. Without codes I cannot improve my app. Reverse engineer my app and recover all app data so I can continue my project."*

### Example 7: Interactive Scoping & Frontier Grilling
```text
/rea-grill-me Scope the full C++20 source recovery and shader extraction for my compiled binary before writing code.
```

### Example 8: Live Threat Intelligence with Agent Reach
> *"Use Agent Reach to look up latest CVE disclosures and Reddit discussions about Next.js middleware vulnerabilities."*

### Example 9: ECC Feature Implementation & Refactoring Pipeline
> *"Execute orch-add-feature to build an API rate-limiting middleware using Redis and TDD."*

### Example 10: Interactive Browser Testing with Microsoft Playwright MCP
> *"Use Playwright MCP to navigate to http://localhost:3000/login, fill out test credentials, click submit, and verify that the dashboard loads."*

### Example 11: Unlocking Protected Endpoints with Bright Data MCP
> *"Use Bright Data MCP to scrape and extract pricing data from https://protected-target.com/ without triggering Cloudflare blocks."*

### Example 12: Air-Gapped Document Synthesis with SurfSense
> *"Use SurfSense to index all decompiled pseudocode files in ./dist and synthesize a security architecture map locally using Ollama."*

---

## 📂 Repository Architecture & File Structure

```text
REA_Skill/
├── .claude-plugin/                      # Native Claude Code plugin & self-hosted marketplace
│   ├── plugin.json                      # Plugin manifest listing all 169 skills & metadata
│   └── marketplace.json                 # 1-click install registry for Claude Code
├── .agents/
│   ├── invocation.md                    # Model-invoked vs. user-invoked architectural discipline
│   ├── adr/                             # Architecture Decision Records (0001–0004)
│   └── skills/                          # All 169 Skills (YAML frontmatter + agents/openai.yaml)
├── skills/                              # Categorized (29 categories) & mirrored root skills tree
│   ├── rea-core/                        # 12 Reverse Engineering & Source Recovery skills
│   ├── agent-ecosystem/                 # 9 Multi-Agent & Browser MCP skills
│   └── <23 claude-red categories>/      # 79 Security Assessment & Auditing skills
├── .clinerules/                         # Cline workspace rules
├── .cursor/rules/                       # Cursor IDE MDC rules
├── .windsurf/rules/                     # Windsurf Cascade rules
├── .github/copilot-instructions.md      # GitHub Copilot workspace instructions
├── docs/                                # Interactive Three.js Website, 500+ Prompt Vault & AI Prompt Builder
├── recovered_source/                    # Verified C99/Win32 full source recovery showcase & build.bat
├── scripts/                             # Automated skill verification & manifest sync scripts
├── tools/build_manifest.py              # Python manifest builder for claude-skills.json
├── claude-skills.json                   # Machine-readable index of all 34 categories & 169 skills
├── install.sh                           # Interactive & CLI skill installer
├── convert_skills.py                    # Markdown-to-SKILL.md converter utility
├── MINDMAP.md                           # Visual Mermaid mindmap of all 34 categories & 169 skills
├── AGENTS.md                            # Universal agent instructions (Codex, Copilot, Antigravity)
├── CLAUDE.md                            # Claude Code root instruction configuration
├── SECURITY.md                          # Security & responsible disclosure policy
├── CONTRIBUTING.md                      # Contributor guide & skill specification
├── CHANGELOG.md                         # Release history
├── package.json                         # npm package manifest & test runner
└── README.md                            # Complete documentation
```

---

## ⚠️ Important Boundary & Alignment Notice

---

## Roadmap

See [CHANGELOG.md](CHANGELOG.md) for release history and [MINDMAP.md](MINDMAP.md) for the full visual topology.

| Phase | Focus | Skills | Status |
|---|---|---:|---|
| 1 | REA Core — PE/ELF/Mach-O, APK/IPA, Web bundles, PCAP, SQLite, Game assets, Firmware & Crash triage | 12 | Complete |
| 2 | Multi-Agent Ecosystem — Owner auth, 10-layer web audit, ECC rigor, Agent Reach, SurfSense & Browser MCPs | 9 | Complete |
| 3 | Web, API, Auth & GraphQL Security Library (`claude-red` integration) | 20 | Complete |
| 4 | Wireless — 802.11, WPA2/3, 802.1X, WPS, BLE, Classic BT, Zigbee/Matter, Z-Wave & LoRaWAN | 14 | Complete |
| 5 | Binary Hardening, Crash Analysis, Exploit Mitigations & Coverage-Guided Fuzzing | 10 | Complete |
| 6 | Active Directory, Cloud, Containers/K8s, CI/CD, Crypto, PrivEsc, Forensics, Supply Chain & AI | 35 | Complete |
| 7 | Interactive Prompt Vault (500+ templates) & AI Prompt Builder Web App | — | Complete |
| 8 | Deep Kernel Driver & eBPF Runtime Verification Modules | +12 | Planned |
| 9 | Automated Binary Diffing & Patch-Gap Regression Suite | +10 | Planned |

Target: **120+ skills across 25+ categories**.

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the `SKILL.md` template, `agents/openai.yaml` dual-harness metadata rules, and automated validation (`npm test`). See [SECURITY.md](SECURITY.md) for our security and responsible-use policy.

## License

[MIT](LICENSE) &copy; 2026 **Arafath Rahman** (`@smartworldarafath`).

## Acknowledgements

- **REA (Reverse Engineer Anything):** [morluto/rea](https://github.com/morluto/rea) — MCP server for binary, web, mobile, and runtime reverse engineering
- **claude-red Skill Taxonomy:** [SnailSploit/claude-red](https://github.com/SnailSploit/claude-red) (Kai Aizen) & [sahar042/offensive-checklist](https://github.com/sahar042/offensive-checklist)
- **Agent Skills Architecture:** [mattpocock/skills](https://github.com/mattpocock/skills) — plugin manifest, ADR, and `grill-me` patterns
- **Engineering Rigor & Research:** [Everything Claude Code](https://github.com/affaan-m/everything-claude-code), [Agent Reach](https://github.com/Panniantong/agent-reach), and [SurfSense](https://github.com/MODSetter/SurfSense)

---

<div align="center">

*Give your coding agent the right skill and it stops guessing — it becomes a reverse engineer and security architect.*

[Live Website & 500+ Prompts](https://smartworldarafath.github.io/REA_Skill/) &bull; [GitHub Repository](https://github.com/smartworldarafath/REA_Skill) &bull; [Visual Mindmap](MINDMAP.md) &bull; [Security Policy](SECURITY.md)

</div>
