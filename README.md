# Sell is Life — лендинг и админка аналитики

Одностраничный лендинг на **Next.js 14 (App Router)** с тёмным UI, анимациями (**Framer Motion**) и админ-панелью (**/admin**) с графиками (**Recharts**). События и «заявки» (клики по Starter Pack) пишутся в **SQLite** через **Prisma**.

## Быстрый старт

1. Скопируйте `.env.example` в `.env` и задайте переменные:

   - `DATABASE_URL` — для SQLite по умолчанию: `"file:./dev.db"` (файл создаётся рядом с `prisma/schema.prisma`).
   - `ADMIN_PASSWORD` — пароль для входа в `/admin`.

2. Установите зависимости и примените миграции:

   ```bash
   npm install
   npx prisma migrate dev
   ```

3. Запуск в режиме разработки:

   ```bash
   npm run dev
   ```

   Откройте [http://localhost:3000](http://localhost:3000). Админка: [http://localhost:3000/admin](http://localhost:3000/admin).

## Сборка для продакшена

```bash
npm run build
npm start
```

Для продакшена укажите свой `DATABASE_URL` (например PostgreSQL) и сильный `ADMIN_PASSWORD`. В `schema.prisma` поменяйте `provider` на `postgresql` при необходимости.

## Шрифты

Заголовки: **Oswald** (display), текст: **Manrope** — через `next/font`, с поддержкой кириллицы. Bebas Neue в Google Fonts не отдаёт subset `cyrillic`, поэтому для русскоязычного контента выбран близкий по характеру Oswald.

## Где менять контент и ссылки

- **Тексты** — `config/content.ts` (все блоки лендинга, FAQ, тарифы, отзывы).
- **Внешние ссылки** (Google Forms, Telegram, оплата, YouTube) — `config/links.ts`.
- **Картинки** — положите свои файлы в `public/images/` с теми же именами (`hero-photo.jpg`, `review-1.jpg`, …) или обновите пути в `config/content.ts`.

## Аналитика

- Клиент шлёт события на `POST /api/track` (см. `lib/track.ts`).
- События: `page_view`, `click_starter_pack`, `click_product`, `click_pricing`, `scroll_depth` (25/50/75/100).
- UTM с текущего URL добавляются в `data` событий.
- Админка читает агрегаты через `GET /api/analytics` (только с валидной сессией после логина).

## Структура (основное)

- `app/(site)/` — лендинг (навбар, футер, трекинг).
- `app/admin/` — дашборд и логин.
- `app/api/track`, `app/api/analytics`, `app/api/admin/login`, `app/api/admin/logout`.
- `components/sections/*` — секции лендинга.
- Доступ к `/admin`: проверка cookie в серверном `app/admin/page.tsx` и в `GET /api/analytics` (без Edge middleware, чтобы `.env` с паролем стабильно читался в Node).
