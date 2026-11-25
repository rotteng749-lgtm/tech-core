import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.join(process.cwd(), '.agents', 'skills');
const destDir = path.join(process.cwd(), 'skills');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const skills = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());
console.log(`Syncing ${skills.length} skills from .agents/skills to skills/...`);

for (const skill of skills) {
  const srcSkill = path.join(srcDir, skill);
  const destSkill = path.join(destDir, skill);
  copyRecursive(srcSkill, destSkill);
  console.log(`Synced: ${skill}`);
}

console.log('All skills mirrored successfully.');
