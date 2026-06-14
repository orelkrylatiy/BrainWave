---
name: BrainWave
description: Tutor-help platform built with React + TypeScript + Vite
type: project
---

# _BrainWave_

### **Tutor-help platform**

##### React + TypeScript + Vite

Архитектура:

---

# 📚 Feature-Sliced Design — полный разбор

## 🎯 Часть 1: Зачем вообще это

### Проблема, которую FSD решает

Когда проект растёт, появляется **хаос в импортах** и **дублирование кода**. Типичные симптомы:

```
❌ Симптом 1: Циклические зависимости
   components/StudentCard → импортирует hooks/useStudent
   hooks/useStudent → импортирует components/StudentCard
   → Webpack ругается, бесконечная рекурсия

❌ Симптом 2: Каша в папке components
   components/
   ├── Button.tsx
   ├── StudentCard.tsx          ← бизнес-сущность
   ├── DashboardHeader.tsx      ← страничный компонент
   ├── LoginForm.tsx            ← фича
   ├── Modal.tsx                ← UI-кит
   └── ... (ещё 80 файлов)

   → Не понятно что переиспользуемо, что нет

❌ Симптом 3: Дублирование
   - В двух местах разный StudentCard
   - В трёх местах useFetch с разной логикой
   - Никто не знает что уже сделано
```

### Что предлагает FSD

**Жёсткие правила:**

1. Чёткая **иерархия слоёв** — что от чего может зависеть
2. **Группировка по бизнес-смыслу**, не по техническому типу
3. **Публичные API** — каждый модуль экспортирует только то, что нужно

Результат: **невозможно** написать кашу. Структура **сама** заставляет писать правильно.

---

## 🏛 Часть 2: Главная концепция — слои

FSD делит код на **6 слоёв**, расположенных в строгой иерархии:

```
┌──────────────────────────────────┐
│  app          инициализация      │  ← самый верх
├──────────────────────────────────┤
│  pages        страницы           │
├──────────────────────────────────┤
│  widgets      крупные блоки UI   │
├──────────────────────────────────┤
│  features     действия юзера     │
├──────────────────────────────────┤
│  entities     бизнес-сущности    │
├──────────────────────────────────┤
│  shared       переиспользуемое   │  ← самый низ
└──────────────────────────────────┘
```

### 🔒 Главное правило FSD

> **Слой может импортировать только из слоёв ниже.**

```
✅ pages импортирует widgets, features, entities, shared
✅ widgets импортирует features, entities, shared
✅ features импортирует entities, shared
✅ entities импортирует только shared
✅ shared не импортирует из других слоёв (только внешние библиотеки)

❌ shared НЕ импортирует entities
❌ entities НЕ импортирует features
❌ features НЕ импортирует widgets
```

**Это создаёт направленный граф зависимостей.** Циклов быть не может — структурно невозможно.

---

## 📦 Часть 3: Каждый слой подробно

### 1. `shared/` — переиспользуемое (низ)

**Что лежит:**

- UI-кит (Button, Input, Modal, Card)
- Утилиты (formatDate, formatCurrency)
- Хуки общего назначения (useDebounce, useLocalStorage)
- API-клиент (axios instance, базовый fetch)
- Конфиги, константы, типы

**Что НЕ лежит:**

- Ничего, специфичного для бизнеса (нет упоминаний «Student», «Assignment»)
- Никаких компонентов с бизнес-логикой

**Структура:**

```
shared/
├── ui/                    ← UI-кит
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── ...
├── lib/                   ← утилиты
│   ├── formatDate.ts
│   └── debounce.ts
├── hooks/                 ← общие хуки
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── api/                   ← API-инфраструктура
│   ├── client.ts          ← axios instance
│   └── types.ts           ← общие типы (Pagination, ApiError)
├── config/                ← конфиги
│   └── routes.ts
└── types/                 ← общие TS-типы
```

**Тест: «можно ли вынести в библиотеку и опубликовать?»**

- Да → это shared
- Нет (есть бизнес-смысл) → это не shared

---

### 2. `entities/` — бизнес-сущности

**Что такое entity:** реальный объект из предметной области.

В нашем проекте entities = **сущности из БД**:

- `user` (пользователь)
- `student` (ученик)
- `assignment` (ДЗ)
- `submission` (ответ на ДЗ)
- `tutor` (репетитор)

**Что лежит в каждой entity:**

- TypeScript-типы
- API-запросы для **чтения** этой сущности
- React-хуки для получения данных
- «Глупые» компоненты, отображающие сущность (StudentCard, AssignmentCard)
- Zustand-store, если нужен

**Что НЕ лежит:**

- Действия пользователя (создать, редактировать, удалить) — это **features**
- Логика конкретных страниц

**Структура:**

```
entities/
└── student/
    ├── api/                       ← запросы
    │   ├── getStudents.ts
    │   ├── getStudentById.ts
    │   └── useStudents.ts         ← хук React Query
    ├── model/                     ← типы и состояние
    │   ├── types.ts               ← type Student = {...}
    │   └── store.ts               ← Zustand (если нужен)
    ├── ui/                        ← глупые компоненты
    │   ├── StudentCard/
    │   └── StudentAvatar/
    └── index.ts                   ← публичный API
```

**Принцип:** entity знает **«что есть Student и как его прочитать»**, но **не знает** «как его создать/изменить/удалить».

**Аналогия:** entity — это **существительное**. «Ученик», «Заказ», «Товар».

---

### 3. `features/` — действия пользователя

**Что такое feature:** конкретное **действие**, которое юзер может совершить.

В нашем проекте features:

- `student-create` (создать ученика)
- `student-edit` (редактировать)
- `student-delete` (удалить)
- `student-invite` (сгенерировать ссылку приглашения)
- `assignment-create`
- `assignment-change-status`
- `auth-login`
- `auth-logout`
- `submission-send`

**Что лежит:**

- Форма создания/редактирования
- Кнопка «Удалить» с подтверждением
- API-запросы для **изменений** (POST/PATCH/DELETE)
- Логика валидации
- Тосты и нотификации

**Структура:**

```
features/
└── student-create/
    ├── api/
    │   └── createStudent.ts        ← POST /api/students
    ├── model/
    │   └── schema.ts               ← Zod-схема валидации
    ├── ui/
    │   └── StudentCreateForm/
    │       ├── StudentCreateForm.tsx
    │       └── StudentCreateForm.module.css
    └── index.ts
```

**Принцип:** feature — это **глагол**. «Создать», «Удалить», «Войти».

**Главное отличие от entity:**

- Entity = чтение, отображение
- Feature = действие, изменение

---

### 4. `widgets/` — крупные блоки UI

**Что такое widget:** большой композитный блок, объединяющий несколько entities/features.

Примеры widgets:

- `Header` (логотип + меню + аватар + logout)
- `Sidebar` (навигация по разделам)
- `StudentDetailCard` (карточка с инфо + кнопки edit/delete + список ДЗ)
- `AssignmentList` (список ДЗ с фильтрами + пагинация)

**Что лежит:**

- Композиция entities + features в осмысленный блок
- Иногда — собственная логика блока (фильтры, локальный стейт)

**Структура:**

```
widgets/
└── StudentDetailCard/
    ├── ui/
    │   ├── StudentDetailCard.tsx
    │   └── StudentDetailCard.module.css
    └── index.ts
```

Внутри `StudentDetailCard`:

```tsx
import { useStudent } from '@/entities/student'; // entity
import { StudentEditButton } from '@/features/student-edit'; // feature
import { StudentDeleteButton } from '@/features/student-delete'; // feature
import { StudentInviteButton } from '@/features/student-invite'; // feature
import { Card } from '@/shared/ui'; // shared

export function StudentDetailCard({ studentId }) {
  const { data: student } = useStudent(studentId);

  return (
    <Card>
      <h2>
        {student.firstName} {student.lastName}
      </h2>
      <p>Класс: {student.class}</p>
      <div>
        <StudentEditButton studentId={studentId} />
        <StudentDeleteButton studentId={studentId} />
        <StudentInviteButton studentId={studentId} />
      </div>
    </Card>
  );
}
```

**Принцип:** widget — **самодостаточный блок**, который можно вставить в любую страницу.

---

### 5. `pages/` — страницы

**Что лежит:** компоненты-страницы, привязанные к роутам.

**Принцип:** страницы **тонкие**. Они только **композируют** widgets, features, entities.

```
pages/
├── DashboardPage/
│   └── DashboardPage.tsx
├── StudentsPage/
│   └── StudentsPage.tsx
└── StudentDetailPage/
    └── StudentDetailPage.tsx
```

Содержимое страницы:

```tsx
// pages/StudentDetailPage/StudentDetailPage.tsx
import { useParams } from 'react-router-dom';
import { StudentDetailCard } from '@/widgets/StudentDetailCard';
import { StudentAssignmentsList } from '@/widgets/StudentAssignmentsList';

export function StudentDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <StudentDetailCard studentId={id} />
      <StudentAssignmentsList studentId={id} />
    </div>
  );
}
```

**Никакой логики на странице.** Только сборка из готовых блоков.

---

### 6. `app/` — инициализация (верх)

**Что лежит:**

- Корневой компонент `App.tsx`
- Провайдеры (QueryClient, Router, Theme)
- Глобальные стили
- Конфигурация роутера

**Структура:**

```
app/
├── providers/
│   ├── QueryProvider.tsx
│   ├── RouterProvider.tsx
│   └── index.tsx
├── styles/
│   ├── global.css
│   └── reset.css
├── App.tsx
└── routes.tsx
```

**Принцип:** app — это «склейка» всего проекта. Импортирует всё, ничего не экспортирует.

---

## 🔪 Часть 4: Слайсы (slices) и сегменты (segments)

Внутри слоя есть **слайсы** — конкретные модули.

```
features/                    ← слой
├── student-create/          ← слайс
├── student-delete/          ← слайс
└── auth-login/              ← слайс
```

```
entities/                    ← слой
├── student/                 ← слайс
├── assignment/              ← слайс
└── user/                    ← слайс
```

Внутри слайса — **сегменты** (стандартные имена):

- `ui/` — компоненты
- `model/` — стейт, типы, бизнес-логика
- `api/` — запросы к API
- `lib/` — утилиты слайса
- `config/` — конфиги слайса

```
features/student-create/     ← слайс
├── ui/                      ← сегмент
├── model/                   ← сегмент
├── api/                     ← сегмент
└── index.ts                 ← публичный API слайса
```

**Сегменты опциональны.** Используешь только те, что нужны.

---

## 🚪 Часть 5: Публичные API (index.ts)

**Жёсткое правило:** каждый слайс **обязан** иметь `index.ts`. Импорты идут **только через него**.

```ts
// features/student-create/index.ts
export { StudentCreateForm } from './ui/StudentCreateForm';
export { useCreateStudent } from './api/useCreateStudent';
// types экспортируются по необходимости
```

### Как импортировать

```tsx
// ✅ Правильно
import { StudentCreateForm } from '@/features/student-create';

// ❌ Неправильно — лезть во внутренности слайса
import { StudentCreateForm } from '@/features/student-create/ui/StudentCreateForm/StudentCreateForm';
```

**Зачем:** изменения внутри слайса **не ломают** импорты в других местах. Можешь переименовать файл, перенести компонент — внешний код не сломается.

---

## ⚠️ Часть 6: Главное правило импортов (детально)

### Cross-import между слайсами одного слоя — ЗАПРЕЩЁН

```ts
// ❌ ЗАПРЕЩЕНО
// entities/assignment/ui/AssignmentCard.tsx
import { StudentName } from '@/entities/student';
```

**Почему:** entities должны быть **независимы** друг от друга. Если assignment зависит от student — это **связанность**, которую FSD пытается избежать.

### Как правильно решать

**Вариант 1: Поднять композицию выше — в widget или page**

```tsx
// widgets/AssignmentCard/AssignmentCard.tsx
import { AssignmentInfo } from '@/entities/assignment';
import { StudentName } from '@/entities/student';

export function AssignmentCard({ assignmentId, studentId }) {
  return (
    <div>
      <AssignmentInfo assignmentId={assignmentId} />
      <StudentName studentId={studentId} />
    </div>
  );
}
```

**Вариант 2: Передать данные пропсами**

```tsx
// entities/assignment/ui/AssignmentCard.tsx
type Props = {
  assignment: Assignment;
  studentName?: string; // принимаем извне
};

export function AssignmentCard({ assignment, studentName }) {
  return (
    <div>
      <h3>{assignment.title}</h3>
      {studentName && <p>{studentName}</p>}
    </div>
  );
}
```

**Вариант 3: @x notation (если cross-import неизбежен)**

FSD-сообщество ввело особый синтаксис для допустимых cross-imports:

```ts
// entities/assignment/@x/student.ts
// Этот файл декларирует, что assignment МОЖЕТ зависеть от student
```

Но это **продвинутое**, для пет-проекта избегай.

---

## 🎯 Часть 7: FSD на нашем проекте

Полная картина:

```
src/
├── app/
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── index.tsx
│   ├── styles/
│   │   ├── global.css
│   │   └── reset.css
│   ├── App.tsx
│   └── routes.tsx
│
├── pages/
│   ├── LoginPage/
│   ├── SignupPage/
│   ├── InvitePage/
│   ├── DashboardPage/                ← Tutor dashboard
│   ├── StudentDashboardPage/         ← Student dashboard
│   ├── StudentsPage/
│   ├── StudentDetailPage/
│   ├── AssignmentsPage/
│   ├── AssignmentDetailPage/
│   └── ProfilePage/
│
├── widgets/
│   ├── Header/
│   ├── Sidebar/
│   ├── DashboardStats/               ← блок «3 счётчика»
│   ├── UnderReviewList/              ← блок «На проверке»
│   ├── RecentStudentsList/           ← блок «Мои ученики»
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
│   ├── user/                         ← + tutor/student profile
│   │   ├── api/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   ├── student/
│   ├── assignment/
│   ├── submission/
│   └── file/
│
└── shared/
    ├── ui/                           ← Button, Input, Modal, Card
    ├── api/                          ← axios client
    ├── lib/                          ← formatDate, validators
    ├── hooks/
    └── config/
```

---

## 📋 Часть 8: Полный пример работы

Реализуем фичу: **«Tutor добавляет ученика на дашборде»**.

### 1. shared — базовые блоки

```tsx
// shared/ui/Button/Button.tsx
export function Button({ children, ...props }) {
  return <button className={styles.btn} {...props}>{children}</button>;
}

// shared/ui/Modal/Modal.tsx
export function Modal({ open, onClose, children }) { ... }

// shared/api/client.ts
export const apiClient = axios.create({ baseURL: '/api' });
```

### 2. entities/student — модель ученика

```tsx
// entities/student/model/types.ts
export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  class: number | null;
  subject: string;
};

// entities/student/api/useStudents.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { Student } from '../model/types';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Student[] }>('/students');
      return data.data;
    },
  });
}

// entities/student/ui/StudentCard/StudentCard.tsx
import { Card } from '@/shared/ui';

export function StudentCard({ student }) {
  return (
    <Card>
      <h3>
        {student.firstName} {student.lastName}
      </h3>
      <p>Класс: {student.class}</p>
    </Card>
  );
}

// entities/student/index.ts
export { useStudents } from './api/useStudents';
export { StudentCard } from './ui/StudentCard';
export type { Student } from './model/types';
```

### 3. features/student-create — действие

```tsx
// features/student-create/api/useCreateStudent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await apiClient.post('/students', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// features/student-create/ui/StudentCreateForm/StudentCreateForm.tsx
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/shared/ui';
import { useCreateStudent } from '../../api/useCreateStudent';

export function StudentCreateForm({ onSuccess }) {
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useCreateStudent();

  const onSubmit = (data) => mutate(data, { onSuccess });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('firstName')} placeholder="Имя" />
      <Input {...register('lastName')} placeholder="Фамилия" />
      <Button type="submit" disabled={isPending}>
        Создать
      </Button>
    </form>
  );
}

// features/student-create/index.ts
export { StudentCreateForm } from './ui/StudentCreateForm';
```

### 4. widget — композиция

```tsx
// widgets/RecentStudentsList/RecentStudentsList.tsx
import { useState } from 'react';
import { useStudents, StudentCard } from '@/entities/student';
import { StudentCreateForm } from '@/features/student-create';
import { Button, Modal } from '@/shared/ui';

export function RecentStudentsList() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: students, isLoading } = useStudents();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Мои ученики</h2>
      <Button onClick={() => setModalOpen(true)}>+ Добавить</Button>

      {students.slice(0, 5).map((s) => (
        <StudentCard key={s.id} student={s} />
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <StudentCreateForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
```

### 5. page — финальная сборка

```tsx
// pages/DashboardPage/DashboardPage.tsx
import { DashboardStats } from '@/widgets/DashboardStats';
import { UnderReviewList } from '@/widgets/UnderReviewList';
import { RecentStudentsList } from '@/widgets/RecentStudentsList';

export function DashboardPage() {
  return (
    <div>
      <DashboardStats />
      <UnderReviewList />
      <RecentStudentsList />
    </div>
  );
}
```

**Видишь иерархию?**

- shared — атомы (Button, Modal)
- entities — отображение данных (StudentCard)
- features — действия (StudentCreateForm)
- widgets — композиция в блок (RecentStudentsList)
- pages — собирает блоки в страницу (DashboardPage)

Каждый слой **строго над** предыдущим.

---
