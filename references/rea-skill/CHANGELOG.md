# Changelog

All notable changes to **REA_Skill** are documented in this file.

## [2.4.0] - 2026-11-20

### Added
- Superpowers Agent Reasoning Suite (15 skills across new superpowers category): Integrated the complete agent reasoning and planning discipline from obra/superpowers including using-superpowers, brainstorming, writing-plans, executing-plans, systematic-debugging, test-driven-development, subagent-driven-development, using-git-worktrees, verification-before-completion, requesting-code-review, receiving-code-review, finishing-a-development-branch, diagnosing-superpowers, dispatching-parallel-agents, and writing-skills.
- Apktool Android Binary Reverse Engineering Toolchain (apktool in mobile category): Integrated the industry-standard reverse engineering toolchain from iBotPeaches/Apktool. Decodes binary XMLs and resources.arsc to human-readable form, disassembles classes.dex into Smali bytecode, enables manifest permission patching, rebuilds modified APKs with aapt2, and signs with zipalign and apksigner.
- Expanded Everything Claude Code (ECC) Engineering Suite: Added 282 new specialized software engineering skills from affaan-m/ecc, expanding the ECC collection to 328 skills covering framework design patterns (React, Next.js, Angular, Vue, Django, Spring Boot, Quarkus, Laravel, Go, Rust, C#, .NET), observability, security audits, database query tuning, and autonomous testing.
- Optimized Agent Reach Internet Intelligence: Updated agent-reach from Panniantong/agent-reach with dedicated parsers for Reddit comment trees, LinkedIn company profiles, Instagram bios and posts, Zhihu discussions, and Substack publication feeds.
- Total library scale: 541 skills across 42 categories.

### Changed
- Version synchronized to 2.4.0 across package.json, .claude-plugin/plugin.json, and claude-skills.json.
- Updated documentation across README.md, MINDMAP.md, AGENTS.md, docs/index.html, and docs/llms.txt.
- Specification test suite check-skills.mjs verified with 0 errors and 0 warnings across all 541 skills.

## [2.3.0] - 2026-11-20

### Added
- Anti-Slop Clean Output Suite (6 skills across anti-slop category): Integrated from miqdadbadjuber/anti-slop to stop generic AI interfaces, robotic comments, and marketing hyperbole (antislop, antislop-code, antislop-copywriting, antislop-human, antislop-layoutmobile, antislop-ui).
- Design Vocabulary and Craft Systems (3 skills across design-taste category): Integrated 24-command design vocabulary from pbakaus/impeccable, gallery-distilled frontend art direction from Leonxlnx/taste-skill (design-taste-frontend), and 10-item designer acceptance gates from educlopez/ui-craft (ui-craft).
- Writing Quality and Anti-AI-Slop (1 skill in writing-quality category): Integrated from jalaalrd/anti-ai-slop-writing to eliminate 50+ robotic words, formulaic transitions, and rule-of-three sentence structures (anti-ai-slop-writing).
- Cross-Session Persistent Memory Compression (1 skill in agent-memory category): Integrated from thedotmack/claude-mem for transcript-based memory snapshots surviving across coding sessions (claude-mem).
- High-Performance Headless Browser (1 skill in browser-automation category): Integrated from lightpanda-io/browser with Zig-based engine consuming 16x less memory and running 9x faster than Chromium (lightpanda).
- Official Community Skills Catalog (1 skill in resources category): Integrated from VoltAgent/awesome-agent-skills (awesome-agent-skills).
- 5 New REA Core Additions: rea-analysis-optimization, rea-changelog-update, rea-ci-tests-audit, rea-tool-design, and reverse-engineer-anything.
- 47 New Everything Claude Code (ECC) skills.
- Total library scale: 243 skills across 41 categories.

## [2.2.0] - 2026-11-19

### Added
- Understand Anything Codebase Understanding and Knowledge Graph Suite (9 skills + 10 analysis agents across codebase-understanding category): Integrated from Egonex-AI/Understand-Anything for AST repository analysis, interactive React/xyflow dashboard with Louvain community detection, codebase Q&A, git diff impact prediction, domain flow mapping, and developer onboarding walkthroughs.
- Total library scale: 178 skills across 35 categories.

## [2.1.0] - 2026-10-28

### Added
- **Full PayloadsAllTheThings Integration (63 Payload Skills across 4 New Categories):** Integrated the complete [swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/payloadsallthethings) library as structured `SKILL.md` files with operational workflows, full payload content, and REA MCP integration hooks.
  - `payloads-injection` (18 skills): SQL, XSS, XXE, SSRF, SSTI, Command, LDAP, NoSQL, GraphQL, XPath, XSLT, LaTeX, SAML, SSI, HPP, CSV, Prototype Pollution, Prompt Injection
  - `payloads-web` (29 skills): CORS, CRLF, CSRF, Open Redirect, LFI/RFI, Path Traversal, Deserialization, File Upload, Request Smuggling, Cache Deception, OAuth, JWT, IDOR, Race Conditions, WebSocket, CSS Injection, Clickjacking, Type Juggling, Mass Assignment, Dep Confusion, Account Takeover, Brute Force, Business Logic, API Key Leaks, CVE Exploits, Reverse Proxy, vHosts, Hidden Params, ORM Leak
  - `payloads-research` (15 skills): DOM Clobbering, Encoding, ReDoS, DNS Rebinding, Tabnabbing, XS-Leak, Headless Browser, CSPT, GWT, Ext Variable, Java RMI, Insecure Randomness, Mgmt Interface, SCM Exposure, Zip Slip
  - `payloads-resources` (1 skill): Pentest Methodology & Resources
- **Total: 163 skills across 29 categories** (up from 100 across 25)
- **Integration Script:** Added `scripts/integrate-payloads.mjs` for automated PATT skill generation
- **Updated `scripts/build-manifests.mjs`** with 4 new PATT categories
- **Updated `AGENTS.md`** with the full PATT integration directive
- **Updated `README.md`** with full PATT skill index (63 skills) and category table

### Changed
- Package version bumped to `2.1.0`
- Plugin description updated to reflect 163-skill suite
- Claude-skills.json regenerated with 29 categories and 163 skills

## [2.0.0] - 2026-10-28

### Added
- **Full `claude-red` Integration (79 Security Assessment Skills across 23 Categories):** Integrated the complete categorized skill tree (`web`, `auth`, `active-directory`, `wireless`, `cloud`, `mobile`, `iot`, `infrastructure`, `exploit-dev`, `fuzzing`, `recon`, `api`, `container`, `cicd`, `crypto`, `privesc`, `post-exploitation`, `forensics`, `supply-chain`, `social-engineering`, `network`, `ai`, `utility`) alongside our **REA Core (12 skills)** and **Agent Ecosystem (9 skills)** — totaling **100 skills across 25 categories**.
- **Matt Pocock Agent Skills Standard & Claude Plugin Packaging:** Added `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.agents/invocation.md`, `.agents/adr/0001..0004`, and `agents/openai.yaml` descriptors for all 100 skills.
- **Interactive REA Grilling Protocol (`rea-grill-me` & `rea-grilling`):** Frontier-question scoping interview before complex reverse-engineering and security audit tasks.
- **CLI Installer & Manifest Tooling:** Added `install.sh`, `tools/build_manifest.py`, `claude-skills.json`, `MINDMAP.md`, `SECURITY.md`, and `CONTRIBUTING.md`.
- **Technical SEO & AI Discovery:** Added JSON-LD structured data, `docs/sitemap.xml`, `docs/robots.txt`, and `docs/llms.txt`.
