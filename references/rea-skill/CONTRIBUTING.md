# Contributing to REA_Skill

Thank you for contributing! This guide explains the skill format, dual-harness metadata standard, and validation workflow that keep all **100 skills across 25 categories** coherent.

## Quick Rules

1. **One skill, one surface.** Prefer focused, domain-specific skills over monolithic overviews.
2. **YAML frontmatter + `agents/openai.yaml` required.** Every skill must work across Claude Code, OpenAI Codex, Google Antigravity, Cursor, and Windsurf.
3. **Zero-Skeleton Law.** Code recovery and remediation examples must be complete, syntactically valid, and free of `// TODO` placeholders.
4. **Zero-Secret Law.** Never include live API keys, tokens, credentials, or real third-party victim domains.
5. **Run `npm test` before submitting.** All 100 skills and plugin manifests are validated automatically.

---

## Skill Directory Layout

Each skill is mirrored across three standard paths for universal tool compatibility:

```text
.agents/skills/<skill-name>/
├── SKILL.md
└── agents/
    └── openai.yaml

skills/<category>/<skill-name>/
├── SKILL.md
└── agents/
    └── openai.yaml

skills/<skill-name>/
├── SKILL.md
└── agents/
    └── openai.yaml
```

### 1. `SKILL.md` Frontmatter

```yaml
---
name: <skill-folder-name>
description: "Clear, dense description (50–300 words) stating the surface, techniques, tools, and trigger scenarios."
---
```

*(For user-invoked slash commands like `rea-grill-me`, add `disable-model-invocation: true`.)*

### 2. `agents/openai.yaml`

```yaml
interface:
  display_name: "Human-Readable Skill Title"
  short_description: "Concise one-line summary for the UI skill picker"
```

---

## Validation & Manifest Sync

After adding or updating a skill, run:

```bash
node scripts/build-manifests.mjs
npm test
```
