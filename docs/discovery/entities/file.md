# File

**Определение:** Метаданные прикреплённого файла. Сам файл хранится во
внешнем файловом хранилище (S3 / Supabase Storage / диск сервера).
В БД хранится только информация о нём и ссылка.

## Атрибуты

- `id: string` — уникальный идентификатор
- `fileName: string` — оригинальное имя файла (`решение.pdf`)
- `fileSize: number` — размер в байтах
- `mimeType: string` — тип файла (`application/pdf`, `image/jpeg`)
- `url: string` — ссылка на файл в хранилище
- `assignmentId?: string` — FK на [Assignment](./Assignment.md) (если файл — материал к ДЗ)
- `submissionId?: string` — FK на [Submission](./Submission.md) (если файл — часть ответа)
- `uploadedById: string` — id того, кто загрузил (Tutor или Student)
- `uploadedByRole: 'tutor' | 'student'` — роль того, кто загрузил
- `createdAt: Date` — дата загрузки

## Связи

- → [Assignment](./Assignment.md): **many-to-one** (опционально, если файл — материал к ДЗ)
- → [Submission](./Submission.md): **many-to-one** (опционально, если файл — часть ответа)

## Заметки

- Один File привязан **либо** к Assignment, **либо** к Submission, не к обоим.
- На уровне БД это можно реализовать как два nullable FK + check constraint,
  либо разнести на две таблицы (`assignment_files`, `submission_files`).
  Решение по реализации — на этапе схемы БД.
- Решить позже: ограничения на размер и тип файла.
