#!/usr/bin/env python3
"""Regenerate INDEX.md + CATEGORIES.md for references/rea-skill.

Usage: python3 tools/build_index.py references/rea-skill
"""
from __future__ import annotations

import pathlib
import re
import sys

FM = re.compile(r"^---\n(.*?)\n---\n", re.S)


def front_matter(text: str) -> dict[str, str]:
    m = FM.match(text)
    if not m:
        return {}
    out: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        out[key.strip()] = value.strip().strip('"')
    return out


def clean(value: str, limit: int = 170) -> str:
    value = re.sub(r"\s+", " ", value).replace("|", "\\|")
    return value if len(value) <= limit else value[: limit - 1].rstrip() + "…"


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: build_index.py references/rea-skill")
        return 2
    lib = pathlib.Path(sys.argv[1])
    skills = lib / "skills"

    rows: dict[str, list[tuple[str, str, str]]] = {}
    for path in sorted(skills.rglob("SKILL.md")):
        rel = path.relative_to(skills)
        meta = front_matter(path.read_text(encoding="utf-8", errors="replace"))
        rows.setdefault(rel.parts[0], []).append(
            (str(rel), meta.get("name") or path.parent.name, meta.get("description") or "")
        )

    total = sum(len(v) for v in rows.values())
    index = [
        "# REA_Skill library index",
        "",
        f"Imported from `github.com/smartworldarafath/REA_Skill` — {total} skills in "
        f"{len(rows)} top-level groups. Paths are relative to `references/rea-skill/skills/`.",
        "",
        "Load one file per task; never read the whole tree.",
        "",
    ]
    for group in sorted(rows):
        index += [f"## {group} ({len(rows[group])})", "", "| Skill | Description | Path |", "|---|---|---|"]
        for rel, name, desc in sorted(rows[group], key=lambda r: r[1]):
            index.append(f"| `{name}` | {clean(desc)} | `{rel}` |")
        index.append("")
    (lib / "INDEX.md").write_text("\n".join(index), encoding="utf-8")

    cats = ["# REA_Skill categories", "", "| Group | Skills | What it holds |", "|---|---|---|"]
    for group in sorted(rows):
        sample = "; ".join(sorted({n for _, n, _ in rows[group]})[:4])
        cats.append(f"| `{group}` | {len(rows[group])} | {clean(sample, 120)} |")
    (lib / "CATEGORIES.md").write_text("\n".join(cats) + "\n", encoding="utf-8")

    print(f"{total} skills, {len(rows)} groups")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
