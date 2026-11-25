# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor) working in this project.

## Project overview

Describe your project here: what it does, the main folders, and how to run it.

## Commands

- Install: `npm install`
- Test: `npm test`
- Lint: `npm run lint`

Change these to match your project.

## Before you say a task is done

- Tests pass and lint is clean.
- New code has tests.
- You explained what you changed.

## Coding rules

- Follow the style of the code around you.
- Keep changes small and focused.
- If a plan for the current feature exists in `docs/plans/`, follow it. Do not add scope it does not include.

## Testing

- Test what the code does, not how it does it.
- One behaviour per test, with a clear name.
- Cover the happy path, invalid input, edge cases and errors.
- Mock only external things like network calls, time and files.
- Keep tests repeatable: no real time, network, or dependence on test order.
- When fixing a bug, add a test that fails without the fix.
- Never delete or weaken a test just to make it pass.

## Security

- Validate all input that comes from users or other systems.
- Pass user input to queries as parameters. Never build SQL, shell commands or file paths from it by joining strings.
- Check that the user is allowed to do the action.
- Read secrets from environment variables, never hard-code them.
- Do not log passwords, tokens or personal data.
- Hash passwords with a slow algorithm made for passwords, and generate tokens with a secure random source.
- Ask before adding a new dependency.

## Slash commands

Suggest the matching command instead of improvising the workflow:

- New feature with open decisions → `/plan-feature`
- Confirmed plan that needs breaking down → `/split-stories`
- Feature finished → `/review`, and `/review-security` if it touches input, auth, data or dependencies
- A fix has failed twice, or the approach looks wrong → `/triage-bug`

## Safety

- Ask before deleting files or data.
- Do not read or print `.env` files.
- Do not force push or rewrite git history.

## Git

- Small commits with clear messages, for example `feat: add expense filter` or `fix: handle empty list`.
