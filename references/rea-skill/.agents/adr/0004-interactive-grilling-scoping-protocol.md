# ADR 0004: Interactive Grilling and Frontier Scoping Protocol

## Status
Accepted

## Context
Complex reverse engineering, lost source code recovery, and defensive security audits often involve critical technical trade-offs (e.g. byte-exact binary matching vs clean idiomatic C++ rewrite, dynamic vs static linking, asset extraction formats, secret sanitization policies). Users often submit vague prompts (e.g., "recover this binary" or "check my app"). Proceeding without clarifying these decisions leads to wasted computation or misaligned deliverables.

## Decision
Adopt the **Grilling Protocol** inspired by Matt Pocock's `grill-me` / `grilling` architecture, tailored specifically for reverse engineering:
1. Provide a user-invoked slash command `/rea-grill-me` (`disable-model-invocation: true`).
2. Implement the model-invoked engine `rea-grilling` to interview the user across the REA Decision Tree.
3. Organize questions into **rounds** along the **frontier** of unsettled decisions.
4. Provide concrete technical recommendations for each question, formulated so that replying `"yes"` accepts all recommendations for that round.
5. Autonomous Fact-Finding: The agent performs non-invasive artifact inspection (file headers, architecture, symbol tables, strings) before asking questions; facts are discovered by the agent, never requested from the user.

## Consequences
- High-ambiguity tasks are clarified into rock-solid execution plans before code is written.
- Eliminates multi-turn guesswork while maintaining frictionless one-word ("yes") acceptance for the developer.
