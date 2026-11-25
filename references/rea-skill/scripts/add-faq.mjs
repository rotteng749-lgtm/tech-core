import fs from 'node:fs';

let html = fs.readFileSync('docs/index.html', 'utf8').replace(/\r\n/g, '\n');
if (html.includes('id="faq"')) { console.log('FAQ already present'); process.exit(0); }

const faq = [
  ['What is REA (Reverse Engineer Anything)?', 'REA is an MCP server that gives coding agents disassembly, decompilation and runtime inspection tools. REA_Skill adds 21 agent skills, 500+ prompts and owner-authorization rules so Claude Code, Codex, Cursor and Antigravity can use it effectively on your own software.'],
  ['How do I install REA_Skill in Claude Code?', 'Run /plugin marketplace add smartworldarafath/REA_Skill, then /plugin install rea-skills@smartworldarafath. For other agents use: npx skills add smartworldarafath/REA_Skill.'],
  ['Can REA_Skill recover lost source code?', 'Yes. The rea-full-code-recovery skill drives a disassemble, extract-resources, reconstruct and build-verify pipeline for binaries you own.'],
  ['Which AI coding agents are supported?', 'Google Antigravity, Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Windsurf, Cline, Jules, Kimi, OpenClaw and OpenCode.'],
  ['Is REA_Skill free?', 'Yes. It is open source under the MIT License.'],
];

const items = faq
  .map(([q, a]) => `          <details style="margin: 12px 0; padding: 14px 18px; border: 1px solid var(--line); border-radius: 12px;">
            <summary style="cursor: pointer; font-weight: 600;">${q}</summary>
            <p style="margin: 10px 0 0;">${a.replace(/&/g, '&amp;')}</p>
          </details>`)
  .join('\n');

const section = `<section class="section" id="faq">
        <div class="container">
          <h2>REA_Skill FAQ</h2>
${items}
        </div>
      </section>

      `;

const marker = '<section class="section" id="community">';
if (!html.includes(marker)) throw new Error('community marker missing');
html = html.replace(marker, section + marker);
fs.writeFileSync('docs/index.html', html, 'utf8');
console.log('FAQ added');
