# agent-sdlc-toolkit

Ready-made **rules**, **slash commands** and **hooks** for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [Cursor](https://cursor.com).

Run one command in your project and your AI agent gets a shared set of instructions and commands.

## Install

In the root of your project:

```bash
npx agent-sdlc-toolkit init
```

Files that already exist are skipped. To overwrite them:

```bash
npx agent-sdlc-toolkit init --force
```

Requires Node.js 20 or newer.

## What gets installed

| File | Used by | What it is |
| --- | --- | --- |
| `AGENTS.md` | Both | Main instructions for the agent |
| `CLAUDE.md` | Claude Code | Points to `AGENTS.md` |
| `.cursor/rules/*.mdc` | Cursor | Core, testing and security rules |
| `.claude/commands/*.md` | Claude Code | Slash commands |
| `.cursor/commands/*.md` | Cursor | Slash commands |
| `.claude/settings.json` + `.claude/hooks/` | Claude Code | Hook that blocks dangerous commands |
| `.cursor/hooks.json` + `.cursor/hooks/` | Cursor | Same hook for Cursor |

## Slash commands

| Command | What it does |
| --- | --- |
| `/plan-feature` | Turns a feature idea into a short plan |
| `/split-stories` | Splits a plan into small stories |
| `/review` | Reviews the current changes |
| `/review-security` | Looks for security problems in the current changes |
| `/gen-tests` | Writes tests for a file or feature |
| `/triage-bug` | Finds the cause of a bug and suggests a fix |
| `/release-notes` | Adds release notes to `CHANGELOG.md` |

Example: `/plan-feature add password reset by email`

## The hook

`block-dangerous.mjs` runs before the agent runs a shell command. It blocks:

- `rm -rf /`, `rm -rf ~`, `rm -rf ..`
- `git push --force`
- `git reset --hard`
- reading `.env` files (`cat .env`)

Everything else is allowed. To add your own rule, add a line to the `BLOCKED` list in the hook file.

## Customise

After installing, the files are yours. Edit them as you like:

- Fill in the project overview and commands in `AGENTS.md`.
- Add a new command by adding a `.md` file to `.claude/commands/` and `.cursor/commands/`.
- Add a new Cursor rule by adding a `.mdc` file to `.cursor/rules/`.

## Develop this package

```bash
git clone <this repo>
cd agent-sdlc-toolkit
npm test
```

To try it in another project before publishing:

```bash
npm link                      # in this folder
cd ../my-project
agent-sdlc-toolkit init
```

The files that get copied live in `templates/`. The CLI is `bin/cli.js`.

## License

MIT
