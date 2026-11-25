import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const agentsSkillsDir = path.join(root, '.agents', 'skills');
const skillsDir = path.join(root, 'skills');

const CATEGORIES = [
  'rea-core',
  'agent-ecosystem',
  'web',
  'auth',
  'active-directory',
  'wireless',
  'cloud',
  'mobile',
  'iot',
  'infrastructure',
  'exploit-dev',
  'fuzzing',
  'recon',
  'api',
  'container',
  'cicd',
  'crypto',
  'privesc',
  'post-exploitation',
  'forensics',
  'supply-chain',
  'social-engineering',
  'network',
  'ai',
  'utility',
  // PayloadsAllTheThings categories
  'payloads-injection',
  'payloads-web',
  'payloads-research',
  'payloads-resources',
];

// 1. Update .claude-plugin/plugin.json with all 100 skills
const allSkills = fs
  .readdirSync(agentsSkillsDir)
  .filter(f => fs.statSync(path.join(agentsSkillsDir, f)).isDirectory())
  .sort();

const pluginJsonPath = path.join(root, '.claude-plugin', 'plugin.json');
const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
pluginJson.description =
  'Unified 163-Skill Reverse Engineering, Payload Library, Lost Source Code Recovery, Security Auditing & Multi-Agent Intelligence Suite (REA_Skill + claude-red + PayloadsAllTheThings) across 29 categories.';
pluginJson.skills = allSkills.map(s => `./.agents/skills/${s}`);
fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n', 'utf8');
console.log(`Updated .claude-plugin/plugin.json with ${allSkills.length} skills.`);

// 2. Generate claude-skills.json from skills/<category>/<skill>/SKILL.md
const categoryMap = {};
const skillsDetailed = [];

for (const cat of CATEGORIES) {
  const catPath = path.join(skillsDir, cat);
  const skillNames = fs
    .readdirSync(catPath)
    .filter(f => fs.statSync(path.join(catPath, f)).isDirectory() && fs.existsSync(path.join(catPath, f, 'SKILL.md')))
    .sort();
  categoryMap[cat] = skillNames;

  for (const s of skillNames) {
    const md = fs.readFileSync(path.join(catPath, s, 'SKILL.md'), 'utf8');
    const descMatch = md.match(/^description:\s*"?(.+?)"?\s*$/m);
    skillsDetailed.push({
      name: s,
      category: cat,
      path: `skills/${cat}/${s}/SKILL.md`,
      agentPath: `.agents/skills/${s}/SKILL.md`,
      description: descMatch ? descMatch[1] : ''
    });
  }
}

const claudeSkillsManifest = {
  name: 'rea-skills',
  version: pluginJson.version,
  license: 'MIT',
  homepage: 'https://smartworldarafath.github.io/REA_Skill/',
  repository: 'https://github.com/smartworldarafath/REA_Skill',
  totalCategories: CATEGORIES.length,
  totalSkills: allSkills.length,
  categories: categoryMap,
  skills: skillsDetailed
};

fs.writeFileSync(
  path.join(root, 'claude-skills.json'),
  JSON.stringify(claudeSkillsManifest, null, 2) + '\n',
  'utf8'
);
console.log(`Generated claude-skills.json (${CATEGORIES.length} categories, ${allSkills.length} skills).`);
