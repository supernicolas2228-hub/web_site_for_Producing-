# Сайт на NetAngels — ссылка и запуск

## Готовая ссылка (твой тестовый домен)

- **Сайт (лендинг):** https://sellisgood.na4u.ru/  
- **Админка аналитики:** https://sellisgood.na4u.ru/admin  

Я не могу сам зайти в твой личный кабинет NetAngels и запустить деплой — это делаешь ты по шагам ниже. После них сайт должен открываться по ссылке выше.

---

## Переменные окружения в панели (Node.js)

Уже должны быть или добавь вручную:

| Ключ | Значение |
|------|----------|
| `DB_CONNECTION_STRING` | строка из письма NetAngels (часто уже есть) |
| `ADMIN_PASSWORD` | твой пароль для `/admin` |

При необходимости дублируй строку БД как **`DATABASE_URL`** — иначе приложение само подставит из **`DB_CONNECTION_STRING`** (см. проект).

---

## Команды на сервере (порядок важен)

В каталоге с проектом (где `package.json`):

```bash
npm ci
```

(если нет `package-lock.json` — один раз можно `npm install`)

Дальше **одной командой** миграции + сборка:

```bash
npm run deploy
```

Это то же самое, что подряд `npm run migrate:deploy` и `npm run build`.

Запуск приложения:

```bash
npm start
```

В панели NetAngels в качестве **команды запуска** обычно указывают только **`npm start`** (после того как хотя бы раз выполнили `npm ci` и `npm run deploy`).

Порт: панель часто задаёт **`PORT`** — Next его подхватит. Если приложение не стартует — смотри логи в панели.

---

## Локально на ПК (Windows), **без Docker**

Нужна любая **PostgreSQL**, к которой есть строка подключения. Два удобных варианта:

### Вариант 1 — PostgreSQL на этом же компьютере

1. Скачай установщик: **[PostgreSQL для Windows](https://www.postgresql.org/download/windows/)** (официальный инсталлятор EDB или пакет от сообщества).
2. В процессе установки задай пароль суперпользователя **`postgres`** (запомни его).
3. Открой **pgAdmin** или **SQL Shell (psql)** и создай базу, например:
   ```sql
   CREATE DATABASE sellislife;
   ```
4. В **`.env`** укажи (подставь свой пароль вместо `YOUR_PASSWORD`):
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sellislife?schema=public"
   ```

### Вариант 2 — облако (ничего не ставить на ПК)

1. Зарегистрируйся, например, в **[Neon](https://neon.tech)** (есть бесплатный тариф).
2. Создай проект/базу, скопируй **Connection string** (формат `postgresql://...@...neon.tech/...`).
3. Вставь её в **`.env`** как **`DATABASE_URL=...`** (часто нужен параметр `?sslmode=require` — Neon обычно даёт готовую строку).

### Дальше как обычно

```bash
npm install
npm run migrate:deploy
npm run dev
```

Docker **не обязателен**; папка **`docker-compose.yml`** только для тех, кто хочет Postgres в контейнере.

Прочее:

- **`npm ci`** иногда падает с **EPERM** на `next-swc...node` — закрой `next dev` / процессы Node, повтори или **`npm install`**.
- **`npm start`** и **EADDRINUSE:3000** — порт занят; останови процесс или:  
  `$env:PORT=3001; npm start` (PowerShell).

---

## Если по ссылке пусто или 502

1. Убедись, что **Node-приложение реально запущено** (процесс `node`, не только заливка файлов по FTP).  
2. Повтори **`npm run build`** после ошибок и снова **`npm start`**.  
3. Проверь, что **`npm run migrate:deploy`** прошёл без ошибок.  
4. Вопросы с паролем БД и скобкой `)` в URL — см. `HOSTING.md`.  

---

## Локально у себя на ПК

Перед заливкой можно проверить:

```bash
npm run build
npm start
```

Открой http://localhost:3000
