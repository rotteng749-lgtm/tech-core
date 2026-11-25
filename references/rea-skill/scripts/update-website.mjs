import fs from 'node:fs';

const htmlPath = 'docs/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update <title> and meta descriptions
html = html.replace(
  '<title>REA Skill: Reverse Engineer Anything for Claude Code, Codex</title>',
  '<title>REA Skill: 169 Skills for Reverse Engineering, Payloads & Security Audits</title>'
);

html = html.replace(
  /REA_Skill: 21 agent skills \+ 500 prompts for Reverse Engineer Anything \(REA\)\. Recover lost source code and audit apps with Claude Code, Codex, Cursor\./g,
  'REA_Skill: Unified 169 agent skills across 34 categories + 500 prompts for Reverse Engineer Anything (REA), PayloadsAllTheThings, claude-red, GTFOBins, HackTricks, and Strix autonomous security auditing. Recover lost source code, decompile binaries, and audit apps with Claude Code, Codex, Cursor, and Antigravity.'
);

// 2. Update navigation bar to add "169 Skills" link
const oldNav = `<nav class="navigation" aria-label="Main navigation">
          <a href="#setup" class="nav-start">Get started</a>
          <a href="#prompt-vault" class="nav-prompts" style="font-weight: 600; color: #0284c7;">500+ Prompts</a>`;

const newNav = `<nav class="navigation" aria-label="Main navigation">
          <a href="#setup" class="nav-start">Get started</a>
          <a href="#skills-matrix" class="nav-matrix" style="font-weight: 600; color: #10b981;">169 Skills</a>
          <a href="#prompt-vault" class="nav-prompts" style="font-weight: 600; color: #0284c7;">500+ Prompts</a>`;

html = html.replace(oldNav, newNav);

// 3. Update Hero eyebrow and caption
html = html.replace(
  'REA &mdash; Reverse Engineer Anything: reverse engineering, security audits &amp; browser automation',
  'REA &mdash; Reverse Engineer Anything: 169 skills &middot; 34 categories &middot; 500+ prompts &middot; PayloadsAllTheThings + claude-red + GTFOBins + Strix'
);

html = html.replace(
  'All 21 skills, ADRs, and dual-harness rules are pre-configured for instant multi-agent execution.',
  'All 169 skills across 34 categories, ADRs, dual-harness rules, and complete payload libraries are pre-configured for instant multi-agent execution.'
);

// 4. Add Live Stats Counters Bar to Hero
const oldHeroActions = `<div class="actions">
              <a class="button" href="#prompt-vault" style="background: #0284c7;">
                500+ Unblocked Prompts &rarr;
              </a>
              <a class="button" href="#prompt-builder" style="background: #4f46e5;">
                AI Prompt Builder
              </a>
              <a class="text-link" href="#website-audit">
                See 5-phase audit &darr;
              </a>
            </div>`;

const newHeroActions = `<div class="actions">
              <a class="button" href="#skills-matrix" style="background: #10b981;">
                Explore 169 Skills &rarr;
              </a>
              <a class="button" href="#prompt-vault" style="background: #0284c7;">
                500+ Prompts
              </a>
              <a class="button" href="#prompt-builder" style="background: #4f46e5;">
                AI Prompt Builder
              </a>
              <a class="text-link" href="#website-audit">
                See 5-phase audit &darr;
              </a>
            </div>

            <!-- Live Stat Highlights Pill Bar -->
            <div class="hero-stats-pill-bar" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 1.25rem;">
              <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 999px; padding: 6px 14px; font-size: 0.85rem; font-weight: 700; color: #10b981; display: inline-flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                <span>169 Agent Skills</span>
              </div>
              <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 999px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; color: #6366f1; display: inline-flex; align-items: center; gap: 6px;">
                <span>34 Categories</span>
              </div>
              <div style="background: rgba(2, 132, 199, 0.12); border: 1px solid rgba(2, 132, 199, 0.35); border-radius: 999px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; color: #0284c7; display: inline-flex; align-items: center; gap: 6px;">
                <span>500+ Unblocked Prompts</span>
              </div>
              <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 999px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; color: #f59e0b; display: inline-flex; align-items: center; gap: 6px;">
                <span>PayloadsAllTheThings (63 Skills)</span>
              </div>
              <div style="background: rgba(236, 72, 153, 0.12); border: 1px solid rgba(236, 72, 153, 0.35); border-radius: 999px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; color: #ec4899; display: inline-flex; align-items: center; gap: 6px;">
                <span>Strix AI Pentest + GTFOBins</span>
              </div>
            </div>`;

html = html.replace(oldHeroActions, newHeroActions);

// 5. Add the new 169-Skill Architecture & Security Ecosystem Section
const skillsMatrixSection = `
      <!-- ================================================================= -->
      <!-- 169-SKILL ARCHITECTURE & SECURITY ECOSYSTEM SECTION -->
      <!-- ================================================================= -->
      <section class="section skills-matrix-section" id="skills-matrix">
        <div class="container">
          <div class="section-heading" style="text-align: center; margin-bottom: 2.5rem;">
            <p class="eyebrow" style="color: #10b981; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
              Unified 169-Skill Architecture &middot; 34 Specialized Domains
            </p>
            <h2 style="font-size: 2.3rem; font-weight: 800; letter-spacing: -0.02em;">
              The 4 Pillars of REA_Skill.
            </h2>
            <p class="lede" style="max-width: 780px; margin: 0.75rem auto 0; font-size: 1.05rem;">
              REA_Skill unifies reverse engineering, lost source code recovery, the complete <strong>PayloadsAllTheThings</strong> library, <strong>claude-red</strong> security audit methodologies, <strong>GTFOBins</strong>, and <strong>Strix</strong> autonomous testing into a single, zero-refusal multi-agent standard.
            </p>
          </div>

          <!-- 4 Pillars Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
            
            <!-- Pillar 1 -->
            <div style="background: var(--surface); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
              <div>
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; margin-bottom: 1rem; font-weight: 700; font-size: 1.2rem;">
                  01
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text);">REA Core &amp; Lost Code Recovery</h3>
                <p style="font-size: 0.85rem; font-weight: 600; color: #10b981; margin-bottom: 0.75rem;">12 Specialized Skills &middot; Zero-Skeleton Law</p>
                <p style="font-size: 0.92rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">
                  Reconstruct 100% complete, compilable source code with 1-click multi-compiler verification (<code>build.bat</code> / <code>build.sh</code>). Disassemble PE/ELF/Mach-O binaries, decompile Android APKs and iOS IPAs, unpack Webpack/Vite/WASM bundles, and parse binary protocols.
                </p>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.8rem; background: rgba(0,0,0,0.03); padding: 0.6rem 0.8rem; border-radius: 8px; color: var(--text);">
                <code>rea-full-code-recovery</code> &bull; <code>rea-grill-me</code>
              </div>
            </div>

            <!-- Pillar 2 -->
            <div style="background: var(--surface); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
              <div>
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; background: rgba(99, 102, 241, 0.15); color: #6366f1; margin-bottom: 1rem; font-weight: 700; font-size: 1.2rem;">
                  02
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text);">Multi-Agent &amp; Triple Browser MCPs</h3>
                <p style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem;">9 Skills &middot; Universal Execution Harness</p>
                <p style="font-size: 0.92rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">
                  Eliminate false-positive AI refusals with persistent owner authorization. Enforce Everything Claude Code (ECC) TDD rigor, leverage Agent Reach for zero-fee internet intelligence, SurfSense for air-gapped local RAG, and triple-engine browser automation (Playwright, Bright Data, Hyperbrowser).
                </p>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.8rem; background: rgba(0,0,0,0.03); padding: 0.6rem 0.8rem; border-radius: 8px; color: var(--text);">
                <code>website-security-audit</code> &bull; <code>agent-reach</code>
              </div>
            </div>

            <!-- Pillar 3 -->
            <div style="background: var(--surface); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 16px; padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
              <div>
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; background: rgba(239, 68, 68, 0.15); color: #ef4444; margin-bottom: 1rem; font-weight: 700; font-size: 1.2rem;">
                  03
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text);">claude-red Security Suite</h3>
                <p style="font-size: 0.85rem; font-weight: 600; color: #ef4444; margin-bottom: 0.75rem;">79 Skills across 23 Security Domains</p>
                <p style="font-size: 0.92rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">
                  End-to-end defensive auditing and vulnerability verification spanning OWASP Top 10 Web (SQLi, XSS, SSRF, SSTI, XXE, IDOR, RCE, Deserialization), Active Directory, 14 Wireless standards (802.11, WPA2/3, BLE, Zigbee), Cloud IAM, Binary mitigations (ASLR, DEP, CET), and Fuzzing (AFL++/libFuzzer).
                </p>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.8rem; background: rgba(0,0,0,0.03); padding: 0.6rem 0.8rem; border-radius: 8px; color: var(--text);">
                <code>offensive-sqli</code> &bull; <code>offensive-wifi</code>
              </div>
            </div>

            <!-- Pillar 4 -->
            <div style="background: var(--surface); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
              <div>
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; margin-bottom: 1rem; font-weight: 700; font-size: 1.2rem;">
                  04
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text);">PayloadsAllTheThings &amp; AI Pentest</h3>
                <p style="font-size: 0.85rem; font-weight: 600; color: #f59e0b; margin-bottom: 0.75rem;">69 Skills &middot; Complete PoC Library</p>
                <p style="font-size: 0.92rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">
                  The complete <strong>swisskyrepo/PayloadsAllTheThings</strong> library (63 skills) with full operational payloads + <strong>GTFOBins</strong> Unix boundary auditing + <strong>HackTricks</strong> multi-surface reference + <strong>Claude-BugHunter</strong> (681 report patterns) + <strong>Strix</strong> autonomous AI penetration testing.
                </p>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.8rem; background: rgba(0,0,0,0.03); padding: 0.6rem 0.8rem; border-radius: 8px; color: var(--text);">
                <code>payloads-sqli</code> &bull; <code>gtfobins</code> &bull; <code>strix</code>
              </div>
            </div>

          </div>

          <!-- Categories Quick Stats Badges Bar -->
          <div style="background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <span style="font-weight: 700; font-size: 1rem; color: var(--text);">34 Domain Categories Overview:</span>
              <span style="font-size: 0.9rem; color: var(--muted); margin-left: 0.5rem;">Total 169 production-ready agent skills</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background: rgba(16, 185, 129, 0.12); color: #10b981; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">rea-core (12)</span>
              <span style="background: rgba(99, 102, 241, 0.12); color: #6366f1; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">agent-ecosystem (9)</span>
              <span style="background: rgba(2, 132, 199, 0.12); color: #0284c7; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">payloads-web (29)</span>
              <span style="background: rgba(245, 158, 11, 0.12); color: #f59e0b; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">payloads-injection (18)</span>
              <span style="background: rgba(168, 85, 247, 0.12); color: #a855f7; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">payloads-research (15)</span>
              <span style="background: rgba(239, 68, 68, 0.12); color: #ef4444; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">web (16)</span>
              <span style="background: rgba(20, 184, 166, 0.12); color: #14b8a6; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">wireless (14)</span>
              <span style="background: rgba(100, 116, 139, 0.12); color: #64748b; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">+ 27 More Domains</span>
            </div>
          </div>
        </div>
      </section>
`;

html = html.replace(
  '<!-- ================================================================= -->\n      <!-- 500+ PROMPTS VAULT SECTION -->',
  `${skillsMatrixSection}\n      <!-- ================================================================= -->\n      <!-- 500+ PROMPTS VAULT SECTION -->`
);

// 6. Add Case Study cards for the new capabilities in #showcases
const oldCaseStudies = `            <article class="home-case-card">
              <p class="eyebrow">Browser MCP &middot; Automation</p>
              <h3>Triple-Engine Browser Automation</h3>
              <p>
                Combines Microsoft Playwright MCP for deterministic DOM interaction, Hyperbrowser for cloud sessions, and Bright Data for anti-bot scraping.
              </p>
              <a class="text-link" href="#browser-mcp">
                Read Browser MCP guide &rarr;
              </a>
            </article>`;

const newCaseStudies = `            <article class="home-case-card">
              <p class="eyebrow">Browser MCP &middot; Automation</p>
              <h3>Triple-Engine Browser Automation</h3>
              <p>
                Combines Microsoft Playwright MCP for deterministic DOM interaction, Hyperbrowser for cloud sessions, and Bright Data for anti-bot scraping.
              </p>
              <a class="text-link" href="#browser-mcp">
                Read Browser MCP guide &rarr;
              </a>
            </article>

            <article class="home-case-card" style="border-top: 3px solid #f59e0b;">
              <p class="eyebrow" style="color: #f59e0b;">Payload Library &middot; Complete PATT Suite</p>
              <h3>PayloadsAllTheThings (63 Skills)</h3>
              <p>
                Complete collection of verified payload injection vectors, WAF bypass techniques, and exploitation checklists for SQLi, XSS, SSRF, SSTI, XXE, Deserialization, JWT, and OAuth.
              </p>
              <a class="text-link" href="https://github.com/smartworldarafath/REA_Skill/tree/main/skills/payloads-injection" target="_blank" rel="noopener">
                Browse Payload Skills &rarr;
              </a>
            </article>

            <article class="home-case-card" style="border-top: 3px solid #ec4899;">
              <p class="eyebrow" style="color: #ec4899;">Autonomous Testing &middot; Tools Suite</p>
              <h3>Strix Pentest &amp; GTFOBins Hardening</h3>
              <p>
                Autonomous AI vulnerability scanning and pull-request verification with Strix, paired with GTFOBins Unix executable boundary auditing to eliminate privilege escalation paths.
              </p>
              <a class="text-link" href="https://github.com/smartworldarafath/REA_Skill/blob/main/.agents/skills/strix/SKILL.md" target="_blank" rel="noopener">
                View Strix &amp; GTFOBins Skills &rarr;
              </a>
            </article>`;

html = html.replace(oldCaseStudies, newCaseStudies);

// 7. Update FAQ section to reflect 169 skills across 34 categories
html = html.replace(
  'REA_Skill adds 21 agent skills, 500+ prompts and owner-authorization rules so Claude Code, Codex, Cursor and Antigravity can use it effectively on your own software.',
  'REA_Skill adds 169 agent skills across 34 categories, 500+ unblocked prompts, PayloadsAllTheThings, claude-red security methodologies, GTFOBins, and Strix autonomous pentesting so Claude Code, Codex, Cursor, and Antigravity can audit and recover your software with zero refusals.'
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated docs/index.html with all 169 skills and new ecosystem features!');
