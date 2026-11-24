---
description: Write release notes into CHANGELOG.md
---

# Release notes

1. Read the commits since the last tag: `git log $(git describe --tags --abbrev=0)..HEAD --oneline`.
2. Group them into **Features**, **Fixes** and **Breaking changes**.
3. Add a new section at the top of `CHANGELOG.md`.

Only edit `CHANGELOG.md`.
