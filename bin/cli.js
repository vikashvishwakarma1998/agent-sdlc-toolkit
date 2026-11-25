#!/usr/bin/env node
// agent-sdlc-toolkit: copies rules, commands and hooks into the current project.

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const templates = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates');

// [file in templates/, where it goes in the project]
function filesToCopy() {
  const files = [
    ['AGENTS.md', 'AGENTS.md'],
    ['CLAUDE.md', 'CLAUDE.md'],
    ['claude-settings.json', '.claude/settings.json'],
    ['cursor-hooks.json', '.cursor/hooks.json'],
    ['hooks/block-dangerous.mjs', '.claude/hooks/block-dangerous.mjs'],
    ['hooks/block-dangerous.mjs', '.cursor/hooks/block-dangerous.mjs'],
  ];
  for (const rule of readdirSync(join(templates, 'rules'))) {
    files.push([`rules/${rule}`, `.cursor/rules/${rule}`]);
  }
  for (const command of readdirSync(join(templates, 'commands'))) {
    files.push([`commands/${command}`, `.claude/commands/${command}`]);
    files.push([`commands/${command}`, `.cursor/commands/${command}`]);
  }
  return files;
}

function init(projectDir, force) {
  console.log(`Installing agent-sdlc-toolkit into ${projectDir}\n`);
  let created = 0;
  let skipped = 0;

  for (const [from, to] of filesToCopy()) {
    const target = join(projectDir, to);
    if (existsSync(target) && !force) {
      console.log(`  skip    ${to} (already exists)`);
      skipped++;
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(templates, from), target);
    console.log(`  create  ${to}`);
    created++;
  }

  console.log(`\nDone: ${created} file(s) created, ${skipped} skipped.`);
  if (skipped > 0) console.log('Run again with --force to overwrite existing files.');
  console.log('Next: edit AGENTS.md to describe your project and its commands.');
}

const HELP = `Usage: npx agent-sdlc-toolkit init [--force]

  init      Copy rules, commands and hooks into the current folder
  --force   Overwrite files that already exist
  --help    Show this help`;

const args = process.argv.slice(2);
if (args[0] === 'init') {
  init(process.cwd(), args.includes('--force'));
} else {
  console.log(HELP);
  if (args.length > 0 && !args.includes('--help')) process.exitCode = 1;
}
