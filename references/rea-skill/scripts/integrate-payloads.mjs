/**
 * integrate-payloads.mjs
 * Integrates PayloadsAllTheThings (swisskyrepo/payloadsallthethings) into REA_Skill.
 * Creates SKILL.md + agents/openai.yaml for each top-level payload category.
 * Writes to: .agents/skills/<slug>/, skills/<category>/<slug>/, skills/<slug>/
 * Does NOT delete or modify any existing files.
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = process.cwd();

// ─── Payload catalog: folder name → { slug, category, displayName, shortDesc } ───
const PAYLOAD_CATALOG = [
  // --- Web Injection ---
  { folder: 'SQL Injection',                     slug: 'payloads-sqli',             category: 'payloads-injection', display: 'SQL Injection Payloads',                 short: 'Comprehensive SQL injection payloads, bypass techniques, and exploitation checklists.' },
  { folder: 'XSS Injection',                     slug: 'payloads-xss',              category: 'payloads-injection', display: 'XSS Injection Payloads',                 short: 'Cross-Site Scripting payload library covering reflected, stored, DOM, and filter bypasses.' },
  { folder: 'XXE Injection',                     slug: 'payloads-xxe',              category: 'payloads-injection', display: 'XXE Injection Payloads',                 short: 'XML External Entity injection payloads for file disclosure, SSRF, and RCE.' },
  { folder: 'Server Side Template Injection',    slug: 'payloads-ssti',             category: 'payloads-injection', display: 'SSTI Payloads',                          short: 'Server-Side Template Injection payloads for Jinja2, Twig, Freemarker, and more.' },
  { folder: 'Server Side Request Forgery',       slug: 'payloads-ssrf',             category: 'payloads-injection', display: 'SSRF Payloads',                          short: 'Server-Side Request Forgery payloads, bypass lists, and cloud metadata exploitation.' },
  { folder: 'Command Injection',                 slug: 'payloads-cmdi',             category: 'payloads-injection', display: 'Command Injection Payloads',             short: 'OS command injection payloads for Linux, Windows, and filter bypass techniques.' },
  { folder: 'LDAP Injection',                    slug: 'payloads-ldap',             category: 'payloads-injection', display: 'LDAP Injection Payloads',                short: 'LDAP injection payloads for authentication bypass and directory enumeration.' },
  { folder: 'NoSQL Injection',                   slug: 'payloads-nosqli',           category: 'payloads-injection', display: 'NoSQL Injection Payloads',               short: 'NoSQL injection payloads for MongoDB, CouchDB, Redis, and document store bypass.' },
  { folder: 'GraphQL Injection',                 slug: 'payloads-graphql',          category: 'payloads-injection', display: 'GraphQL Injection Payloads',             short: 'GraphQL injection, introspection abuse, batching attacks, and authorization bypass.' },
  { folder: 'XPATH Injection',                   slug: 'payloads-xpath',            category: 'payloads-injection', display: 'XPath Injection Payloads',               short: 'XPath injection payloads for XML database authentication bypass and data extraction.' },
  { folder: 'XSLT Injection',                    slug: 'payloads-xslt',             category: 'payloads-injection', display: 'XSLT Injection Payloads',               short: 'XSLT injection payloads for server-side XML transformation exploitation and RCE.' },
  { folder: 'LaTeX Injection',                   slug: 'payloads-latex',            category: 'payloads-injection', display: 'LaTeX Injection Payloads',               short: 'LaTeX injection payloads for file read, command execution in PDF/math renderers.' },
  { folder: 'SAML Injection',                    slug: 'payloads-saml',             category: 'payloads-injection', display: 'SAML Injection Payloads',                short: 'SAML injection payloads for SSO bypass, XML signature wrapping, and identity manipulation.' },
  { folder: 'Server Side Include Injection',     slug: 'payloads-ssi',              category: 'payloads-injection', display: 'SSI Injection Payloads',                 short: 'Server-Side Include injection payloads for RCE and file disclosure via Apache/Nginx SSI.' },
  { folder: 'HTTP Parameter Pollution',          slug: 'payloads-hpp',              category: 'payloads-injection', display: 'HTTP Parameter Pollution Payloads',      short: 'HTTP Parameter Pollution payloads for WAF bypass and backend logic manipulation.' },
  { folder: 'CSV Injection',                     slug: 'payloads-csv',              category: 'payloads-injection', display: 'CSV Injection Payloads',                 short: 'CSV/formula injection payloads for spreadsheet-based code execution attacks.' },
  { folder: 'Prototype Pollution',               slug: 'payloads-proto-pollution',  category: 'payloads-injection', display: 'Prototype Pollution Payloads',           short: 'JavaScript prototype pollution payloads for server-side and client-side exploitation.' },
  { folder: 'Prompt Injection',                  slug: 'payloads-prompt-injection', category: 'payloads-injection', display: 'Prompt Injection Payloads',              short: 'LLM prompt injection payloads for goal hijacking, data exfiltration, and jailbreaking.' },
  // --- Web Attacks ---
  { folder: 'CORS Misconfiguration',             slug: 'payloads-cors',             category: 'payloads-web', display: 'CORS Misconfiguration Payloads',         short: 'CORS misconfiguration exploitation payloads and PoC scripts for cross-origin data theft.' },
  { folder: 'CRLF Injection',                    slug: 'payloads-crlf',             category: 'payloads-web', display: 'CRLF Injection Payloads',                short: 'CRLF injection payloads for HTTP response splitting, header injection, and log poisoning.' },
  { folder: 'Cross-Site Request Forgery',        slug: 'payloads-csrf',             category: 'payloads-web', display: 'CSRF Payloads',                          short: 'Cross-Site Request Forgery payload templates and CSRF token bypass techniques.' },
  { folder: 'Open Redirect',                     slug: 'payloads-open-redirect',    category: 'payloads-web', display: 'Open Redirect Payloads',                 short: 'Open redirect bypass payloads for OAuth token theft, phishing, and URL validation bypass.' },
  { folder: 'File Inclusion',                    slug: 'payloads-lfi-rfi',          category: 'payloads-web', display: 'File Inclusion Payloads',                short: 'LFI/RFI payloads for path traversal, log poisoning, PHP filter chains, and RCE.' },
  { folder: 'Directory Traversal',               slug: 'payloads-path-traversal',   category: 'payloads-web', display: 'Directory Traversal Payloads',           short: 'Path traversal and directory traversal payloads with encoding and filter bypass variants.' },
  { folder: 'Insecure Deserialization',          slug: 'payloads-deserial',         category: 'payloads-web', display: 'Insecure Deserialization Payloads',      short: 'Deserialization attack payloads for Java, PHP, Python, Ruby, and .NET gadget chains.' },
  { folder: 'Upload Insecure Files',             slug: 'payloads-file-upload',      category: 'payloads-web', display: 'Insecure File Upload Payloads',          short: 'File upload bypass payloads covering extension tricks, MIME manipulation, and polyglot files.' },
  { folder: 'Request Smuggling',                 slug: 'payloads-smuggling',        category: 'payloads-web', display: 'Request Smuggling Payloads',             short: 'HTTP request smuggling payloads for CL.TE, TE.CL, and TE.TE desync attacks.' },
  { folder: 'Web Cache Deception',               slug: 'payloads-cache-deception',  category: 'payloads-web', display: 'Web Cache Deception Payloads',           short: 'Web cache deception payloads for stealing sensitive cached responses from authenticated users.' },
  { folder: 'OAuth Misconfiguration',            slug: 'payloads-oauth',            category: 'payloads-web', display: 'OAuth Misconfiguration Payloads',        short: 'OAuth 2.0 misconfiguration exploitation payloads for token theft and account takeover.' },
  { folder: 'JSON Web Token',                    slug: 'payloads-jwt',              category: 'payloads-web', display: 'JWT Attack Payloads',                   short: 'JWT attack payloads including alg:none, HMAC confusion, kid injection, and JWK spoofing.' },
  { folder: 'Insecure Direct Object References', slug: 'payloads-idor',             category: 'payloads-web', display: 'IDOR Payloads',                          short: 'IDOR/BOLA payloads for direct object reference attacks and authorization bypass techniques.' },
  { folder: 'Race Condition',                    slug: 'payloads-race-condition',   category: 'payloads-web', display: 'Race Condition Payloads',                short: 'Race condition attack payloads and timing attack scripts for state manipulation exploits.' },
  { folder: 'Web Sockets',                       slug: 'payloads-websocket',        category: 'payloads-web', display: 'WebSocket Attack Payloads',              short: 'WebSocket injection payloads for CSWSH, message hijacking, and protocol upgrade attacks.' },
  { folder: 'CSS Injection',                     slug: 'payloads-css-injection',    category: 'payloads-web', display: 'CSS Injection Payloads',                 short: 'CSS injection payloads for data exfiltration, UI redress, and attribute value theft.' },
  { folder: 'Clickjacking',                      slug: 'payloads-clickjacking',     category: 'payloads-web', display: 'Clickjacking Payloads',                  short: 'Clickjacking PoC templates and X-Frame-Options bypass payloads.' },
  { folder: 'Type Juggling',                     slug: 'payloads-type-juggling',    category: 'payloads-web', display: 'Type Juggling Payloads',                 short: 'PHP and JavaScript type juggling payloads for authentication and comparison bypass.' },
  { folder: 'Mass Assignment',                   slug: 'payloads-mass-assignment',  category: 'payloads-web', display: 'Mass Assignment Payloads',               short: 'Mass assignment attack payloads for unauthorized parameter binding in web frameworks.' },
  { folder: 'Dependency Confusion',              slug: 'payloads-dep-confusion',    category: 'payloads-web', display: 'Dependency Confusion Payloads',          short: 'Dependency confusion attack techniques for supply-chain package hijacking.' },
  { folder: 'Account Takeover',                  slug: 'payloads-ato',              category: 'payloads-web', display: 'Account Takeover Payloads',              short: 'Account takeover payloads and methodology for password reset abuse, session fixation, and more.' },
  { folder: 'Brute Force Rate Limit',            slug: 'payloads-bruteforce',       category: 'payloads-web', display: 'Brute Force & Rate Limit Bypass',        short: 'Brute force payloads and rate limit bypass techniques for credential stuffing and enumeration.' },
  { folder: 'Business Logic Errors',             slug: 'payloads-bizlogic',         category: 'payloads-web', display: 'Business Logic Error Payloads',          short: 'Business logic flaw payloads for price manipulation, workflow bypass, and privilege escalation.' },
  { folder: 'API Key Leaks',                     slug: 'payloads-api-key-leaks',    category: 'payloads-web', display: 'API Key Leak Detection Payloads',        short: 'API key leak discovery patterns, dorks, and exploitation techniques for exposed credentials.' },
  { folder: 'CVE Exploits',                      slug: 'payloads-cve',              category: 'payloads-web', display: 'CVE Exploit Payloads',                   short: 'Real-world CVE exploit payloads and PoC scripts for known vulnerabilities.' },
  { folder: 'Reverse Proxy Misconfigurations',   slug: 'payloads-reverse-proxy',    category: 'payloads-web', display: 'Reverse Proxy Misconfiguration Payloads', short: 'Reverse proxy misconfiguration payloads for path confusion, header injection, and SSRF.' },
  { folder: 'Virtual Hosts',                     slug: 'payloads-vhosts',           category: 'payloads-web', display: 'Virtual Host Attack Payloads',           short: 'Virtual host discovery and manipulation payloads for multi-tenant bypass and SSRF escalation.' },
  { folder: 'Hidden Parameters',                 slug: 'payloads-hidden-params',    category: 'payloads-web', display: 'Hidden Parameter Discovery Payloads',    short: 'Hidden parameter discovery wordlists and techniques for endpoint attack surface expansion.' },
  { folder: 'ORM Leak',                          slug: 'payloads-orm-leak',         category: 'payloads-web', display: 'ORM Leak Payloads',                      short: 'ORM query leak payloads for Django, Hibernate, ActiveRecord, and Eloquent data exfiltration.' },
  // --- Web Research ---
  { folder: 'DOM Clobbering',                    slug: 'payloads-dom-clobbering',   category: 'payloads-research', display: 'DOM Clobbering Payloads',              short: 'DOM clobbering attack payloads for overriding globals and enabling XSS via named elements.' },
  { folder: 'Encoding Transformations',          slug: 'payloads-encoding',         category: 'payloads-research', display: 'Encoding Transformation Payloads',     short: 'Encoding transformation payloads for WAF bypass using URL, HTML, Unicode, and base encoding.' },
  { folder: 'Regular Expression',                slug: 'payloads-regex',            category: 'payloads-research', display: 'ReDoS & Regex Attack Payloads',        short: 'Regular expression exploitation payloads for ReDoS, catastrophic backtracking, and filter bypass.' },
  { folder: 'DNS Rebinding',                     slug: 'payloads-dns-rebinding',    category: 'payloads-research', display: 'DNS Rebinding Payloads',               short: 'DNS rebinding attack payloads for bypassing SOP and accessing internal services via browsers.' },
  { folder: 'Tabnabbing',                        slug: 'payloads-tabnabbing',       category: 'payloads-research', display: 'Tabnabbing Payloads',                  short: 'Reverse tabnabbing payloads using window.opener for phishing and session credential theft.' },
  { folder: 'XS-Leak',                           slug: 'payloads-xs-leak',          category: 'payloads-research', display: 'XS-Leak Payloads',                     short: 'Cross-site leak payloads for timing oracles, cache probing, and cross-origin data inference.' },
  { folder: 'Headless Browser',                  slug: 'payloads-headless',         category: 'payloads-research', display: 'Headless Browser Attack Payloads',     short: 'Headless browser exploitation payloads for SSRF, XSS, and sandbox escape via Puppeteer/CDP.' },
  { folder: 'Client Side Path Traversal',        slug: 'payloads-cspt',             category: 'payloads-research', display: 'Client Side Path Traversal Payloads',  short: 'Client-side path traversal payloads for XSS gadgets and fetch URL manipulation.' },
  { folder: 'Google Web Toolkit',                slug: 'payloads-gwt',              category: 'payloads-research', display: 'Google Web Toolkit Payloads',           short: 'GWT application attack payloads for RPC serialization abuse and endpoint discovery.' },
  { folder: 'External Variable Modification',    slug: 'payloads-ext-var',          category: 'payloads-research', display: 'External Variable Modification Payloads',short: 'External variable modification payloads for global scope poisoning and configuration injection.' },
  { folder: 'Java RMI',                          slug: 'payloads-java-rmi',         category: 'payloads-research', display: 'Java RMI Attack Payloads',             short: 'Java RMI exploitation payloads for deserialization, registry enumeration, and RCE.' },
  { folder: 'Insecure Randomness',               slug: 'payloads-insecure-random',  category: 'payloads-research', display: 'Insecure Randomness Payloads',          short: 'Insecure randomness exploitation payloads for PRNG prediction and token forge attacks.' },
  { folder: 'Insecure Management Interface',     slug: 'payloads-mgmt-interface',   category: 'payloads-research', display: 'Insecure Management Interface Payloads',short: 'Management interface exposure payloads for default credentials, admin panel bypass, and enumeration.' },
  { folder: 'Insecure Source Code Management',   slug: 'payloads-scm-exposure',     category: 'payloads-research', display: 'Source Code Management Exposure Payloads',short: 'SCM exposure payloads for .git, .svn, and .hg directory disclosure and source code extraction.' },
  { folder: 'Zip Slip',                          slug: 'payloads-zip-slip',         category: 'payloads-research', display: 'Zip Slip Payloads',                     short: 'Zip slip archive traversal payloads for arbitrary file write via malicious ZIP/TAR archives.' },
  // --- Methodology ---
  { folder: 'Methodology and Resources',         slug: 'payloads-methodology',      category: 'payloads-resources', display: 'Pentest Methodology & Resources',       short: 'Penetration testing methodology, recon checklists, tools, and structured engagement resources.' },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'REA_Skill-Integration/2.1' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function extractDescription(markdown, maxChars = 400) {
  // Remove frontmatter, headings, badges, HTML tags, code blocks
  let text = markdown
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/#+\s+.*/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/^\s*[-*>|]\s*/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length > maxChars) text = text.slice(0, maxChars).replace(/\s+\S*$/, '') + '...';
  return text || 'Comprehensive payload library and exploitation techniques from PayloadsAllTheThings.';
}

function buildSkillMd(item, readmeContent) {
  const desc = extractDescription(readmeContent);
  // Escape any backtick sequences that would break YAML
  const safeDesc = desc.replace(/"/g, "'");
  
  return `---
name: ${item.slug}
description: "${safeDesc}"
---

# ${item.display}

> **Source:** [PayloadsAllTheThings/${item.folder}](https://github.com/swisskyrepo/payloadsallthethings/tree/master/${encodeURIComponent(item.folder)})
> **Category:** \`${item.category}\` | **Skill ID:** \`${item.slug}\`

## Overview

${item.short}

This skill integrates the full **PayloadsAllTheThings** (PATT) payload library for the **${item.display}** domain into the REA_Skill framework. Use it during authorized penetration testing, bug bounty research, security audits, and CTF challenges.

## Workflow

### 1. Recon & Identification
- Identify the target technology stack and injection points
- Enumerate endpoints, parameters, and input vectors
- Determine applicable payload categories from the reference below

### 2. Payload Selection
- Browse the PATT payload library for the attack class
- Select encoding-appropriate payloads for the target environment
- Consider WAF bypass variants and obfuscation techniques

### 3. Exploitation (Authorized Only)
- Test payloads in order: passive → active → escalation
- Document every payload tested and its response
- Capture PoC evidence (screenshots, HTTP logs, curl output)

### 4. Verification & Reporting
- Confirm the vulnerability with a clean minimal PoC
- Map findings to CVE/CWE where applicable
- Report with remediation recommendations and code fixes

---

## Full PATT Reference

${readmeContent.trim()}

---

## REA MCP Integration

\`\`\`javascript
// REA MCP — Automated payload injection via REA tools
// Use analyze_function, procedure_pseudo_code, or observe_native_calls
// to identify injection sinks, then apply payloads from this skill.
\`\`\`

## Legal Notice

> ⚠️ **Authorized Use Only.** All payloads in this skill are for security research, penetration testing with written permission, CTF competitions, and defensive study. Unauthorized use against systems you do not own or have explicit permission to test is illegal.
`;
}

function buildOpenAIYaml(item) {
  return `interface:
  display_name: "${item.display}"
  short_description: "${item.short}"
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const agentsSkillsDir = path.join(ROOT, '.agents', 'skills');
const skillsDir       = path.join(ROOT, 'skills');

let created = 0;
let skipped = 0;
let failed  = [];

console.log(`\n🚀 PayloadsAllTheThings Integration — ${PAYLOAD_CATALOG.length} skills\n`);

for (const item of PAYLOAD_CATALOG) {
  const rawUrl = `https://raw.githubusercontent.com/swisskyrepo/payloadsallthethings/master/${encodeURIComponent(item.folder)}/README.md`;
  
  process.stdout.write(`  [${item.slug}] Fetching README...`);
  
  let readmeContent = '';
  try {
    const { status, body } = await fetchUrl(rawUrl);
    if (status === 200) {
      readmeContent = body;
      process.stdout.write(` ✓ (${body.length} chars)\n`);
    } else {
      process.stdout.write(` ✗ HTTP ${status} — using placeholder\n`);
      readmeContent = `# ${item.display}\n\nSee: https://github.com/swisskyrepo/payloadsallthethings/tree/master/${item.folder}\n`;
      failed.push({ slug: item.slug, reason: `HTTP ${status}` });
    }
  } catch (e) {
    process.stdout.write(` ✗ Error: ${e.message} — using placeholder\n`);
    readmeContent = `# ${item.display}\n\nSee: https://github.com/swisskyrepo/payloadsallthethings/tree/master/${item.folder}\n`;
    failed.push({ slug: item.slug, reason: e.message });
  }

  const skillMd   = buildSkillMd(item, readmeContent);
  const openaiYml = buildOpenAIYaml(item);

  // Location 1: .agents/skills/<slug>/
  const agentDir = path.join(agentsSkillsDir, item.slug);
  ensureDir(agentDir);
  ensureDir(path.join(agentDir, 'agents'));
  writeIfNotExists(path.join(agentDir, 'SKILL.md'), skillMd);
  writeIfNotExists(path.join(agentDir, 'agents', 'openai.yaml'), openaiYml);

  // Location 2: skills/<category>/<slug>/
  const catDir = path.join(skillsDir, item.category, item.slug);
  ensureDir(catDir);
  writeIfNotExists(path.join(catDir, 'SKILL.md'), skillMd);

  // Location 3: skills/<slug>/
  const flatDir = path.join(skillsDir, item.slug);
  ensureDir(flatDir);
  writeIfNotExists(path.join(flatDir, 'SKILL.md'), skillMd);

  created++;
  console.log(`    → Written: .agents/skills/${item.slug}/, skills/${item.category}/${item.slug}/, skills/${item.slug}/`);
}

console.log(`\n✅ Done! Created ${created} skills, skipped ${skipped}.`);
if (failed.length > 0) {
  console.log(`\n⚠️  Failed to fetch READMEs for ${failed.length} skills (placeholders used):`);
  failed.forEach(f => console.log(`   - ${f.slug}: ${f.reason}`));
}
console.log(`\n▶  Next: node scripts/build-manifests.mjs\n`);
