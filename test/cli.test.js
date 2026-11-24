import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const root = join(import.meta.dirname, '..');
const cli = join(root, 'bin', 'cli.js');
const hook = join(root, 'templates', 'hooks', 'block-dangerous.mjs');

function runInit(dir, ...args) {
  return execFileSync(process.execPath, [cli, 'init', ...args], { cwd: dir, encoding: 'utf8' });
}

function runHook(payload) {
  return spawnSync(process.execPath, [hook], { input: JSON.stringify(payload), encoding: 'utf8' });
}

test('init copies rules, commands and hooks', () => {
  const dir = mkdtempSync(join(tmpdir(), 'asdlc-'));
  runInit(dir);
  for (const file of [
    'AGENTS.md',
    'CLAUDE.md',
    '.claude/settings.json',
    '.claude/commands/review.md',
    '.claude/hooks/block-dangerous.mjs',
    '.cursor/hooks.json',
    '.cursor/commands/review.md',
    '.cursor/rules/00-core.mdc',
    '.cursor/hooks/block-dangerous.mjs',
  ]) {
    assert.ok(existsSync(join(dir, file)), `${file} should exist`);
  }
});

test('init does not overwrite existing files unless --force is used', () => {
  const dir = mkdtempSync(join(tmpdir(), 'asdlc-'));
  writeFileSync(join(dir, 'AGENTS.md'), 'my own rules');

  const output = runInit(dir);
  assert.match(output, /skip {4}AGENTS\.md/);
  assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), 'my own rules');

  runInit(dir, '--force');
  assert.notEqual(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), 'my own rules');
});

test('hook blocks dangerous commands in Claude Code', () => {
  const res = runHook({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'rm -rf /' } });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /Blocked/);
});

test('hook allows normal commands in Claude Code', () => {
  const res = runHook({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'npm test' } });
  assert.equal(res.status, 0);
});

test('hook answers Cursor with allow or deny', () => {
  const denied = runHook({ hook_event_name: 'beforeShellExecution', command: 'git push --force' });
  assert.equal(JSON.parse(denied.stdout).permission, 'deny');

  const allowed = runHook({ hook_event_name: 'beforeShellExecution', command: 'cat .env.example' });
  assert.equal(JSON.parse(allowed.stdout).permission, 'allow');
});
