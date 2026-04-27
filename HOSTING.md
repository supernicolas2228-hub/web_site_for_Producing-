# Деплой на VPS / панель (Node.js + PostgreSQL)

## Что выбрать в конфигурации хостинга

Оптимально: **Node.js • PostgreSQL**.

- **Нет** подходит чистый «PHP», «WordPress», «только React/Vue/Angular» без Node — у вас **Next.js** (серверный рендер и API).
- **MongoDB** не используется: в проекте **Prisma + PostgreSQL**.

Версия Node на сервере: **18.17+** (в т.ч. **20/22 LTS**, **25.x** с панели хостинга — для этого проекта обычно ок; если билд упадёт на очень новой ветке, в панели переключи на **22 LTS**).

**PostgreSQL 16** — совместим с текущей схемой Prisma (`provider = "postgresql"`).

**Бесплатный тестовый домен** от хостинга не требует отдельных переменных в коде: Next сам отдаёт ответ на тот `Host`, с которым пришёл запрос. Дополнительно ничего править не нужно, если ты не хардкодишь абсолютные URL (в проекте они в основном в `config/links.ts` на внешние сервисы).

## Переменные окружения на сервере

Скопируй из `.env.example` и задай в панели хостинга (или в `.env` на VPS):

| Переменная                 | Назначение                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| `DATABASE_URL`             | Строка PostgreSQL в формате Prisma (`postgresql://...` или `postgres://...`) |
| `DB_CONNECTION_STRING`     | У **NetAngels** часто задана автоматически — дублируется в `DATABASE_URL` в коде |
| `NEXT_PUBLIC_SITE_URL`     | **Канонический URL сайта** (желательно `https://твойдомен.ru` без слеша в конце). Нужен для Open Graph, sitemap, `metadataBase` и редиректа `www`→основной домен на Node-деплое. См. `.env.example`. |
| `ADMIN_PASSWORD`           | Пароль входа в `/admin` (задаёшь сам в панели, не из письма хостинга)        |
| `NODE_ENV`                 | Обычно панель ставит `production` сама                                      |
| `PORT`                     | Если хостинг задаёт порт — Next его подхватит                               |

## NetAngels (sellisgood.na4u.ru и аналоги)

- Письмо с логином/паролем БД и FTP — **не публикуй** в мессенджерах и чатах; при утечке смени пароли в личном кабинете.
- В окружении сайта уже может быть **`DB_CONNECTION_STRING`** — приложение и **`npm run migrate:deploy`** подставляют её в **`DATABASE_URL`** сами (`lib/syncDatabaseUrl.ts`, `scripts/migrate-deploy.cjs`).
- Дополнительно в панели всё равно задай **`ADMIN_PASSWORD`** для `/admin`.
- Если Prisma не коннектится, а в пароле есть символы `)`, `@`, `#` и т.п. — попробуй **URL-кодирование** пароля в строке (например `)` → `%29`).
- **FTP** — для загрузки файлов вручную; типичный деплой Node-приложения — через панель (git/сборка на сервере), а не только FTP.

## Команды (типичная панель «Node»)

1. **Установка:** `npm ci` или `npm install`
2. **Миграции + сборка одной командой:** `npm run deploy`  
   (эквивалент `migrate:deploy` + `build`)
3. **Запуск:** `npm start`  
   (слушает порт из `PORT`, иначе по умолчанию 3000)

Отдельно при необходимости: только миграции — `npm run migrate:deploy`, только сборка — `npm run build`.

Некоторые панели позволяют указать «команда после деплоя» — туда имеет смысл добавить **`npm run deploy`** (или по отдельности миграции + build) до первого **`npm start`**.

## Режим standalone

В `next.config.mjs` включён `output: "standalone"`. На VPS можно запускать:

```bash
node .next/standalone/server.js
```

При этом в каталог standalone нужно скопировать `public` и `.next/static` рядом со `server.js` — см. [документацию Next.js](https://nextjs.org/docs/app/building-your-application/deploying#nodejs-server). Проще на старте использовать **`npm start`** (обычный `next start`).

## Локально без Docker

Нужен **PostgreSQL**: установи с [postgresql.org](https://www.postgresql.org/download/windows/) и создай БД, либо используй облако (**Neon** и т.п.) — см. раздел в **`NETANGELS.md`**. В **`.env`** задай **`DATABASE_URL`**, затем:

```bash
npm run migrate:deploy
npm run dev
```

Docker и `docker-compose.yml` — опционально. Файл **`dev.db`** (SQLite) больше не используется.
