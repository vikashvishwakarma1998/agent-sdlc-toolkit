// Runs before the agent runs a shell command and blocks a few dangerous ones.
// Works for both Claude Code (PreToolUse) and Cursor (beforeShellExecution).

const BLOCKED = [
  { pattern: /\brm\s+-[a-z]*r[a-z]*\s+(\/|~\/?|\.\.\/?)(\s|$)/i, reason: 'deleting /, ~ or .. is not allowed' },
  { pattern: /\bgit\s+push\b.*(--force|\s-f\b)/, reason: 'force push is not allowed' },
  { pattern: /\bgit\s+reset\s+--hard\b/, reason: 'git reset --hard is not allowed' },
  { pattern: /\b(cat|less|more|head|tail)\s+\S*\.env\b(?!\.example)/, reason: 'reading .env files is not allowed' },
  // Follow the pattern of the above rules to block other dangerous commands or if you want to support your own commands, add them here.
];

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  let data = {};
  try {
    data = JSON.parse(input);
  } catch {
    // Bad input: let the command through.
  }

  const isCursor = data.hook_event_name === 'beforeShellExecution';
  const command = isCursor ? data.command : data.tool_input?.command;
  const match = BLOCKED.find((rule) => rule.pattern.test(command ?? ''));

  if (isCursor) {
    const reply = match
      ? { permission: 'deny', user_message: `Blocked: ${match.reason}`, agent_message: `Blocked: ${match.reason}` }
      : { permission: 'allow' };
    console.log(JSON.stringify(reply));
    return;
  }

  if (match) {
    // Claude Code: exit code 2 blocks the command and shows the message to Claude.
    console.error(`Blocked: ${match.reason}`);
    process.exit(2);
  }
});
