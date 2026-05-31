# API Design

Документ описывает HTTP API приложения BrainWave: endpoints, форматы запросов/ответов, права доступа, ошибки и базовые TypeScript-типы для фронтенда.

---

## 1. Назначение документа

Этот файл нужен как закрытый технический артефакт проекта. К нему будем возвращаться при реализации фронтенда и бэка.

Документ отвечает на вопросы:

- какие backend endpoints нужны приложению;
- какие данные принимает каждый endpoint;
- какие данные возвращает каждый endpoint;
- какие endpoints публичные, а какие требуют авторизации;
- какие бизнес-правила нужно проверить на бэке;
- какие TypeScript-типы можно завести на фронтенде.

Документ пока не фиксирует финальную внутреннюю механику авторизации: конкретную библиотеку, хранение сессий, refresh tokens и детали безопасности. Это будет уточняться на этапе реализации бэка.

---

## 2. Общие соглашения

### 2.1 Базовый URL

Все endpoints находятся под префиксом `/api`.

Пример локального URL:

```text
http://localhost:3000/api/students
```

---

### 2.2 Формат данных

По умолчанию все запросы и ответы используют JSON:

```http
Content-Type: application/json
```

Исключение: загрузка файлов через `POST /api/files` использует `multipart/form-data`.

Кодировка: UTF-8.

---

### 2.3 Даты

Все даты на бэке хранятся и отдаются в UTC.

Формат дат: ISO 8601.

Пример:

```text
2024-03-15T14:30:00.000Z
```

Локализация даты и времени выполняется на фронтенде.

---

### 2.4 Идентификаторы

Все основные сущности используют UUID v4.

Пример:

```text
550e8400-e29b-41d4-a716-446655440000
```

В API UUID передаётся как строка.

---

### 2.5 Авторизация

На уровне API design фиксируем следующее:

- есть публичные endpoints;
- есть endpoints, требующие залогиненного пользователя;
- есть endpoints, доступные только конкретной роли;
- защищённые endpoints возвращают `401`, если пользователь не залогинен;
- endpoints с проверкой роли возвращают `403`, если роль пользователя не подходит.

Текущая рабочая гипотеза для реализации: `httpOnly cookie` с session id. Конкретную библиотеку и механику сессий выбираем позже на этапе бэка.

---

### 2.6 Роли

| Маркер | Роль    | Описание                        |
| ------ | ------- | ------------------------------- |
| 🌐     | Public  | Доступно без авторизации        |
| 🔒     | Auth    | Любой залогиненный пользователь |
| 👨‍🏫     | Tutor   | Залогиненный репетитор          |
| 👨‍🎓     | Student | Залогиненный ученик             |

---

### 2.7 HTTP-статусы

| Статус | Значение              | Когда используем                                      |
| ------ | --------------------- | ----------------------------------------------------- |
| `200`  | OK                    | Успешный `GET` или `PATCH`                            |
| `201`  | Created               | Ресурс создан через `POST`                            |
| `204`  | No Content            | Успешное действие без тела ответа, например `DELETE`  |
| `400`  | Bad Request           | Невалидные входные данные                             |
| `401`  | Unauthorized          | Пользователь не залогинен                             |
| `403`  | Forbidden             | Пользователь залогинен, но не имеет прав              |
| `404`  | Not Found             | Ресурс не найден или недоступен текущему пользователю |
| `409`  | Conflict              | Конфликт бизнес-правил                                |
| `413`  | Payload Too Large     | Файл слишком большой                                  |
| `500`  | Internal Server Error | Ошибка сервера                                        |

---

### 2.8 Формат ошибок

Все ошибки возвращаются в едином формате:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Имя должно быть от 2 до 100 символов",
  "details": {
    "field": "first_name"
  }
}
```

`details` опционален. Он нужен, когда фронту полезно подсветить конкретное поле или показать дополнительные сведения.

Примеры `error`:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `FILE_TOO_LARGE`
- `INTERNAL_SERVER_ERROR`

---

### 2.9 Пагинация

Для списков используем query-параметры:

| Параметр | Описание        | Default | Ограничение |
| -------- | --------------- | ------: | ----------: |
| `page`   | Номер страницы  |     `1` |     min `1` |
| `limit`  | Размер страницы |    `20` |   max `100` |

Пример:

```http
GET /api/students?page=1&limit=20
```

Формат ответа:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "total_pages": 3
  }
}
```

---

## 3. Статусы домашних заданий

| Статус         | Значение                                                            | Кто обычно меняет       |
| -------------- | ------------------------------------------------------------------- | ----------------------- |
| `IN_PROGRESS`  | Задание выдано, ученик работает или задание возвращено на доработку | Tutor / system          |
| `UNDER_REVIEW` | Ученик отправил ответ, репетитор должен проверить                   | System after submission |
| `DONE`         | Репетитор принял задание                                            | Tutor                   |

---

## 4. Общая таблица endpoints

|               # | Метод    | URL                               | Роль | Описание                              |
| --------------: | -------- | --------------------------------- | ---- | ------------------------------------- |
|        **Auth** |          |                                   |      |                                       |
|               1 | `POST`   | `/api/auth/register-tutor`        | 🌐   | Регистрация репетитора                |
|               2 | `POST`   | `/api/auth/register-student`      | 🌐   | Регистрация ученика по invite-токену  |
|               3 | `POST`   | `/api/auth/login`                 | 🌐   | Вход                                  |
|               4 | `POST`   | `/api/auth/logout`                | 🔒   | Выход                                 |
|               5 | `GET`    | `/api/auth/me`                    | 🔒   | Текущий пользователь                  |
|               6 | `POST`   | `/api/auth/forgot-password`       | 🌐   | Запрос восстановления пароля          |
|               7 | `POST`   | `/api/auth/reset-password`        | 🌐   | Установка нового пароля               |
|     **Profile** |          |                                   |      |                                       |
|               8 | `GET`    | `/api/profile`                    | 🔒   | Свой профиль                          |
|               9 | `PATCH`  | `/api/profile`                    | 🔒   | Обновить профиль                      |
|              10 | `POST`   | `/api/profile/change-password`    | 🔒   | Сменить пароль                        |
|    **Students** |          |                                   |      |                                       |
|              11 | `GET`    | `/api/students`                   | 👨‍🏫   | Список своих учеников                 |
|              12 | `POST`   | `/api/students`                   | 👨‍🏫   | Создать ученика                       |
|              13 | `GET`    | `/api/students/:id`               | 👨‍🏫   | Получить одного ученика               |
|              14 | `PATCH`  | `/api/students/:id`               | 👨‍🏫   | Обновить ученика                      |
|              15 | `DELETE` | `/api/students/:id`               | 👨‍🏫   | Удалить ученика                       |
|     **Invites** |          |                                   |      |                                       |
|              16 | `POST`   | `/api/students/:id/invite`        | 👨‍🏫   | Сгенерировать invite-ссылку           |
|              17 | `GET`    | `/api/invites/:token`             | 🌐   | Проверить invite-токен                |
| **Assignments** |          |                                   |      |                                       |
|              18 | `GET`    | `/api/assignments`                | 🔒   | Список ДЗ с фильтрами по роли и query |
|              19 | `POST`   | `/api/assignments`                | 👨‍🏫   | Создать ДЗ                            |
|              20 | `GET`    | `/api/assignments/:id`            | 🔒   | Получить одно ДЗ                      |
|              21 | `PATCH`  | `/api/assignments/:id`            | 👨‍🏫   | Обновить ДЗ или сменить статус        |
|              22 | `DELETE` | `/api/assignments/:id`            | 👨‍🏫   | Удалить ДЗ                            |
| **Submissions** |          |                                   |      |                                       |
|              23 | `POST`   | `/api/assignments/:id/submission` | 👨‍🎓   | Отправить ответ на ДЗ                 |
|              24 | `PATCH`  | `/api/submissions/:id`            | 👨‍🎓   | Обновить ответ                        |
|       **Files** |          |                                   |      |                                       |
|              25 | `POST`   | `/api/files`                      | 🔒   | Загрузить файл                        |
|              26 | `DELETE` | `/api/files/:id`                  | 🔒   | Удалить файл                          |

Итого: 26 endpoints.

---

# 5. Auth

## 5.1 POST `/api/auth/register-tutor`

Регистрация нового репетитора.

### Request body

```json
{
  "email": "tutor@example.com",
  "password": "securePassword123",
  "first_name": "Пётр",
  "last_name": "Сидоров"
}
```

### Validation

| Поле         | Правила                       |
| ------------ | ----------------------------- |
| `email`      | required, valid email, unique |
| `password`   | required, min 8 chars         |
| `first_name` | required, 2-50 chars          |
| `last_name`  | required, 2-50 chars          |

### Response `201 Created`

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "tutor@example.com",
    "role": "TUTOR",
    "first_name": "Пётр",
    "last_name": "Сидоров",
    "avatar_url": null
  }
}
```

### Side effects

- Создаётся пользователь с ролью `TUTOR`.
- Создаётся сессия пользователя.
- В реализации через cookies бэк выставляет `Set-Cookie`.

### Errors

| Статус | Причина           |
| ------ | ----------------- |
| `400`  | Невалидные данные |
| `409`  | Email уже занят   |

---

## 5.2 POST `/api/auth/register-student`

Регистрация ученика по invite-токену.

### Request body

```json
{
  "token": "abc123def456",
  "email": "student@example.com",
  "password": "securePassword123"
}
```

### Validation

| Поле       | Правила                       |
| ---------- | ----------------------------- |
| `token`    | required, active, not expired |
| `email`    | required, valid email, unique |
| `password` | required, min 8 chars         |

### Response `201 Created`

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@example.com",
    "role": "STUDENT",
    "first_name": "Иван",
    "last_name": "Петров",
    "avatar_url": null
  }
}
```

### Side effects

- Создаётся пользователь с ролью `STUDENT`.
- Пользователь привязывается к существующей карточке ученика.
- Invite-токен помечается использованным или деактивируется.
- Создаётся сессия пользователя.

### Errors

| Статус | Причина                          |
| ------ | -------------------------------- |
| `400`  | Невалидные данные                |
| `404`  | Invite-токен не найден или истёк |
| `409`  | Email уже занят                  |

---

## 5.3 POST `/api/auth/login`

Вход пользователя.

### Request body

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Response `200 OK`

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "TUTOR",
    "first_name": "Пётр",
    "last_name": "Сидоров",
    "avatar_url": null
  }
}
```

### Side effects

- Создаётся новая сессия.
- В реализации через cookies бэк выставляет `Set-Cookie`.

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `400`  | Невалидные данные         |
| `401`  | Неверный email или пароль |

---

## 5.4 POST `/api/auth/logout`

Выход пользователя.

### Request body

Пустое тело.

### Response `204 No Content`

Тела ответа нет.

### Side effects

- Текущая сессия удаляется или инвалидируется.
- В реализации через cookies бэк очищает cookie.

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `401`  | Пользователь не залогинен |

---

## 5.5 GET `/api/auth/me`

Получить текущего пользователя. Используется при загрузке приложения для проверки сессии.

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "TUTOR",
  "first_name": "Пётр",
  "last_name": "Сидоров",
  "avatar_url": null
}
```

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `401`  | Пользователь не залогинен |

---

## 5.6 POST `/api/auth/forgot-password`

Запрос восстановления пароля.

### Request body

```json
{
  "email": "user@example.com"
}
```

### Response `200 OK`

```json
{
  "success": true
}
```

### Notes

Для безопасности endpoint может возвращать одинаковый успешный ответ и для существующего, и для несуществующего email.

### Errors

| Статус | Причина          |
| ------ | ---------------- |
| `400`  | Невалидный email |

---

## 5.7 POST `/api/auth/reset-password`

Установка нового пароля по reset-токену.

### Request body

```json
{
  "token": "reset-token",
  "password": "newSecurePassword123"
}
```

### Response `200 OK`

```json
{
  "success": true
}
```

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `400`  | Невалидные данные         |
| `404`  | Токен не найден или истёк |

---

# 6. Profile

## 6.1 GET `/api/profile`

Получить профиль текущего пользователя.

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "TUTOR",
  "first_name": "Пётр",
  "last_name": "Сидоров",
  "avatar_url": null,
  "created_at": "2024-03-15T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `401`  | Пользователь не залогинен |

---

## 6.2 PATCH `/api/profile`

Обновить профиль текущего пользователя.

### Request body

Все поля опциональны.

```json
{
  "first_name": "Пётр",
  "last_name": "Иванов",
  "avatar_url": "https://storage.example.com/avatar.png"
}
```

### Validation

| Поле         | Правила                     |
| ------------ | --------------------------- |
| `first_name` | optional, 2-50 chars        |
| `last_name`  | optional, 2-50 chars        |
| `avatar_url` | optional, valid URL or null |

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "TUTOR",
  "first_name": "Пётр",
  "last_name": "Иванов",
  "avatar_url": "https://storage.example.com/avatar.png",
  "created_at": "2024-03-15T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `400`  | Невалидные данные         |
| `401`  | Пользователь не залогинен |

---

## 6.3 POST `/api/profile/change-password`

Сменить пароль текущего пользователя.

### Request body

```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword123"
}
```

### Response `200 OK`

```json
{
  "success": true
}
```

### Errors

| Статус | Причина                                               |
| ------ | ----------------------------------------------------- |
| `400`  | Невалидные данные                                     |
| `401`  | Пользователь не залогинен или текущий пароль неверный |

---

# 7. Students

## 7.1 GET `/api/students`

Получить список учеников текущего репетитора.

### Query parameters

| Параметр  | Описание               |
| --------- | ---------------------- |
| `search`  | Поиск по имени/фамилии |
| `subject` | Фильтр по предмету     |
| `page`    | Номер страницы         |
| `limit`   | Размер страницы        |

### Example

```http
GET /api/students?search=Иванов&subject=Математика&page=1&limit=20
```

### Response `200 OK`

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "first_name": "Иван",
      "last_name": "Петров",
      "class": 11,
      "subject": "Математика",
      "contact": "+79001234567",
      "notes": null,
      "is_registered": true,
      "active_assignments_count": 3,
      "created_at": "2024-03-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### Notes

- `is_registered` показывает, зарегистрировался ли ученик по invite-ссылке.
- `active_assignments_count` нужен для UI, чтобы не делать отдельные запросы по каждому ученику.
- Репетитор видит только своих учеников.

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `401`  | Пользователь не залогинен |
| `403`  | Пользователь не репетитор |

---

## 7.2 POST `/api/students`

Создать карточку ученика.

### Request body

```json
{
  "first_name": "Иван",
  "last_name": "Петров",
  "class": 11,
  "subject": "Математика",
  "contact": "+79001234567",
  "notes": "Готовится к ЕГЭ"
}
```

### Validation

| Поле         | Правила                          |
| ------------ | -------------------------------- |
| `first_name` | required, 2-50 chars             |
| `last_name`  | required, 2-50 chars             |
| `class`      | optional, integer 1-11 or null   |
| `subject`    | required, 2-100 chars            |
| `contact`    | optional, max 100 chars or null  |
| `notes`      | optional, max 1000 chars or null |

### Response `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Иван",
  "last_name": "Петров",
  "class": 11,
  "subject": "Математика",
  "contact": "+79001234567",
  "notes": "Готовится к ЕГЭ",
  "is_registered": false,
  "active_assignments_count": 0,
  "created_at": "2024-03-15T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                   |
| ------ | ------------------------- |
| `400`  | Невалидные данные         |
| `401`  | Пользователь не залогинен |
| `403`  | Пользователь не репетитор |

---

## 7.3 GET `/api/students/:id`

Получить одного ученика с детализацией.

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Иван",
  "last_name": "Петров",
  "class": 11,
  "subject": "Математика",
  "contact": "+79001234567",
  "notes": "Готовится к ЕГЭ",
  "is_registered": true,
  "active_assignments_count": 3,
  "user": {
    "email": "student@example.com",
    "registered_at": "2024-03-10T10:00:00.000Z"
  },
  "stats": {
    "total_assignments": 12,
    "in_progress": 3,
    "under_review": 1,
    "done": 8
  },
  "created_at": "2024-03-15T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                                             |
| ------ | --------------------------------------------------- |
| `401`  | Пользователь не залогинен                           |
| `403`  | Пользователь не репетитор                           |
| `404`  | Ученик не найден или принадлежит другому репетитору |

---

## 7.4 PATCH `/api/students/:id`

Обновить карточку ученика.

### Request body

Все поля опциональны.

```json
{
  "first_name": "Иван",
  "last_name": "Иванов",
  "class": 10,
  "subject": "Информатика",
  "contact": "+79001234567",
  "notes": "Обновлённая заметка"
}
```

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Иван",
  "last_name": "Иванов",
  "class": 10,
  "subject": "Информатика",
  "contact": "+79001234567",
  "notes": "Обновлённая заметка",
  "is_registered": true,
  "active_assignments_count": 3,
  "created_at": "2024-03-15T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                                             |
| ------ | --------------------------------------------------- |
| `400`  | Невалидные данные                                   |
| `401`  | Пользователь не залогинен                           |
| `403`  | Пользователь не репетитор                           |
| `404`  | Ученик не найден или принадлежит другому репетитору |

---

## 7.5 DELETE `/api/students/:id`

Удалить ученика.

### Response `204 No Content`

Тела ответа нет.

### Business rules

Нельзя удалить ученика, если у него есть активные ДЗ.

Активные ДЗ: assignments со статусом `IN_PROGRESS` или `UNDER_REVIEW`.

### Errors

| Статус | Причина                                             |
| ------ | --------------------------------------------------- |
| `401`  | Пользователь не залогинен                           |
| `403`  | Пользователь не репетитор                           |
| `404`  | Ученик не найден или принадлежит другому репетитору |
| `409`  | У ученика есть активные ДЗ                          |

Пример `409`:

```json
{
  "error": "CONFLICT",
  "message": "У ученика есть активные ДЗ. Завершите их перед удалением."
}
```

---

# 8. Invites

## 8.1 POST `/api/students/:id/invite`

Сгенерировать invite-ссылку для ученика.

### Request body

Пустое тело.

### Response `200 OK`

```json
{
  "token": "abc123def456",
  "url": "https://app.example.com/invite/abc123def456",
  "expires_at": "2024-04-15T10:00:00.000Z"
}
```

### Business rules

- Invite создаёт только репетитор, которому принадлежит ученик.
- Если активный invite уже был, генерируем новый.
- Старый invite деактивируется.
- Invite имеет срок жизни.

### Errors

| Статус | Причина                                             |
| ------ | --------------------------------------------------- |
| `401`  | Пользователь не залогинен                           |
| `403`  | Пользователь не репетитор                           |
| `404`  | Ученик не найден или принадлежит другому репетитору |

---

## 8.2 GET `/api/invites/:token`

Проверить invite-токен на публичной странице регистрации ученика.

### Response `200 OK`

```json
{
  "valid": true,
  "student": {
    "first_name": "Иван",
    "last_name": "Петров"
  },
  "tutor": {
    "first_name": "Пётр",
    "last_name": "Сидоров"
  }
}
```

### Errors

| Статус | Причина                                    |
| ------ | ------------------------------------------ |
| `404`  | Токен не найден, истёк или уже использован |

---

# 9. Assignments

## 9.1 GET `/api/assignments`

Получить список домашних заданий.

Логика зависит от роли:

- Tutor видит ДЗ всех своих учеников.
- Student видит только свои ДЗ.

### Query parameters

| Параметр     | Кто может использовать | Описание                                         |
| ------------ | ---------------------- | ------------------------------------------------ |
| `student_id` | Tutor                  | Фильтр по конкретному ученику                    |
| `status`     | Tutor / Student        | Фильтр по статусу. Можно несколько через запятую |
| `page`       | Tutor / Student        | Номер страницы                                   |
| `limit`      | Tutor / Student        | Размер страницы                                  |

### Examples

```http
GET /api/assignments?status=UNDER_REVIEW&page=1&limit=20
```

```http
GET /api/assignments?student_id=550e8400-e29b-41d4-a716-446655440000
```

```http
GET /api/assignments?status=IN_PROGRESS,UNDER_REVIEW
```

### Response `200 OK`

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Тригонометрия §15",
      "status": "UNDER_REVIEW",
      "deadline": "2024-03-20T23:59:00.000Z",
      "student": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "first_name": "Иван",
        "last_name": "Петров"
      },
      "has_submission": true,
      "created_at": "2024-03-15T10:00:00.000Z",
      "updated_at": "2024-03-18T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### Errors

| Статус | Причина                                            |
| ------ | -------------------------------------------------- |
| `401`  | Пользователь не залогинен                          |
| `403`  | Student использует запрещённый фильтр `student_id` |

---

## 9.2 POST `/api/assignments`

Создать домашнее задание.

### Request body

```json
{
  "student_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Тригонометрия §15",
  "description": "Решить задачи 1-10. Прислать фото или текст.",
  "deadline": "2024-03-20T23:59:00.000Z",
  "file_ids": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

### Validation

| Поле          | Правила                                                         |
| ------------- | --------------------------------------------------------------- |
| `student_id`  | required, ученик должен принадлежать текущему tutor             |
| `title`       | required, 3-200 chars                                           |
| `description` | required, max 5000 chars                                        |
| `deadline`    | optional, ISODate, должен быть в будущем или null               |
| `file_ids`    | optional, массив UUID файлов, загруженных текущим пользователем |

### Response `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Тригонометрия §15",
  "description": "Решить задачи 1-10. Прислать фото или текст.",
  "status": "IN_PROGRESS",
  "deadline": "2024-03-20T23:59:00.000Z",
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "task.pdf",
      "url": "https://storage.example.com/task.pdf",
      "size": 102400,
      "mime_type": "application/pdf",
      "uploaded_at": "2024-03-15T10:00:00.000Z"
    }
  ],
  "student": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Иван",
    "last_name": "Петров"
  },
  "submission": null,
  "created_at": "2024-03-15T10:00:00.000Z",
  "updated_at": "2024-03-15T10:00:00.000Z"
}
```

### Side effects

- Создаётся assignment со статусом `IN_PROGRESS`.

### Errors

| Статус | Причина                                             |
| ------ | --------------------------------------------------- |
| `400`  | Невалидные данные                                   |
| `401`  | Пользователь не залогинен                           |
| `403`  | Пользователь не репетитор                           |
| `404`  | Ученик не найден или принадлежит другому репетитору |

---

## 9.3 GET `/api/assignments/:id`

Получить полную детализацию одного ДЗ.

### Access rules

- Tutor может получить ДЗ только своих учеников.
- Student может получить только своё ДЗ.

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Тригонометрия §15",
  "description": "Решить задачи 1-10. Прислать фото или текст.",
  "status": "UNDER_REVIEW",
  "deadline": "2024-03-20T23:59:00.000Z",
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "task.pdf",
      "url": "https://storage.example.com/task.pdf",
      "size": 102400,
      "mime_type": "application/pdf",
      "uploaded_at": "2024-03-15T10:00:00.000Z"
    }
  ],
  "student": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Иван",
    "last_name": "Петров"
  },
  "submission": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "text": "Мой ответ...",
    "files": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "answer.pdf",
        "url": "https://storage.example.com/answer.pdf",
        "size": 204800,
        "mime_type": "application/pdf",
        "uploaded_at": "2024-03-18T10:00:00.000Z"
      }
    ],
    "review_comment": null,
    "submitted_at": "2024-03-18T10:00:00.000Z",
    "updated_at": "2024-03-18T10:00:00.000Z"
  },
  "created_at": "2024-03-15T10:00:00.000Z",
  "updated_at": "2024-03-18T10:00:00.000Z"
}
```

Если ответа ученика ещё нет:

```json
{
  "submission": null
}
```

### Errors

| Статус | Причина                                            |
| ------ | -------------------------------------------------- |
| `401`  | Пользователь не залогинен                          |
| `404`  | ДЗ не найдено или недоступно текущему пользователю |

---

## 9.4 PATCH `/api/assignments/:id`

Обновить ДЗ или сменить статус.

### Request body

Все поля опциональны.

```json
{
  "title": "Новый заголовок",
  "description": "Новое описание",
  "deadline": "2024-03-25T23:59:00.000Z",
  "status": "DONE",
  "review_comment": "Принято, хорошая работа"
}
```

### Validation

| Поле             | Правила                                         |
| ---------------- | ----------------------------------------------- |
| `title`          | optional, 3-200 chars                           |
| `description`    | optional, max 5000 chars                        |
| `deadline`       | optional, ISODate, будущая дата или null        |
| `status`         | optional, `IN_PROGRESS`, `UNDER_REVIEW`, `DONE` |
| `review_comment` | optional, max 2000 chars                        |

### Business rules

- Только tutor может обновлять ДЗ.
- Tutor может менять ДЗ только у своих учеников.
- Tutor может поставить `DONE`, чтобы принять работу.
- Tutor может поставить `IN_PROGRESS`, чтобы вернуть работу на доработку.
- `review_comment` имеет смысл при смене статуса на `DONE` или `IN_PROGRESS`.

### Response `200 OK`

Возвращается обновлённый `AssignmentDetail`.

### Errors

| Статус | Причина                                          |
| ------ | ------------------------------------------------ |
| `400`  | Невалидные данные                                |
| `401`  | Пользователь не залогинен                        |
| `403`  | Пользователь не репетитор                        |
| `404`  | ДЗ не найдено или принадлежит другому репетитору |
| `409`  | Статус нельзя поменять по бизнес-правилам        |

---

## 9.5 DELETE `/api/assignments/:id`

Удалить ДЗ.

### Response `204 No Content`

Тела ответа нет.

### Business rules

- Только tutor может удалить ДЗ.
- Tutor может удалить только ДЗ своих учеников.

### Errors

| Статус | Причина                                          |
| ------ | ------------------------------------------------ |
| `401`  | Пользователь не залогинен                        |
| `403`  | Пользователь не репетитор                        |
| `404`  | ДЗ не найдено или принадлежит другому репетитору |

---

# 10. Submissions

## 10.1 POST `/api/assignments/:id/submission`

Ученик отправляет ответ на ДЗ.

### Request body

```json
{
  "text": "Мой ответ...",
  "file_ids": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

### Validation

| Поле       | Правила                                                            |
| ---------- | ------------------------------------------------------------------ |
| `text`     | required если нет файлов, max 5000 chars                           |
| `file_ids` | required если нет `text`, массив UUID файлов текущего пользователя |

### Business rules

- Отправлять ответ может только student.
- Student может отправить ответ только на своё ДЗ.
- Нельзя отправить ответ, если assignment уже `DONE`.
- После отправки ответа assignment автоматически переходит в `UNDER_REVIEW`.
- В базовой версии считаем, что у одного assignment один актуальный submission.

### Response `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "assignment_id": "550e8400-e29b-41d4-a716-446655440001",
  "text": "Мой ответ...",
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "answer.pdf",
      "url": "https://storage.example.com/answer.pdf",
      "size": 204800,
      "mime_type": "application/pdf",
      "uploaded_at": "2024-03-18T10:00:00.000Z"
    }
  ],
  "review_comment": null,
  "submitted_at": "2024-03-18T10:00:00.000Z",
  "updated_at": "2024-03-18T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                                  |
| ------ | ---------------------------------------- |
| `400`  | Невалидные данные                        |
| `401`  | Пользователь не залогинен                |
| `403`  | Пользователь не ученик или это не его ДЗ |
| `404`  | ДЗ не найдено                            |
| `409`  | Статус ДЗ не позволяет отправить ответ   |

---

## 10.2 PATCH `/api/submissions/:id`

Обновить ответ ученика.

### Request body

```json
{
  "text": "Исправленный ответ",
  "file_ids": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

### Business rules

- Обновлять ответ может только student.
- Student может обновлять только свой submission.
- Можно обновлять, если assignment имеет статус `IN_PROGRESS` или `UNDER_REVIEW`.
- Нельзя обновлять, если assignment имеет статус `DONE`.
- После обновления ответа assignment становится `UNDER_REVIEW`.

### Response `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "assignment_id": "550e8400-e29b-41d4-a716-446655440001",
  "text": "Исправленный ответ",
  "files": [],
  "review_comment": null,
  "submitted_at": "2024-03-18T10:00:00.000Z",
  "updated_at": "2024-03-19T10:00:00.000Z"
}
```

### Errors

| Статус | Причина                                          |
| ------ | ------------------------------------------------ |
| `400`  | Невалидные данные                                |
| `401`  | Пользователь не залогинен                        |
| `403`  | Пользователь не ученик или это не его submission |
| `404`  | Submission не найден                             |
| `409`  | Assignment уже `DONE`, редактировать нельзя      |

---

# 11. Files

## 11.1 POST `/api/files`

Загрузить файл. Используется перед созданием ДЗ или перед отправкой submission.

### Request

`multipart/form-data` с полем `file`.

```text
file: binary
```

### Response `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "task.pdf",
  "url": "https://storage.example.com/task.pdf",
  "size": 102400,
  "mime_type": "application/pdf",
  "uploaded_at": "2024-03-15T10:00:00.000Z"
}
```

### Validation

| Правило       | Значение                                          |
| ------------- | ------------------------------------------------- |
| Max size      | 10 MB                                             |
| Allowed types | `pdf`, `doc`, `docx`, `jpg`, `jpeg`, `png`, `txt` |

### Notes

Файл загружается отдельно от assignment/submission:

1. фронт загружает файл через `POST /api/files`;
2. получает `file.id`;
3. передаёт `file_ids` в `POST /api/assignments` или `POST /api/assignments/:id/submission`.

### Errors

| Статус | Причина                                |
| ------ | -------------------------------------- |
| `400`  | Невалидный файл или тип файла запрещён |
| `401`  | Пользователь не залогинен              |
| `413`  | Файл слишком большой                   |

---

## 11.2 DELETE `/api/files/:id`

Удалить файл.

### Response `204 No Content`

Тела ответа нет.

### Business rules

- Удалить файл может только пользователь, который его загрузил.
- Если файл уже привязан к assignment/submission, поведение нужно уточнить на этапе реализации.

### Errors

| Статус | Причина                                    |
| ------ | ------------------------------------------ |
| `401`  | Пользователь не залогинен                  |
| `403`  | Файл загрузил другой пользователь          |
| `404`  | Файл не найден                             |
| `409`  | Файл уже используется и его нельзя удалить |

---

# 12. TypeScript-типы

Файл для фронтенда: `src/shared/api/types.ts`.

```typescript
// Base

export type UUID = string;
export type ISODate = string;

// Roles

export type UserRole = 'TUTOR' | 'STUDENT';

// Assignment statuses

export type AssignmentStatus = 'IN_PROGRESS' | 'UNDER_REVIEW' | 'DONE';

// User

export type User = {
  id: UUID;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export type Profile = User & {
  created_at: ISODate;
};

// Student

export type Student = {
  id: UUID;
  first_name: string;
  last_name: string;
  class: number | null;
  subject: string;
  contact: string | null;
  notes: string | null;
  is_registered: boolean;
  active_assignments_count: number;
  created_at: ISODate;
};

export type StudentDetail = Student & {
  user: {
    email: string;
    registered_at: ISODate;
  } | null;
  stats: {
    total_assignments: number;
    in_progress: number;
    under_review: number;
    done: number;
  };
};

// File

export type FileItem = {
  id: UUID;
  name: string;
  url: string;
  size: number;
  mime_type: string;
  uploaded_at: ISODate;
};

// Submission

export type Submission = {
  id: UUID;
  assignment_id: UUID;
  text: string;
  files: FileItem[];
  review_comment: string | null;
  submitted_at: ISODate;
  updated_at: ISODate;
};

// Assignment

export type Assignment = {
  id: UUID;
  title: string;
  status: AssignmentStatus;
  deadline: ISODate | null;
  student: Pick<Student, 'id' | 'first_name' | 'last_name'>;
  has_submission: boolean;
  created_at: ISODate;
  updated_at: ISODate;
};

export type AssignmentDetail = Omit<Assignment, 'has_submission'> & {
  description: string;
  files: FileItem[];
  submission: Submission | null;
};

// Invite

export type Invite = {
  token: string;
  url: string;
  expires_at: ISODate;
};

export type InviteValidation = {
  valid: true;
  student: Pick<Student, 'first_name' | 'last_name'>;
  tutor: Pick<User, 'first_name' | 'last_name'>;
};

// Pagination

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};

// API Error

export type ApiError = {
  error: string;
  message: string;
  details?: Record<string, unknown>;
};
```

---

# 13. Маппинг экран → endpoints

| Экран                       | Endpoints                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Public / Login              | `POST /api/auth/login`                                                                                              |
| Public / Signup Tutor       | `POST /api/auth/register-tutor`                                                                                     |
| Public / Invite Signup      | `GET /api/invites/:token` → `POST /api/auth/register-student`                                                       |
| Tutor / Dashboard           | `GET /api/auth/me`, `GET /api/assignments?status=UNDER_REVIEW`, `GET /api/students?limit=5`                         |
| Tutor / Students List       | `GET /api/students`                                                                                                 |
| Tutor / Student Create      | `POST /api/students`                                                                                                |
| Tutor / Student Detail      | `GET /api/students/:id`, `GET /api/assignments?student_id=:id`, `POST /api/students/:id/invite`                     |
| Tutor / Student Edit        | `GET /api/students/:id`, `PATCH /api/students/:id`                                                                  |
| Tutor / Assignment Create   | `POST /api/files`, `POST /api/assignments`                                                                          |
| Tutor / Assignment Detail   | `GET /api/assignments/:id`, `PATCH /api/assignments/:id`                                                            |
| Tutor / Assignment Edit     | `GET /api/assignments/:id`, `PATCH /api/assignments/:id`                                                            |
| Student / Dashboard         | `GET /api/auth/me`, `GET /api/assignments?status=IN_PROGRESS`                                                       |
| Student / Assignments List  | `GET /api/assignments`                                                                                              |
| Student / Assignment Detail | `GET /api/assignments/:id`, `POST /api/files`, `POST /api/assignments/:id/submission`, `PATCH /api/submissions/:id` |
| Profile                     | `GET /api/profile`, `PATCH /api/profile`, `POST /api/profile/change-password`                                       |

---

# 14. Что пока не покрываем

Эти темы сознательно откладываем:

- конкретная механика авторизации: NextAuth/Auth.js/Lucia/собственная session-система;
- хранение session id, refresh tokens, rotation;
- rate limiting;
- email-уведомления;
- WebSockets / realtime-уведомления;
- версионирование API (`/v1`, `/v2`);
- аудит действий пользователя;
- сложная файловая политика: вирус-сканирование, приватные signed URLs, lifecycle cleanup.

---

# 15. TODO для следующих этапов

- Выбрать auth-библиотеку на этапе реализации бэка.
- Решить, нужна ли отдельная ручка `/api/dashboard` или достаточно композиции из существующих endpoints.
- Уточнить поведение удаления файлов, если они уже привязаны к assignment/submission.
- Уточнить, нужны ли черновики ДЗ (`DRAFT`) в первой версии.
- Уточнить, нужна ли история нескольких submission attempts или достаточно одного актуального submission.

---

# 16. История изменений

| Дата       | Версия | Изменение                   |
| ---------- | ------ | --------------------------- |
| 2026-05-10 | v1     | Начальная версия API design |
