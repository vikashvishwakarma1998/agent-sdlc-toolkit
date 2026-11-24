---
description: Security review of the current changes (read-only)
---

# Security review

Review the current changes for security problems:

- Injection (SQL, shell commands, file paths)
- Missing login or permission checks
- Secrets in code or logs
- Unsafe handling of user input
- Risky new dependencies

For each problem write the `file:line`, what could go wrong, and how to fix it.

Do not edit any files.
