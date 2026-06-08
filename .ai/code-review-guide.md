---
name: code-review-guide
description: Code review guidelines and process
type: docs
---

# Code Review Guide

## Goal

Code review helps us improve code quality, architecture, readability and maintainability.

Review is not a personal criticism. It is a shared engineering process.

## Review priorities

Review comments should focus on:

1. Correctness
2. Architecture
3. Type safety
4. State ownership
5. Data flow
6. Readability
7. Tests
8. Styling consistency

## Project-specific review rules

### Architecture

The project uses FSD-lite:

- `app` - app setup
- `pages` - route screens
- `entities` - business objects
- `features` - user actions
- `shared` - reusable generic code

Import direction:

```text
app
|
pages
|
features
|
entities
|
shared
```

Lower layers must not import higher layers.

### Shared layer

Put only generic reusable code into `shared`.

Allowed:

- Button
- Input
- Modal
- Card
- Spinner
- formatDate

Not allowed:

- StudentCard
- LessonCard
- HomeworkStatusBadge

Business components belong to `entities`, `features`, or `widgets`.

### Styles

Component styles should be colocated with the component:

```text
StudentCard/
  StudentCard.tsx
  StudentCard.module.css
```

Global styles live in:

```text
src/app/styles/
```

### Tests

Tests should be colocated with the tested code:

```text
getStudentLessons.ts
getStudentLessons.test.ts
```

or:

```text
StudentCard.tsx
StudentCard.test.tsx
```

## Review comment tags

### Blocking by default

A comment without a tag is considered blocking.

Example:

```text
This can crash when student is undefined.
```

### `q` - question

Used when reviewer needs explanation.

Example:

```text
q: Why is lessonsCount stored in state instead of derived from lessons?
```

### `s` - suggestion

Non-blocking improvement.

Example:

```text
s: We can extract this mapping into a helper later.
```

### `praise`

Positive feedback.

Example:

```text
praise: Good separation between StudentList and StudentCard.
```

### `note`

Information or context.

Example:

```text
note: In this project we use CSS Modules instead of Tailwind.
```

### `nit`

Small style issue.

Example:

```text
nit: Maybe rename `data` to `students` for clarity.
```

### `thought`

Idea for future work.

Example:

```text
thought: When this form grows, it can become `features/create-student`.
```

## Reviewer checklist

- Does the code match the spec?
- Is the file placed in the correct layer?
- Are imports allowed by architecture?
- Is state placed at the right level?
- Is derived data not stored unnecessarily?
- Are types strict enough?
- Are names clear?
- Are components small enough?
- Are styles colocated?
- Is there unnecessary abstraction?
- Are tests needed?

## Author checklist

Before requesting review:

- Run the app locally
- Review your own diff
- Remove unused code
- Remove console logs
- Check file structure
- Check naming
- Update docs/specs if behavior changed
