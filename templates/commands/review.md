---
description: Review the current changes (read-only)
---

# Code review

Review the current changes (`git diff` against the main branch, plus uncommitted changes).

Check for:

- Bugs and missing edge cases
- Missing error handling or input validation
- Missing or weak tests
- Code that is hard to read
- Breaking changes

For each problem write the `file:line`, why it matters, and how to fix it.
Group them as **Must fix**, **Should fix** and **Nice to have**.

Do not edit any files.
