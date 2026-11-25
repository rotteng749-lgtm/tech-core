import fs from 'node:fs';

const SITE = 'https://smartworldarafath.github.io/REA_Skill/';
const REPO = 'https://github.com/smartworldarafath/REA_Skill';
const TITLE = 'REA Skill: Reverse Engineer Anything for Claude Code, Codex';
const DESC =
  'REA_Skill: 21 agent skills + 500 prompts for Reverse Engineer Anything (REA). Recover lost source code and audit apps with Claude Code, Codex, Cursor.';
const KEYWORDS =
  'REA, REA skill, Reverse Engineer Anything, REA MCP, reverse engineering AI agent, lost source code recovery, decompile binary, APK reverse engineering, Claude Code skills, Codex skills, Antigravity skills, Cursor rules, website security audit, OWASP MASVS, agent skills, SKILL.md';

const faq = [
  ['What is REA (Reverse Engineer Anything)?', 'REA is an MCP server that gives coding agents disassembly, decompilation and runtime inspection tools. REA_Skill adds 21 agent skills, 500+ prompts and owner-authorization rules so Claude Code, Codex, Cursor and Antigravity can use it effectively on your own software.'],
  ['How do I install REA_Skill in Claude Code?', 'Run /plugin marketplace add smartworldarafath/REA_Skill, then /plugin install rea-skills@smartworldarafath. For other agents use: npx skills add smartworldarafath/REA_Skill.'],
  ['Can REA_Skill recover lost source code?', 'Yes. The rea-full-code-recovery skill drives a disassemble, extract-resources, reconstruct and build-verify pipeline for binaries you own.'],
  ['Which AI coding agents are supported?', 'Google Antigravity, Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Windsurf, Cline, Jules, Kimi, OpenClaw and OpenCode.'],
  ['Is REA_Skill free?', 'Yes. It is open source under the MIT License.'],
];

const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': SITE + '#website',
      url: SITE,
      name: 'REA_Skill',
      alternateName: ['REA Skill', 'Reverse Engineer Anything Skill', 'REA Agent Skills'],
      description: DESC,
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': SITE + '#code',
      name: 'REA_Skill',
      alternateName: 'Reverse Engineer Anything Skill',
      description: DESC,
      codeRepository: REPO,
      url: SITE,
      license: 'https://opensource.org/licenses/MIT',
      programmingLanguage: 'Markdown',
      author: { '@type': 'Person', name: 'Arafath Rahman', url: 'https://github.com/smartworldarafath' },
      keywords: KEYWORDS,
    },
    {
      '@type': 'SoftwareApplication',
      name: 'REA_Skill',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url: SITE,
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
};

const headSeo = `<title>${TITLE}</title>
    <meta name="description" content="${DESC}" />
    <meta name="keywords" content="${KEYWORDS}" />
    <meta name="author" content="Arafath Rahman" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${SITE}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="REA_Skill" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESC}" />
    <meta property="og:url" content="${SITE}" />
    <meta property="og:image" content="${SITE}assets/animated-text.svg" />
    <meta property="og:image:alt" content="REA_Skill - Reverse Engineer Anything skills for AI coding agents" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESC}" />
    <meta name="twitter:image" content="${SITE}assets/animated-text.svg" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>`;

let html = fs.readFileSync('docs/index.html', 'utf8').replace(/\r\n/g, '\n');

// Replace everything from <title> to the twitter:description meta.
const start = html.indexOf('<title>');
const endMarker = '<meta name="twitter:description"';
const endIdx = html.indexOf(endMarker);
const ldIdx = html.indexOf('<script type="application/ld+json">');
const endClose =
  ldIdx >= 0
    ? html.indexOf('</script>', ldIdx) + '</script>'.length
    : html.indexOf('/>', endIdx) + 2;
if (start < 0 || endIdx < 0) throw new Error('head markers not found');
html = html.slice(0, start) + headSeo + html.slice(endClose);

// Visible keyword-rich eyebrow (H1 stays unchanged visually).
html = html.replace(
  /Reverse engineering, security audits &amp; browser automation/,
  'REA &mdash; Reverse Engineer Anything: reverse engineering, security audits &amp; browser automation'
);

fs.writeFileSync('docs/index.html', html, 'utf8');

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  'docs/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
);
fs.writeFileSync('docs/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
fs.writeFileSync(
  'docs/llms.txt',
  `# REA_Skill (Reverse Engineer Anything Skill)

> ${DESC}

- Website: ${SITE}
- Repository: ${REPO}
- Install (Claude Code): /plugin marketplace add smartworldarafath/REA_Skill
- Install (any agent): npx skills add smartworldarafath/REA_Skill
- License: MIT

## Skills
21 skills under .agents/skills/ covering binary disassembly, full source code recovery, mobile (APK/IPA), web bundles, protocols, databases, game assets, firmware, crash triage and website security audit.
`
);
console.log('SEO applied.');
