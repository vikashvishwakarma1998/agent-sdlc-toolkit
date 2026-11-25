---
description: Write tests for a file or feature — list the cases first, write them in the project's framework and style, run them, and report what passed, what failed and any bugs found. Never weakens a test to make it pass.
---

# Generate tests

A test is a promise about what the code does. A test that only proves the code does what it currently does is not a test — it is a snapshot.

AI-written tests often fall into that trap. They read the implementation, then write tests that mirror it line by line, so they pass even when the behaviour is wrong. This command starts from what the code is supposed to do, writes tests for that, and reports honestly when the code does not live up to it.

## What This Command Does Not Do

It does not change production code. If a test reveals a bug, the bug is reported, not fixed.

It does not change, skip or weaken a test just to make it pass. A failing test that is correct is a useful result.

---

## Step 1 — Understand What Is Being Tested

Write tests for the file or feature given after this command.

Before listing any cases, read:

- The code being tested, and the code that calls it
- The plan in `docs/plans/<feature-name>.md` if one exists — its acceptance criteria are the most important cases to cover
- Existing tests near this code — they show the framework, file naming, folder layout, helpers and style to follow
- `AGENTS.md` and the project's testing rules — for the test command and conventions

Then state what the code promises, in plain terms:

```
What this code promises:
- Given [input or state], it [returns / changes / calls] [result]
- When [something goes wrong], it [throws / returns / reports] [result]
```

If you cannot tell what the code is supposed to do, ask. Do not guess from the implementation.

---

## Step 2 — List the Cases

List the cases to test, grouped:

```
## Test cases — [File or feature]

### Happy path
- [Normal use that should work]

### Invalid input
- [Wrong type, missing field, out-of-range value, malformed data]

### Edge cases
- [Empty, zero, one, maximum, boundaries, duplicates, special characters]

### Errors
- [What happens when a dependency fails — network, database, file system, time-outs]

### Acceptance criteria from the plan
- [Each criterion that this code is responsible for]
```

Only include cases that test real behaviour. Skip trivial cases that add numbers without adding confidence.

---

## Step 3 — Show the List First

Present the list to the developer before writing any tests. Let them add, remove or correct cases. Write tests only after they confirm.

---

## Step 4 — Write the Tests

Use the project's test framework and follow the style of the existing tests.

- Test what the code does, not how it does it — no assertions on private details that could change without the behaviour changing
- One behaviour per test, with a name that says what is expected
- Mock only external things like network calls, time and files — not the code under test
- Keep tests independent and repeatable — no reliance on order, shared state or real time

---

## Step 5 — Run the Tests

Run the new tests using the project's test command. Then run the existing tests around them to make sure nothing else broke.

---

## Step 6 — Handle Failures Honestly

For each failing test, decide which side is wrong:

- **The test is wrong** — it misread what the code is supposed to do. Fix the test, and say what you misread.
- **The code is wrong** — the test describes the correct behaviour and the code does not meet it. Leave the test as it is and report the bug.

If you are not sure which side is wrong, ask. Never change a test just to make it pass.

---

## Step 7 — Report What You Found

```
## Test Report — [File or feature]

### Added
- [Test file]: [N] tests

### Results
- Passed: [N]
- Failed: [N]

### Bugs found
- [file:line] — [what the code does] vs [what it should do], caught by [test name]

### Not covered
- [Any case from the list that could not be tested, and why]
```

If bugs were found, suggest running `/triage-bug` to fix them.
