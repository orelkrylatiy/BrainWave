---
name: checkin
description: Review the current branch's Pull Request against main and provide constructive feedback. Triggered only on explicit user request.
type: skill
---

# Skill: Branch / PR Review

## Purpose
Review the current branch's Pull Request against `main`: read existing discussion, analyze the full diff window file by file, and produce a structured review. After the review is shown, offer to publish it back to the PR.

## Activation
This skill runs **only when the user explicitly invokes it**. Valid triggers:

- `/review`
- `/review pr`
- `/review pr <number>`
- `/review pr <url>`
- Direct phrases: "review my changes", "review this PR", "check my MR"

Do **not** auto-activate this skill from other actions (committing, pushing, opening files, reading code, finishing a task). If you are unsure whether the user invoked it, do nothing.

## Prerequisites
GitHub CLI must be installed and authenticated:

```bash
gh --version
# If not authenticated, run once:
gh auth login
```

If `gh` is missing or not authenticated, stop and tell the user. Do not scrape the GitHub web UI.

## Mode Detection
1. **PR mode (default)** — find the PR for the current branch automatically.
2. **Explicit PR override** — if the user passed a number or URL, use it.
3. **Local-only fallback** — only if no PR exists. Continue without `gh` commands, using only `git` against `main`.

State the chosen mode in the final output, but do not ask the user to confirm it.

## Review Process

The skill runs end-to-end without intermediate questions. It produces one final report that contains:

1. Summary block
2. File-by-file walkthrough
3. Aggregated findings
4. Publish offer (the only question, at the very end)

### Step 1. Locate the PR

```bash
BRANCH=$(git branch --show-current)
PR=$(gh pr view --json number --jq .number 2>/dev/null || echo "")
# If user passed an explicit number/URL, set PR from that input.
```

If `PR` is empty and no explicit override, switch to local-only mode silently.

### Step 2. Collect existing discussion (PR mode only)

```bash
gh pr view "$PR"
gh pr view "$PR" --comments
gh api "repos/{owner}/{repo}/pulls/$PR/reviews" --jq '.[] | {user: .user.login, state, body: (.body // ""), submitted_at}'
gh pr checks "$PR"
```

Use this to avoid repeating concerns that were already raised.

### Step 3. Take the full diff window against `main`

```bash
git fetch origin main:main 2>/dev/null || git fetch origin main

# Commit list — branch commits only
git log --oneline main..HEAD

# Per-file stats
git diff --stat main...HEAD

# Full diff window (used for analysis, not printed verbatim)
git diff main...HEAD
```

### Step 4. File-by-file walkthrough

Iterate over each changed file. For every file:

1. Read the file's role from its path (entity / feature / widget / page / shared / config / docs).
2. Read the **per-file diff**:
   ```bash
   git diff main...HEAD -- "<path>"
   ```
3. Apply the review checklist (see Step 5).
4. Collect findings keyed by `file:line` where applicable.

Order of traversal:
1. Config and tooling (`vite.config`, `tsconfig`, `eslint`, `package.json`)
2. Public APIs and types (`*/index.ts`, `*.types.ts`)
3. Shared layer
4. Entities
5. Features
6. Widgets
7. Pages
8. App-level (routing, providers)
9. Tests
10. Docs

This order surfaces architectural issues before stylistic ones.

### Step 5. Checklist applied per file

**Architecture (FSD):**
- Imports respect layer direction (no upward imports)
- File is in the correct layer
- Slices are properly separated
- `index.ts` exposes a clean public API

**Code quality:**
- Explicit, correct TypeScript types
- No unjustified `any`
- Small, focused functions
- Well-typed component props
- No duplication

**Testing:**
- New behavior has tests
- Edge cases covered
- Tests follow project conventions

**Best practices:**
- No `console.log` in production code
- Proper error handling
- Meaningful names
- Comments explain *why*

**Cross-check against existing discussion:**
- Skip points already raised in PR comments unless adding new substance

### Step 6. Produce the final report

Output the review in two parts:

**Part A — Summary block:**

```markdown
## Review

**Mode:** `pr` | `local`
**Branch:** `{branch}` → `main`
**PR:** `#{number}` — *{title}* *(PR mode only)*
**Commits:** {N} | **Files changed:** {N}

### What this PR does
{1–3 sentence plain-language summary}

---

### ✅ Good things
- ...

### 🚫 Blockers (must fix before merge)
- `file.ts:line` — issue description
- ...

### 💡 Suggestions (nice to have)
- `file.ts:line` — issue description
- ...
```

**Part B — Line-level comments** (for inline publication):

For each finding, categorize as **blocker** or **suggestion**:

```
FILE: path/to/file.ts
LINE: 45
TYPE: blocker | suggestion
COMMENT: |
  Issue description with explanation and suggested fix.
```

**Categories:**
- `blocker` — must fix before merge (broken code, FSD violation, missing tests, broken imports)
- `suggestion` — improvements (architecture refinements, naming, optimizations, style)

### Step 7. Offer to publish (PR mode only, the only question)

After the report is printed, ask exactly once:

> Опубликовать ревью в PR #{N}?
>
> 1. **Только summary** — один комментарий с обзором и списком блокеров/предложений (рекомендуется по умолчанию)
> 2. **Summary + построчные комментарии** — summary плюс inline-комментарии к конкретным строкам для блокеров
> 3. **Только построчные комментарии** — inline-комментарии к строкам, без summary
> 4. **Request changes** — формальная блокировка PR (требует исправлений)
> 5. **Approve** — только если всё чисто и пользователь явно подтвердил
> 6. **Не публиковать** — оставить локально

Commands:

```bash
# Save summary to temp file
SUMMARY_FILE=$(mktemp)
# (write the summary markdown into $SUMMARY_FILE)

# 1. Summary only
gh pr comment "$PR" --body-file "$SUMMARY_FILE"

# 2. Summary + line-level comments (for blockers)
gh pr comment "$PR" --body-file "$SUMMARY_FILE"
# Then for each blocker:
gh pr comment "$PR" --body "comment text" --path "file.ts" --line 45

# 3. Line-level comments only (blockers)
# For each blocker:
gh pr comment "$PR" --body "comment text" --path "file.ts" --line 45

# 4. Request changes (formal)
gh pr review "$PR" --request-changes --body-file "$SUMMARY_FILE"

# 5. Approve (formal)
gh pr review "$PR" --approve --body-file "$SUMMARY_FILE"
```

Safety rules:
- Default is **Только summary**.
- Never `--approve` or `--request-changes` without an explicit per-action confirmation.
- Show the exact command before running it.
- For line-level comments, group by file to minimize API calls.
- Skip line-level comments for findings without precise line numbers.
- In local-only mode, skip Step 7 entirely.

## Tone Guidelines
- Constructive, not critical
- Explain *why*, not just *what*
- Prioritize: architecture > correctness > tests > style
- Acknowledge this is a learning project
- Don't repeat existing discussion

## Notes
- **Only run on explicit invocation.** No background or auto-triggered runs.
- **No intermediate questions.** Produce the full review in one pass.
- **One question at the end** — only to choose publish action, and only in PR mode.
- Point to `AGENTS.md` and `docs/initial_analyze.md` when explaining FSD.
- Encourage the user to fix issues themselves; do not auto-fix.