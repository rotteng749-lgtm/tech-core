# ECC Workflow (Windsurf)

## Directive
Adhere to the Everything Claude Code (ECC) engineering standards:
1. **Research & Reuse:** Search existing GitHub code (`gh search code`) and official documentation before implementing from scratch.
2. **Plan First:** Define requirements, edge cases, and sequences of execution before touching code.
3. **TDD (Red-Green-Refactor):** Write failing tests first, make them pass with minimal code, and refactor with green tests.
4. **Code Review:** Audit diffs for null safety, concurrency pitfalls, and regressions.
5. **Zero-Secret Law:** Never commit API keys, secrets, or credentials.
6. **Verification Before Completion:** Run tests and verify exit codes before claiming tasks are done.
