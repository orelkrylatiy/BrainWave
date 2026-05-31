# Student

**Определение:** Ученик — пользователь системы, привязанный к одному
репетитору. Получает ДЗ и сдаёт ответы на проверку.

## Атрибуты

- `id: string` — уникальный идентификатор
- `email: string` — для логина
- `passwordHash: string` — хэш пароля
- `firstName: string` — имя
- `lastName: string` — фамилия
- `middleName?: string` — отчество (опционально)
- `grade: 10 | 11` — класс
- `examSubject: string` — предмет ЕГЭ (математика, физика и т.д.)
- `contact?: string` — телефон / ник в мессенджере
- `notes?: string` — заметки репетитора об ученике
- `tutorId: string` — FK на [Tutor](./Tutor.md)
- `createdAt: Date` — дата регистрации

## Связи

- → [Tutor](./Tutor.md): **many-to-one** (ученик принадлежит одному репетитору)
- → [Assignment](./Assignment.md): **one-to-many** (у ученика много ДЗ)
- → [Submission](./Submission.md): **one-to-many** (через ДЗ — много ответов)

## Заметки

- В MVP у ученика один репетитор. В будущем при необходимости — many-to-many
  через таблицу-связку.
