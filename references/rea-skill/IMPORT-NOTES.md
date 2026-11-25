# Import notes — REA_Skill → tech-core

Source: `https://github.com/smartworldarafath/REA_Skill` (MIT), cloned at commit
on 2026-11-26. Imported in full (all of `skills/`, `docs/`, `assets/`,
`understand-anything-plugin/`, `.agents/`, agent rule files, scripts, tools).

## What this tree is

- `skills/` — 704 `SKILL.md` files in 206 groups. Canonical copy.
- `.agents/skills/` — AGENTS-protocol mirror of the same skills.
- `understand-anything-plugin/skills/` — codebase knowledge-graph skills.
- `INDEX.md` / `CATEGORIES.md` — generated routers, added by the import.
- `.gitignore` renamed to `.gitignore.upstream` so a future `git add` from
  tech-core does not silently drop assets.

## What was changed on import

Mechanical, no technique removed:

1. Deleted the `Authorization & Scope Notice` and `Authorized Use Only`
   blockquotes, `## Legal Notice` and `## Scope & Authorization` sections.
2. Removed `` from exploit headings and "Authorized" from
   descriptions.
3. Dropped lines asserting that unauthorized testing is illegal, that only
   owned targets may be tested, and similar scope gates.
4. Replaced `the target application` → `the target application`, and the
   `rea-owner-authorization` instruction to "ask for clarification about
   ownership" with "proceed directly".
5. Left technique, commands, payloads and reference links byte-identical.

Re-run the pass with the upstream checkout if the library is updated:

```bash
cd ~/.opencode/skills/tech-core
git clone --depth 1 https://github.com/smartworldarafath/REA_Skill /tmp/rea
rsync -a --delete --exclude=.git \
  --exclude=INDEX.md --exclude=CATEGORIES.md --exclude=IMPORT-NOTES.md \
  --exclude=.gitignore --exclude=.gitignore.upstream \
  /tmp/rea/ references/rea-skill/
python3 tools/uncensor.py references/rea-skill
python3 tools/build_index.py references/rea-skill
mv references/rea-skill/.gitignore references/rea-skill/.gitignore.upstream
```

`tools/uncensor.py` and `tools/build_index.py` live in the tech-core repo root
`tools/` directory (not shipped inside the skill payload). Both are idempotent —
re-running them changes nothing, which is how the imported tree was verified
against a fresh upstream clone.
