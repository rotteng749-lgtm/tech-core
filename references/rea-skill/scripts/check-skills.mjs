#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

let errors = 0;
let warnings = 0;
const root = process.cwd();

function logPass(msg) {
  console.log(`\x1b[32m✔ PASS:\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  errors++;
}

function logWarn(msg) {
  console.warn(`\x1b[33m⚠ WARN:\x1b[0m ${msg}`);
  warnings++;
}

console.log('--- REA Skills Quality & Specification Test Suite ---\n');

// 1. Verify package.json and .claude-plugin/plugin.json synchronization
const pkgPath = path.join(root, 'package.json');
const pluginPath = path.join(root, '.claude-plugin', 'plugin.json');
const marketplacePath = path.join(root, '.claude-plugin', 'marketplace.json');

if (!fs.existsSync(pkgPath)) {
  logFail('package.json does not exist');
} else {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    logPass(`package.json is valid (v${pkg.version})`);

    if (!fs.existsSync(pluginPath)) {
      logFail('.claude-plugin/plugin.json does not exist');
    } else {
      const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
      if (plugin.version === pkg.version) {
        logPass(`.claude-plugin/plugin.json version matches package.json (v${plugin.version})`);
      } else {
        logFail(`Version mismatch: package.json is ${pkg.version}, plugin.json is ${plugin.version}`);
      }

      // Check plugin.json declared skills
      if (Array.isArray(plugin.skills)) {
        for (const skillRel of plugin.skills) {
          const absPath = path.resolve(root, skillRel);
          if (fs.existsSync(absPath)) {
            logPass(`Plugin target exists: ${skillRel}`);
          } else {
            logFail(`Plugin target missing on disk: ${skillRel}`);
          }
        }
      } else {
        logFail('.claude-plugin/plugin.json missing "skills" array');
      }
    }
  } catch (err) {
    logFail(`Failed parsing package.json or plugin.json: ${err.message}`);
  }
}

// 2. Verify marketplace.json
if (!fs.existsSync(marketplacePath)) {
  logFail('.claude-plugin/marketplace.json does not exist');
} else {
  try {
    JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
    logPass('.claude-plugin/marketplace.json is valid JSON');
  } catch (err) {
    logFail(`.claude-plugin/marketplace.json parse error: ${err.message}`);
  }
}

// 3. Check every skill in .agents/skills/
const skillsBase = path.join(root, '.agents', 'skills');
if (!fs.existsSync(skillsBase)) {
  logFail('.agents/skills directory not found');
} else {
  const skillDirs = fs.readdirSync(skillsBase).filter(f => fs.statSync(path.join(skillsBase, f)).isDirectory());
  console.log(`\nValidating ${skillDirs.length} skills in .agents/skills/:\n`);

  for (const s of skillDirs) {
    const dir = path.join(skillsBase, s);
    const skillMd = path.join(dir, 'SKILL.md');
    const openaiYaml = path.join(dir, 'agents', 'openai.yaml');

    if (!fs.existsSync(skillMd)) {
      logFail(`[${s}] SKILL.md is missing`);
      continue;
    }

    const content = fs.readFileSync(skillMd, 'utf8');
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
      logFail(`[${s}] SKILL.md missing valid YAML frontmatter`);
      continue;
    }

    const fm = fmMatch[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    const userInvoked = /disable-model-invocation:\s*true/m.test(fm);

    if (!nameMatch) {
      logFail(`[${s}] Frontmatter missing 'name'`);
    } else {
      const name = nameMatch[1].trim();
      if (name !== s) {
        logFail(`[${s}] Frontmatter name '${name}' does not match directory name '${s}'`);
      }
    }

    if (!descMatch) {
      logFail(`[${s}] Frontmatter missing 'description'`);
    }

    if (!fs.existsSync(openaiYaml)) {
      logFail(`[${s}] agents/openai.yaml is missing`);
    } else {
      const yamlContent = fs.readFileSync(openaiYaml, 'utf8');
      if (!yamlContent.includes('display_name:')) {
        logFail(`[${s}] agents/openai.yaml missing display_name`);
      }
      if (!yamlContent.includes('short_description:')) {
        logFail(`[${s}] agents/openai.yaml missing short_description`);
      }
      if (userInvoked && !yamlContent.includes('allow_implicit_invocation: false')) {
        logFail(`[${s}] User-invoked skill must set allow_implicit_invocation: false in openai.yaml`);
      }
    }

    logPass(`Skill [${s}] verified (userInvoked=${userInvoked})`);
  }
}

// Summary
console.log('\n----------------------------------------------');
if (errors === 0) {
  console.log(`\x1b[32m✔ SUCCESS: All checks passed with 0 errors (${warnings} warnings).\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\x1b[31m✖ FAILURE: Encountered ${errors} error(s).\x1b[0m\n`);
  process.exit(1);
}
