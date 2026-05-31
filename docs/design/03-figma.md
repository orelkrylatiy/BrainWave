## 🎨 Имена для всех экранов

https://www.figma.com/design/amTy3clwPcjbv0AU3KtMmJ/Brainwave-Lite-platform?node-id=1480-0&t=DHziHiA1NQIYPpew-1

### Public (без логина)

| URL                | Figma frame name           |
| ------------------ | -------------------------- |
| `/` (лендинг)      | `Public / Landing`         |
| `/login`           | `Public / Login`           |
| `/signup`          | `Public / Signup`          |
| `/invite/:token`   | `Public / Invite Signup`   |
| `/forgot-password` | `Public / Forgot Password` |
| `*`                | `Public / 404`             |

### Tutor (репетитор)

| URL                             | Figma frame name            |
| ------------------------------- | --------------------------- |
| `/` (dashboard)                 | `Tutor / Dashboard`         |
| `/students`                     | `Tutor / Students List`     |
| `/students/new`                 | `Tutor / Student Create`    |
| `/students/:id`                 | `Tutor / Student Detail`    |
| `/students/:id/edit`            | `Tutor / Student Edit`      |
| `/students/:id/assignments/new` | `Tutor / Assignment Create` |
| `/assignments/:id`              | `Tutor / Assignment Detail` |
| `/assignments/:id/edit`         | `Tutor / Assignment Edit`   |
| `/profile`                      | `Tutor / Profile`           |
| `/profile/edit`                 | `Tutor / Profile Edit`      |

### Student (ученик)

| URL                | Figma frame name              |
| ------------------ | ----------------------------- |
| `/` (dashboard)    | `Student / Dashboard`         |
| `/assignments`     | `Student / Assignments List`  |
| `/assignments/:id` | `Student / Assignment Detail` |
| `/profile`         | `Student / Profile`           |
| `/profile/edit`    | `Student / Profile Edit`      |

---

## 🎯 Полезные дополнительные фреймы (состояния)

В реальном дизайне один экран может иметь **несколько состояний**. Их имеет смысл рисовать отдельными фреймами рядом, не перерисовывая весь экран.

```
Tutor / Dashboard / Empty           ← когда нет учеников
Tutor / Dashboard / Filled          ← основное состояние

Tutor / Students List / Empty       ← нет учеников
Tutor / Students List / Filled

Tutor / Student Detail / No Assignments    ← ученик есть, ДЗ нет
Tutor / Student Detail / With Assignments

Tutor / Assignment Detail / In Progress    ← ДЗ выдано, ответа нет
Tutor / Assignment Detail / Under Review   ← ученик сдал, надо проверить
Tutor / Assignment Detail / Done           ← проверено

Student / Dashboard / Empty
Student / Dashboard / Filled

Student / Assignment Detail / In Progress  ← форма отправки активна
Student / Assignment Detail / Under Review ← ответ отправлен, ждём
Student / Assignment Detail / Done         ← принято
```
