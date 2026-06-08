---
name: pull-request-template
description: Pull request template for merge requests
type: template
---


<!-- ai-pr-description:start -->

## What was done

<!-- Briefly describe the change -->

-

## Why

<!-- Why this change is needed -->

-

## How to check

<!-- Steps for manual verification -->

1.
2.
3.

## Screenshots / Demo

<!-- Add screenshots or short video if UI changed -->

<!-- ai-pr-description:end -->

## Checklist

- [ ] I checked that the app runs locally
- [ ] I reviewed my own diff before requesting review
- [ ] I updated docs/specs if behavior changed
- [ ] I placed files according to the project structure
- [ ] I avoided unnecessary abstractions
- [ ] I did not leave unused code, logs or commented code
- [ ] I added/updated tests if needed

---

<details>
<summary><b>Code Review Principles</b></summary>

> Code review is a collaboration to improve the project, not a competition or personal criticism.

### For reviewer

- Focus on code, not the author.
- Comment only when the comment helps the project.
- Explain why the change is important.
- Prefer questions and suggestions over commands.
- Praise good solutions.
- Mark blocking and non-blocking comments clearly.

### For author

- Treat review as learning.
- Ask questions if something is unclear.
- Reply to comments after changes.
- Explain what was changed.
- Do self-review before requesting review.

</details>

---

<details>
<summary><b>Review comment tags</b></summary>

## Main tags

| Tag    | Meaning                                                       | Blocking? | Example                                            |
| ------ | ------------------------------------------------------------- | --------: | -------------------------------------------------- |
| no tag | Blocking issue. Requires fix or answer.                       |       Yes | "This can break rendering when students is empty." |
| `q`    | Question. Can be resolved by explanation. Resolver: reviewer. |       Yes | "q: Why is this state stored instead of derived?"  |
| `s`    | Suggestion. Author decides whether to apply.                  |        No | "s: This helper can be extracted later."           |

## Additional tags

| Tag       | Meaning                        | Blocking? | Example                                            |
| --------- | ------------------------------ | --------: | -------------------------------------------------- |
| `praise`  | Positive feedback.             |        No | "praise: Nice separation between entity and page." |
| `note`    | Context or useful information. |        No | "note: We use CSS Modules for component styles."   |
| `nit`     | Small style/comment issue.     |        No | "nit: This name can be shorter."                   |
| `thought` | Idea for future iterations.    |        No | "thought: Later this can become a feature slice."  |

</details>
