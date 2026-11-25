# Playwright MCP (Cline)

## Directive
When the agent needs to interactively browse, click, type, fill forms, or test live websites:
- Use Microsoft Playwright MCP (https://github.com/microsoft/playwright-mcp) via `@playwright/mcp`:
  - `browser_navigate` — navigate to URLs and inspect structured accessibility trees
  - `browser_click` / `browser_type` — interact with DOM elements by accessibility ID
  - `browser_screenshot` — capture targeted viewports for visual verification
  - `browser_evaluate` — execute JavaScript in the page context
- Pair with security audits to test authenticated flows and verify post-fix UI stability.
