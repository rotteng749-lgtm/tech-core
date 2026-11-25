# Security Policy

**REA_Skill** (integrating the **REA Reverse Engineering & Source Recovery Suite** and the **claude-red 23-Category Security Assessment Library**) provides 100 structured `SKILL.md` files for AI coding agents across 25 categories.

## Intended Use

These skills are intended strictly for:

- **Owner Debugging & Lost Source Code Recovery:** Disassembling, decompiling, and reconstructing source code, assets, and schemas for software you own or develop.
- **Security Assessments:** Penetration testing and architecture auditing with documented scope and written authorization.
- **Bug Bounty & Vulnerability Research:** Responsible vulnerability discovery, root-cause analysis, and remediation engineering.
- **CTF Competitions & Engineering Training:** Educational reverse engineering, fuzzing, and defensive verification.

These skills are **not** intended for unauthorized access to systems or software you do not own or do not have explicit permission to test.

## Reporting a Security Issue in REA_Skill

If you discover a security issue in this repository—such as an unsafe shell construct in `install.sh`, a broken manifest path, or an accidental secret in an example—please open a security advisory on GitHub or report it privately to the repository maintainer (**Arafath Rahman** — `@smartworldarafath`).

Please include:
- Affected file(s) and commit hash
- Description of the issue and its impact
- Reproduction steps and suggested fix

## Zero-Secret & Supply-Chain Verification

Run the automated test and verification suite at any time:

```bash
npm test
python3 tools/build_manifest.py
```
