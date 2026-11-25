---
description: Review the current changes for security problems like an attacker would — injection, missing permission checks, leaked secrets, unsafe input and risky dependencies. Reports each finding with file:line, what could go wrong and how to fix it (read-only).
---

# Security review

Code that works is not the same as code that is safe.

AI-generated code is especially good at the happy path. It reads the input, does the thing, returns the result. What it often misses is the person who sends input nobody expected, calls the endpoint they should not have access to, or reads the log file the token was written into. This command looks at the current changes the way that person would.

## What This Command Does Not Do

It does not edit any files. It reports what it finds and lets the developer decide what to fix. A security fix applied without understanding the problem often moves the hole instead of closing it.

It does not report theoretical problems without a path. Every finding must show how untrusted data or an untrusted user actually reaches the weak point.

---

## Step 1 — Establish the Scope

Review what is given after this command. If nothing is given, review the current changes: uncommitted and staged changes first, then the commits on this branch that are not on the main branch.

Before reviewing, read:

- `AGENTS.md` and the project's security rules — they define what the project already promises
- The plan in `docs/plans/<feature-name>.md` if one exists — it says who is supposed to be able to do what
- Enough of the surrounding code to understand where the changed code is called from

---

## Step 2 — Map the Attack Surface

Before looking for problems, list where untrusted data and untrusted users enter the changed code:

```
Attack surface:
- Entry points: [routes, handlers, CLI arguments, form fields, webhooks, file uploads, messages]
- Untrusted data: [what comes from users or other systems, and where it goes]
- Sensitive actions: [what changes data, spends money, sends messages, or exposes private information]
- Trust boundaries: [where data moves from untrusted to trusted — database, shell, file system, other services]
```

Every check in Step 3 is about something on this list. If the changes add nothing to it, say so — the review will be short, and that is a good result.

---

## Step 3 — Check Each Category

### Injection

- **SQL / queries** — is user input concatenated into a query instead of passed as a parameter?
- **Shell commands** — is user input passed to a shell, `exec`, or similar? Can it add flags or extra commands?
- **File paths** — can user input contain `../` or an absolute path that reaches files outside the intended folder?
- **HTML and templates** — is user input rendered without escaping, allowing scripts to run in another user's browser?

### Login and permission checks

- Is every new route or action protected by a login check where it should be?
- Is the user allowed to do this specific action on this specific record — not just logged in? Changing an ID in the request must not give access to someone else's data.
- Are checks done on the server, not only hidden in the UI?

### Unsafe handling of user input

- Is all input from users or other systems validated — type, length, format, allowed values?
- Are uploads limited in size and type?
- Are unbounded inputs able to cause huge queries, loops or memory use?

### Secrets and sensitive data

- Are passwords, tokens or keys written into the code, config files or tests?
- Are secrets read from environment variables?
- Are passwords, tokens or personal data written to logs, error messages or API responses?
- Do responses return more fields than the caller needs?

### Configuration

- Are cookies marked secure and HTTP-only where they hold sessions?
- Is CORS limited to known origins instead of allowing everything?
- Are state-changing requests protected against cross-site request forgery where the project uses cookies?
- Is any debug mode, verbose error output, or permissive default left switched on?

### Cryptography and randomness

- Are passwords hashed with a slow, purpose-built algorithm — never stored plain or with a fast hash?
- Are tokens and IDs that must be unguessable generated with a secure random source?
- Is any home-made encryption being used where a standard library exists?

### Risky new dependencies

- Is each new package actually needed, well known and maintained?
- Does it run install scripts or ask for more access than it should need?
- Is the version pinned, and does it have known vulnerabilities?

---

## Step 4 — Confirm Each Finding

For each possible problem, trace it from where the untrusted data enters to where it causes harm. If you cannot trace a real path, do not report it as a finding — mention it under "Worth checking" instead.

Be honest about confidence. A short list of real problems is more useful than a long list of guesses.

---

## Step 5 — Report What You Found

```
## Security Review — [Feature or change name]

### Scope
[What was reviewed — files, commits, or changes]

### Findings

#### [Severity] — [Short title]
- Location: [file:line]
- What could go wrong: [how an attacker would use it, step by step]
- How to fix: [the specific change that closes it]

[Repeat for each finding, most severe first]

### Worth checking
[Things that could be a problem but where no real path was found, and what would confirm them]

### Summary
[X] findings: [N] critical, [N] high, [N] medium, [N] low.

[If no findings: "No security problems found in these changes."]
[If findings: "Resolve critical and high findings before this is merged."]
```

---

## Step 6 — Let the Developer Decide

After presenting the report, stop. Do not edit any files.

Wait for the developer to:

- Ask you to fix a specific finding
- Tell you a finding is acceptable and why
- Ask you to look deeper at something under "Worth checking"

---

## Severity Guide

**Critical** — anyone can exploit it with little effort and serious damage: injection with a clear path, missing login check on a sensitive action, a live secret in the code.

**High** — a logged-in user can reach data or actions they should not: missing permission checks on records, sensitive data in logs or responses.

**Medium** — needs extra conditions to exploit, or the damage is limited: missing input limits, weak configuration, a risky dependency.

**Low** — good practice that is missing but has no clear exploit today.

Label every finding with its severity so the developer can triage quickly.
