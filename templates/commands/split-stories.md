---
description: Split a confirmed feature plan into small, independently shippable stories with acceptance criteria, sizes and dependencies, and check that every acceptance criterion in the plan is covered (no code).
---

# Split into stories

A plan says what to build. Stories say what to build first, and in what pieces.

A good split lets the feature be built, reviewed and shipped one small piece at a time, with each piece working on its own. A bad split produces a list of layers — "build the database", "build the API", "build the UI" — where nothing works until everything is done. This command makes the good kind.

## What This Command Does Not Do

It does not write any code. It does not add scope that is not in the plan, and it does not drop anything that is. If the plan is missing something, it points that out instead of quietly filling the gap.

---

## Step 1 — Read the Plan

Read the feature plan: the file given after this command, or the latest plan in `docs/plans/`. Ignore reset notes (`*-reset.md`) — they are not plans.

From the plan, take note of:

- **Goals and non-goals** — what is in scope and what is deliberately out
- **Decisions made** — they constrain how stories are shaped
- **Acceptance criteria** — every one of them must end up in a story
- **How to build it** — the intended order of work

If there is no plan, stop and suggest running `/plan-feature` first. Do not invent a plan to split.

If the plan has gaps that block a sensible split — for example, an acceptance criterion that contradicts a decision — list them and ask before going further.

---

## Step 2 — Find the Slices

Look for thin vertical slices: pieces that go through every layer needed to deliver one small, visible result.

For each candidate slice, ask:

- Can it be built and reviewed on its own?
- When it is done, does something work that did not work before?
- Is it small enough to finish without stopping halfway?

The first story should be the thinnest slice that works end to end. Everything after it adds to something that already works.

Pure technical stories (setup, migrations, shared infrastructure) are allowed only when a feature story genuinely cannot start without them. Label them clearly as technical.

---

## Step 3 — Write Each Story

```
### [Story number] — [Title]

As a [type of user], I want [capability], so that [benefit].

Acceptance criteria:
- Given [context], When [action], Then [expected result]
- Given [context], When [action], Then [expected result]

Size: [S / M / L]
Depends on: [story numbers, or "none"]
Covers plan criteria: [which acceptance criteria from the plan this story delivers]
```

Write acceptance criteria that can be checked by a test or by a person trying it. "Works well" is not a criterion. "Given an expired link, When the user opens it, Then they see an error and a way to request a new one" is.

---

## Step 4 — Size Each Story

- **S** — one small, well-understood change. A few files, no open questions.
- **M** — a few connected changes, or one change with some unknowns.
- **L** — large or uncertain. Try to split it further. If it cannot be split, say why.

Sizes compare stories with each other. They are not time estimates.

---

## Step 5 — Order and Dependencies

Put the stories in the order they should be built. A story can only depend on stories that come before it.

Keep dependencies to the minimum that is real. If two stories can be built in parallel, do not chain them.

---

## Step 6 — Check Coverage

Before presenting, check the split against the plan:

```
Coverage:
- [Plan acceptance criterion] → Story [number]
- [Plan acceptance criterion] → Story [number]

Not covered: [any plan criterion with no story — must be empty]
Out of scope: [anything in a story that the plan lists as a non-goal — must be empty]
Not in the plan: [anything a story adds that the plan did not ask for — must be empty]
```

Every acceptance criterion in the plan must be covered by a story. If any of the last three lines is not empty, fix the stories or ask the developer.

---

## Step 7 — Present and Save

Present the stories and the coverage check to the developer. Wait for them to confirm or ask for changes.

Once confirmed, save the stories to `docs/stories/<feature-name>.md`, using the same feature name as the plan. Keep them out of `docs/plans/` so the next run of this command does not mistake them for a plan.
