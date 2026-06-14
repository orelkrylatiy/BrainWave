---
name: review
description: Review the current branch's Pull/Merge Request against main and provide constructive feedback with inline comments
trigger: auto
---

# Skill: Branch / MR / PR Review

## Purpose
Review the current branch's Pull Request against `main`: read existing discussion, analyze the full diff window, and produce inline comments for each finding. Offer to publish selected comments back to the PR.

This skill always reviews the PR for the **current git branch**.

## When to Use
User asks to review their changes, for example:
- "Review my changes"
- "Review this PR"
- "Check my MR"
- `/review`
- `/review pr`
- `/review pr <number>` (explicit override)
- `/review pr <url>` (explicit override)

## Execution Mode: IMMEDIATE START
**CRITICAL:** This skill executes IMMEDIATELY upon invocation. Do NOT ask for confirmation. Do NOT say "I understand" or "I'm ready to review". Do NOT list steps and ask "Would you like me to proceed?".

**WRONG (do not output):**
- "I understand the review skill. I'm ready to review your PR when you are."
- "To get started, I'll need to: 1) Check gh CLI, 2) Detect branch, 3) Find PR"
- "Would you like me to proceed with reviewing your current branch's PR now?"

**CORRECT (start immediately):**
1. Run `gh pr view` to detect the PR
2. Read existing discussion
3. Take the diff
4. Output findings table
5. Ask which comments to publish

Skip all preamble. Start with Step 1 immediately.

## Prerequisites
The GitHub CLI must be installed and authenticated:

```bash
gh --version
# If not authenticated, run once:
gh auth login
```

If `gh` is missing or not authenticated, stop and ask the user to install/authenticate. Do not fall back to scraping the GitHub web UI.

## Mode Detection
1. **PR mode (default)** — find the PR associated with the current branch automatically.
2. **Explicit PR override** — if the user passed a number or URL, use it instead of auto-detection.

Always state the mode at the start. The skill always reviews the PR for the current branch.

## Review Process

### Step 1. Locate the PR

```bash
# Current branch
BRANCH=$(git branch --show-current)

# Find the PR for the current branch (returns empty if none)
PR=$(gh pr view --json number --jq .number 2>/dev/null)

# If the user passed an explicit PR number/URL, override:
# PR=<number from user input>
```

If `PR` is empty and the user did not pass an explicit number:
- Tell the user "no PR found for branch `$BRANCH`".
- Suggest pushing the branch and opening a PR, then run `/review` again.
- Stop the review process.

### Step 2. Collect existing discussion (before reading the diff)

Read what has already been said on the PR. This prevents repeating comments and helps you build on the existing review.

```bash
# Title, description, state, base/head, author, labels, linked issues
gh pr view "$PR"

# All conversation: review comments, inline comments, general comments
gh pr view "$PR" --comments

# Existing reviews and their verdicts (APPROVED / CHANGES_REQUESTED / COMMENTED)
gh api "repos/{owner}/{repo}/pulls/$PR/reviews" --jq '.[] | {user: .user.login, state, body: (.body // ""), submitted_at}'

# CI status
gh pr checks "$PR"
```

Notes:
- Read the PR description and any linked issues first — they explain *intent*, which the diff alone won't show.
- Note unresolved threads. If a reviewer already raised a concern, do not raise it again unless adding new substance.

### Step 3. Take the full diff window against `main`

Use the branch's own commits only (everything reachable from `HEAD` but not from `main`). This excludes noise from merges of `main` into the branch.

```bash
# Make sure local main is up to date so the comparison is fair
git fetch origin main:main 2>/dev/null || git fetch origin main

# Commit list — only the branch's own commits
git log --oneline main..HEAD

# Get the latest commit SHA for inline comments
LATEST_COMMIT=$(git rev-parse HEAD)

# Diff window — single combined diff of all branch changes vs main
git diff main...HEAD

# File-by-file stats (size of change per file)
git diff --stat main...HEAD
```

If the diff is very large:
1. First produce a high-level map: list of files and what each file's role is.
2. Then go file by file, starting from the most architecturally significant changes (config, public API, types) before component bodies.

### Step 4. Analyze changes

Walk through the diff against this checklist. **Do not wait for confirmation** — proceed directly to producing findings.

**Architecture (FSD compliance):**
- [ ] Imports follow layer rules (no upward imports)
- [ ] Code is in the correct layer (entities vs features vs widgets)
- [ ] Slices are properly separated
- [ ] `index.ts` exports a clean public API

**Code Quality:**
- [ ] TypeScript types are explicit and correct
- [ ] No `any` without justification
- [ ] Functions are small and focused
- [ ] Component props are well-typed
- [ ] No code duplication

**Testing:**
- [ ] New behavior has tests
- [ ] Tests cover edge cases
- [ ] Tests follow project conventions

**Best Practices:**
- [ ] No `console.log` in production code
- [ ] Proper error handling
- [ ] Meaningful variable/function names
- [ ] Comments explain *why*, not *what*

**Cross-check with existing discussion:**
- [ ] Are previously raised concerns addressed?
- [ ] Am I about to repeat someone else's comment? (if yes — skip or build on it)

### Step 5. Produce findings table

Output all findings in a single table format. **No summary block.**

```markdown
## 🔍 Review Findings

| # | File | Line | Type | Issue |
|---|------|------|------|-------|
| 1 | `vite.config.ts` | 12 | 🚫 blocker | `setupFiles: ''` — empty string |
| 2 | `src/pages/StatisticPage.tsx` | 1 | 🚫 blocker | Import of non-existent file |
| 3 | `src/app/App.tsx` | 10 | 🚫 blocker | Routes point to DashboardPage |
| 4 | `src/shared/ui/ActionCard.tsx` | 8 | 💡 suggestion | Prop `className` is unused |
```

**Type legend:**
- 🚫 `blocker` — must fix before merge (broken code, FSD violation, missing tests, broken imports)
- 💡 `suggestion` — improvements (architecture refinements, naming, optimizations, style)

### Step 6. Offer to publish inline comments

After showing the table, ask the user which comments to publish:

> **Publish inline comments to PR #{N}?**
>
> Select numbers from the table (comma-separated or range):
> - **all** — publish all
> - **blockers** — only blockers (🚫)
> - **none** — do not publish
> - **1,2,5** — specific numbers
> - **1-3** — range

**Do not proceed until user responds.**

### Step 7. Publish selected comments

For each selected finding with a precise line number, publish as an inline comment:

```bash
# Get the latest commit SHA from the PR
COMMIT_SHA=$(gh pr view "$PR" --json commits --jq '.commits[-1].oid')

# Publish inline comment for each selected finding
gh api --method POST /repos/{owner}/{repo}/pulls/$PR/comments --input - <<EOF
{
  "commit_id": "$COMMIT_SHA",
  "path": "path/to/file.ts",
  "line": 45,
  "body": "## 🚫 Blocker — Issue title\n\nDescription with explanation.\n\n**Fix:**\n\`\`\`ts\ncode fix\n\`\`\`"
}
EOF
```

**Important:**
- Use `commit_id` from the latest commit in the PR
- Use `line` as integer (not string)
- Include `path` relative to repo root
- Body should be markdown with clear title, description, and fix suggestion

**Report progress after each comment:**
- ✅ Published: `file.ts:line` — short description
- ❌ Failed: `file.ts:line` — error reason

### Step 8. Final report

After publishing, show a summary:

```markdown
## ✅ Publication Complete

**Published:** N comments
**Skipped:** M comments (no line number / user declined)

### Published comments:
1. ✅ `vite.config.ts:12` — Vitest config broken
2. ✅ `src/app/App.tsx:10` — Routes hardcoded
3. ❌ `src/shared/ui/` — Missing index.ts (no line number)
```

## Tone Guidelines
- **Constructive, not critical** — frame as suggestions, not demands.
- **Explain why** — don't just say "wrong", give reasoning.
- **Prioritize** — architecture > correctness > tests > style.
- **Acknowledge learning** — remember this is a learning project.
- **Respect existing discussion** — don't repeat points already raised.

## Example flow (compressed)

1. User: `/review`
2. Skill detects current branch has PR #3, announces PR mode.
3. Skill reads existing discussion, takes diff.
4. Skill produces findings table immediately (no pre-review summary).
5. User selects: `all` or `blockers` or `1,2,5`.
6. Skill publishes inline comments one by one, reporting progress.
7. Skill shows final publication report.

## Notes
- This is a **learning project** — focus on teaching, not just fixing.
- Point to `AGENTS.md` and `docs/initial_analyze.md` when explaining FSD.
- Encourage the user to fix issues themselves; do not offer to fix automatically.
- Always state the mode at the start.
- **Always reviews PR for current branch** — no local-only mode.
- **No pre-review summary** — go straight to findings table.
- **No automatic publishing** — wait for user selection.
- **Do not stop** — continue from analysis to publication without intermediate confirmations (except the publication selection).
