---
name: agents
description: Instructions for AI assistants working on this project
type: docs
---


## 🎯 Project Goal

**Primary goal:** Help the developer (user) grow to middle/senior frontend level.

**Success metrics:**
- Ability to build complete products end-to-end
- Deep understanding of architecture
- Pass middle-level interviews

**NOT measured by:**
- Number of users
- Market competition
- Revenue

> **Important:** The user writes ALL code themselves. This project is for learning by doing.

---

## 📚 Tech Stack

- **Framework:** React 19.2.5 + TypeScript + Vite
- **Routing:** React Router DOM v7
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint (react-dom, react-hooks, react-refresh plugins)
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged
- **State Management:** (to be added — likely Zustand or React Query)
- **UI:** Custom component library (no external UI kits)

---

## 🏗 Architecture: Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design** methodology. Read full documentation in `docs/initial_analyze.md`.

### Layer Hierarchy (top to bottom)

```
app/          → Initialization, providers, global styles
pages/        → Route-bound page components
widgets/      → Large composite UI blocks
features/     → User actions (create, edit, delete, login, etc.)
entities/     → Business entities (Student, Assignment, Submission, etc.)
shared/       → Reusable UI kit, utilities, API client
```

### Golden Rule of FSD

**A layer can ONLY import from layers BELOW it.**

```
✅ pages → widgets, features, entities, shared
✅ widgets → features, entities, shared
✅ features → entities, shared
✅ entities → shared only
✅ shared → no internal imports (only external libs)

❌ shared ↛ entities
❌ entities ↛ features
❌ features ↛ widgets
```

### Cross-Slice Import Rule

**Slices within the same layer CANNOT import from each other.**

```ts
// ❌ WRONG — entities cross-import
entities/assignment/ui/AssignmentCard.tsx
  import { StudentName } from '@/entities/student';

// ✅ CORRECT — compose at widget level
widgets/AssignmentCard/AssignmentCard.tsx
  import { AssignmentInfo } from '@/entities/assignment';
  import { StudentName } from '@/entities/student';
```

### Public API Rule

**Every slice MUST have `index.ts`. Import ONLY through it.**

```ts
// ✅ Correct
import { StudentCreateForm } from '@/features/student-create';

// ❌ Wrong — reaching into internals
import { StudentCreateForm } from '@/features/student-create/ui/StudentCreateForm/StudentCreateForm';
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── providers/           # QueryProvider, RouterProvider, etc.
│   ├── styles/              # global.css, reset.css
│   ├── App.tsx              # Root component
│   └── routes.tsx           # Route definitions
│
├── pages/
│   ├── DashboardPage/       # Tutor dashboard
│   ├── StudentsPage/        # Student list
│   ├── StudentDetailPage/   # Single student view
│   ├── AssignmentsPage/     # Assignment list
│   ├── AssignmentDetailPage/# Single assignment view
│   ├── LoginPage/
│   ├── SignupPage/
│   ├── InvitePage/          # Student registration by invite
│   └── StatisticPage/
│
├── widgets/
│   ├── NavBar/
│   ├── QuickActionsPanel/
│   ├── DashboardStats/      # Stats overview block
│   ├── UnderReviewList/     # "Needs review" block
│   ├── RecentStudentsList/  # "My students" block
│   ├── StudentDetailCard/
│   └── AssignmentDetailCard/
│
├── features/
│   ├── auth-login/
│   ├── auth-logout/
│   ├── auth-register-tutor/
│   ├── auth-register-student/
│   ├── student-create/
│   ├── student-edit/
│   ├── student-delete/
│   ├── student-invite/
│   ├── assignment-create/
│   ├── assignment-edit/
│   ├── assignment-delete/
│   ├── assignment-change-status/
│   ├── submission-send/
│   └── file-upload/
│
├── entities/
│   ├── user/                # Common user fields (if needed)
│   ├── tutor/               # Tutor entity
│   ├── student/             # Student entity
│   ├── assignment/          # Assignment entity
│   ├── submission/          # Submission entity
│   ├── invite/              # Invite entity
│   └── file/                # File metadata entity
│
└── shared/
    ├── ui/                  # Button, Input, Modal, Card, etc.
    ├── api/                 # Axios client, base types
    ├── lib/                 # Utilities (formatDate, validators)
    ├── hooks/               # Generic hooks (useDebounce, etc.)
    ├── config/              # App config, routes
    ├── types/               # Global TS types
    └── assets/              # Images, icons, fonts
```

---

## 🧪 Testing Strategy

### What to Test

1. **Features (user actions):**
   - Form validation
   - API call triggers
   - Success/error states
   - User feedback (toasts, modals)

2. **Entities (business logic):**
   - Data transformation
   - Type guards
   - API response handling

3. **Shared UI (components):**
   - Props rendering
   - User interactions (click, input)
   - Accessibility (basic)

4. **Widgets (composite blocks):**
   - Integration of features + entities
   - State management
   - Conditional rendering

### What NOT to Test

- Pages (they're just composition)
- Implementation details (test behavior, not internals)
- Third-party libraries

### Test File Naming

```
*.test.ts — Unit tests
*.test.tsx — Component tests
```

Place tests **next to the tested file** or in `__tests__/` folder within the slice.

---

## 📝 Development Workflow

### 1. Before Writing Code

- Identify which **entity** or **feature** you're building
- Check if similar functionality already exists
- Plan the slice structure (api/, model/, ui/)

### 2. Implementation Order

For a new feature (e.g., "Create Student"):

```
1. entities/student/model/types.ts       ← Define Student type
2. entities/student/api/useStudents.ts   ← API query hook
3. entities/student/ui/StudentCard.tsx   ← Display component
4. features/student-create/api/          ← POST endpoint
5. features/student-create/ui/Form.tsx   ← Create form
6. widgets/StudentList/                  ← Compose entity + feature
7. pages/StudentsPage/                   ← Add to route
```

### 3. Git Workflow

- Branch naming: `KAN-{number}-{short-description}` (e.g., `KAN-6-add-student-crud`)
- Commits: conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)
- One feature per branch
- Run tests + lint before commit

```bash
npm run test
npm run lint
npm run format:check
git add .
git commit -m "feat: add student create form"
```

---

## 🎓 Learning Guidelines

### How to Use This Project for Growth

1. **Write code yourself first** — don't ask AI to generate complete solutions
2. **Ask for explanations, not code** — "How does React Query work?" not "Write the hook"
3. **Understand the why** — why FSD, why this pattern, why this structure
4. **Refactor iteratively** — first make it work, then make it right
5. **Test what matters** — focus on user-facing behavior

### When to Ask for Help

- Architecture decisions ("Should this be a feature or widget?")
- Understanding patterns ("How do I structure an API slice?")
- Debugging complex issues
- Code review ("Is this the FSD-correct way?")

### When NOT to Ask for Help

- Simple syntax errors (read the error message first)
- Basic React/TS concepts (try documentation first)
- Copy-pasting entire components (build them yourself)

---

## 📋 Current Status

### Completed

- ✅ Project setup (Vite + React + TS)
- ✅ ESLint + Prettier + Husky configured
- ✅ Testing setup (Vitest + RTL)
- ✅ Basic FSD structure created
- ✅ Navigation bar implemented
- ✅ Dashboard page skeleton
- ✅ Statistics page skeleton

### In Progress

- 🔄 Implementing core entities (Student, Assignment, Submission)
- 🔄 Building shared UI component library

### Next Steps (MVP)

1. **Authentication flow**
   - Tutor registration/login
   - Student registration by invite
   - Session management

2. **Student management**
   - Create/Edit/Delete student
   - Student list view
   - Student detail card

3. **Assignment management**
   - Create/Edit/Delete assignment
   - Assignment list with filters
   - Assignment detail with submission

4. **Dashboard**
   - Stats overview (total, in-progress, completed)
   - "Needs review" list
   - Recent students list

---

## 🔗 Resources

- [Docs Index](docs/README.md) — Start here
- [FSD Full Guide](docs/architecture/fsd.md) — Read Parts 1-8
- [User Stories](docs/discovery/03-user-stories.md) — MVP scope
- [Glossary](docs/discovery/05-glossary.md) — Domain entities
- [Figma Design](https://www.figma.com/design/amTy3clwPcjbv0AU3KtMmJ/Brainwave-Lite-platform) — UI reference

---

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Production build
npm run preview          # Preview production build

# Quality
npm run lint             # ESLint check
npm run format:check     # Prettier check
npm run format           # Prettier fix

# Testing
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## 💡 Key Principles

1. **User writes all code** — AI explains, guides, reviews
2. **FSD is non-negotiable** — follow the layer rules strictly
3. **Tests are mandatory** — no feature without tests
4. **Types first** — define types before implementation
5. **Small iterations** — commit often, learn from each step

---

**Remember:** This is YOUR growth journey. Every line of code you write yourself is an investment in your future as a developer.
