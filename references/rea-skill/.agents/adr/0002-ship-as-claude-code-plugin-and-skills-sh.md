# ADR 0002: Ship as Native Claude Code Plugin and Multi-Harness Skill Suite

## Status
Accepted

## Context
Developers work across diverse agent ecosystems including Claude Code, OpenAI Codex, Antigravity, Cursor, and Windsurf. Users require two distinct distribution modalities:
1. **Plug-and-Play Distribution**: Subscribe to the skills as a managed, versioned bundle via Claude Code / Antigravity plugin registries without manual file cloning.
2. **Standard Agent Skills Distribution**: Direct inclusion via `npx skills add smartworldarafath/REA_Skill` (powered by skills.sh standard).

## Decision
We implement first-class native support for both distribution channels:
1. Provide `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` configuring the repository as a self-hosted single-plugin marketplace.
2. Maintain standard `SKILL.md` frontmatter paired with Codex-compatible `agents/openai.yaml` in every skill directory.
3. Provide unified skill path discovery supporting both `skills/` and `.agents/skills/`.

## Consequences
- Claude Code users can install with:
  ```bash
  /plugin marketplace add smartworldarafath/REA_Skill
  /plugin install rea-skills@smartworldarafath
  ```
- Cross-platform users can install with:
  ```bash
  npx skills add smartworldarafath/REA_Skill
  ```
- Dual-harness metadata guarantees proper UI presentation in both Claude Code and OpenAI Codex interfaces.
