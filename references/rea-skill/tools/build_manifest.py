#!/usr/bin/env python3
"""Generate claude-skills.json manifest from the categorized skills/ tree.

Reads YAML frontmatter from each SKILL.md across all 25 categories and emits a
compact JSON manifest of all 100 skills for tooling that needs a machine-readable
index of the library.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = ROOT / "skills"
OUT = ROOT / "claude-skills.json"

CATEGORIES = [
    "rea-core", "agent-ecosystem", "web", "auth", "active-directory",
    "wireless", "cloud", "mobile", "iot", "infrastructure", "exploit-dev",
    "fuzzing", "recon", "api", "container", "cicd", "crypto", "privesc",
    "post-exploitation", "forensics", "supply-chain", "social-engineering",
    "network", "ai", "utility",
]

FRONTMATTER_RE = re.compile(r"^---\r?\n(.*?)\r?\n---", re.DOTALL)


def parse_frontmatter(text: str) -> dict[str, str]:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    out: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.startswith(" "):
            k, _, v = line.partition(":")
            out[k.strip()] = v.strip().strip('"')
    return out


def main() -> int:
    if not SKILLS_DIR.is_dir():
        print(f"Error: {SKILLS_DIR} not found", file=sys.stderr)
        return 1

    categories_map: dict[str, list[str]] = {}
    skills_list: list[dict[str, str]] = []

    for cat in CATEGORIES:
        cat_dir = SKILLS_DIR / cat
        if not cat_dir.is_dir():
            continue
        names: list[str] = []
        for skill_dir in sorted(cat_dir.iterdir()):
            skill_md = skill_dir / "SKILL.md"
            if skill_dir.is_dir() and skill_md.is_file():
                fm = parse_frontmatter(skill_md.read_text(encoding="utf-8"))
                name = fm.get("name", skill_dir.name)
                names.append(name)
                skills_list.append({
                    "name": name,
                    "category": cat,
                    "path": f"skills/{cat}/{skill_dir.name}/SKILL.md",
                    "agentPath": f".agents/skills/{skill_dir.name}/SKILL.md",
                    "description": fm.get("description", ""),
                })
        categories_map[cat] = names

    manifest = {
        "name": "rea-skills",
        "version": "2.0.0",
        "license": "MIT",
        "homepage": "https://smartworldarafath.github.io/REA_Skill/",
        "repository": "https://github.com/smartworldarafath/REA_Skill",
        "totalCategories": len(categories_map),
        "totalSkills": len(skills_list),
        "categories": categories_map,
        "skills": skills_list,
    }
    OUT.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(categories_map)} categories, {len(skills_list)} skills)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
