import fs from 'node:fs';
import path from 'node:path';

const metadata = {
  'agent-reach': { name: 'Agent Reach', desc: 'Read-only internet & social intelligence search' },
  'brightdata-mcp': { name: 'Bright Data MCP', desc: 'Industrial scraping & anti-bot bypass' },
  'ecc-workflow': { name: 'ECC Engineering Workflow', desc: 'Everything Claude Code engineering rigor & TDD' },
  'hyperbrowser-mcp': { name: 'Hyperbrowser MCP', desc: 'Cloud headless browser & SPA crawler' },
  'playwright-mcp': { name: 'Playwright MCP', desc: 'Local browser automation & accessibility tree E2E' },
  'rea-binary-disassembly': { name: 'REA Binary Disassembly', desc: 'Windows, Linux, and macOS binary decompilation & analysis' },
  'rea-database-storage-recovery': { name: 'REA Database & Storage Recovery', desc: 'SQLite, Realm, LevelDB, and binary format reverse engineering' },
  'rea-firmware-iot-extension': { name: 'REA Firmware & IoT Extension', desc: 'Firmware extraction, EVM contracts & signal decoding' },
  'rea-full-code-recovery': { name: 'REA Full Code Recovery', desc: '100% complete, non-skeletal source code recovery from binaries' },
  'rea-game-asset-recovery': { name: 'REA Game Asset Recovery', desc: 'Unity, Unreal, Godot assets, shaders & model extraction' },
  'rea-grill-me': { name: 'REA Grill Me', desc: 'Relentless interview to scope reverse engineering & recovery plans', userInvoked: true },
  'rea-grilling': { name: 'REA Grilling Engine', desc: 'Interactive interrogation engine for reverse engineering tasks' },
  'rea-mobile-app-recovery': { name: 'REA Mobile App Recovery', desc: 'Android & iOS reverse engineering & 5-pillar security scan' },
  'rea-owner-authorization': { name: 'REA Owner Authorization', desc: 'First-party owner authorization for reverse engineering' },
  'rea-performance-crash-triage': { name: 'REA Crash & Performance Triage', desc: 'Minidump forensics, Frida instrumentation & flamegraphs' },
  'rea-personal-use-authorization': { name: 'REA Personal Use Authorization', desc: 'Owner authorization for personal apps, sites & software' },
  'rea-protocol-api-recovery': { name: 'REA Protocol & API Recovery', desc: 'PCAP dissection, Protobuf/gRPC recovery & SDK generation' },
  'rea-universal-orchestrator': { name: 'REA Universal Orchestrator', desc: 'Master artifact router for 500+ templates & custom tasks' },
  'rea-web-bundle-recovery': { name: 'REA Web Bundle Recovery', desc: 'JS/TS bundles, WASM decompilation & Electron asar recovery' },
  'surfsense': { name: 'SurfSense', desc: 'Air-gapped local documentation & codebase RAG' },
  'website-security-audit': { name: 'Website Security Audit', desc: '10-layer defensive web vulnerability & OWASP scanner' }
};

const baseDir = path.join(process.cwd(), '.agents', 'skills');
for (const [skill, meta] of Object.entries(metadata)) {
  const agentDir = path.join(baseDir, skill, 'agents');
  if (!fs.existsSync(agentDir)) fs.mkdirSync(agentDir, { recursive: true });
  let yamlContent = `interface:\n  display_name: "${meta.name}"\n  short_description: "${meta.desc}"\n`;
  if (meta.userInvoked) {
    yamlContent += `policy:\n  allow_implicit_invocation: false\n`;
  }
  const filePath = path.join(agentDir, 'openai.yaml');
  fs.writeFileSync(filePath, yamlContent, 'utf8');
  console.log(`Generated: ${filePath}`);
}
