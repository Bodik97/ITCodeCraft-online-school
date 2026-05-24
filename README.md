# ITCodeCraft Online School

Сайт онлайн-школи програмування: головна сторінка та окремий лендінг курсу Roblox.

## Швидкий старт

```bash
npm install
npm run dev
```

- Головна: [http://localhost:4321/](http://localhost:4321/)
- Roblox: [http://localhost:4321/roblox](http://localhost:4321/roblox)

## Стек

- [Astro](https://astro.build) 5 — статичні сторінки, секції `.astro`
- [React](https://react.dev) — форми, інтерактив
- [Tailwind CSS](https://tailwindcss.com) 4 — стилі через `src/styles/global.css`

## Структура проєкту

Детальний опис папок і правил розміщення файлів: **[docs/STRUCTURE.md](./docs/STRUCTURE.md)**

```
src/
├── pages/           # Маршрути
├── layouts/         # MainLayout, RobloxLayout
├── sections/main/   # Секції головної
├── sections/roblox/ # Секції Roblox
├── components/      # shared | main | roblox
├── data/            # main.json, roblox.json
└── styles/          # global + main + roblox
```

## Скрипти

| Команда | Опис |
|---------|------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Продакшн-збірка в `dist/` |
| `npm run preview` | Перегляд збірки |
| `npm run check` | Перевірка типів Astro |
