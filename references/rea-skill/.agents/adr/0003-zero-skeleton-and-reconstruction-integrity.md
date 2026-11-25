# ADR 0003: The Zero-Skeleton Law and Complete Verification Mandate

## Status
Accepted

## Context
When developers use AI coding assistants to recover lost source code or decompile software, generic assistants frequently output truncated code, pseudocode skeletons, stubs with `// TODO: implement logic here`, or non-compiling fragments. For a developer who has lost their source code, partial stubs are useless.

## Decision
We enforce the strict **Zero-Skeleton Law**:
1. Under no circumstances may an agent emit placeholder comments (`// TODO`, `/* implement later */`, `pass`), mocked business logic, or stubbed functions.
2. Every reconstructed file must contain 100% production-ready, compilable, and syntactically valid code.
3. Every recovery project must generate a 1-click multi-compiler build script (`build.bat` / `build.sh`) supporting Zig CC, MSVC, GCC, Cargo, or Gradle.
4. The agent must execute compilation verification and prove 0 errors and 0 warnings before declaring completion.

## Consequences
- Guaranteed working deliverables for lost-source recovery tasks.
- Eliminates developer frustration with incomplete code fragments.
