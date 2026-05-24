# Структура проєкту ITCodeCraft

Монорепозиторій з **двома лендінгами** на Astro + React:

| Сайт | URL | Призначення |
|------|-----|-------------|
| **Main** | `/` | Головна школа ITCodeCraft |
| **Roblox** | `/roblox` | Лендінг курсу Roblox Studio |

---

## Дерево `src/`

```
src/
├── pages/                 # Маршрути (тільки збірка сторінок)
│   ├── index.astro        # → головна
│   └── roblox.astro       # → Roblox
│
├── layouts/               # Оболонки HTML (head, body, скрипти)
│   ├── MainLayout.astro
│   └── RobloxLayout.astro
│
├── sections/              # Великі блоки сторінки (секції)
│   ├── main/              # Header, Hero, Courses, FAQ…
│   └── roblox/            # Hero, GamesShowcase, Testimonials…
│
├── components/
│   ├── shared/            # Спільні: Logo, MessengerFab…
│   ├── main/              # Форми та модалки головної
│   │   ├── form/
│   │   └── modal/
│   ├── roblox/            # UI лише для Roblox
│   │   ├── form/
│   │   └── modal/
│   └── ui/                # React primitives (textarea…)
│
├── styles/
│   ├── global.css         # Tailwind, теми, імпорти
│   ├── main/              # Стилі головної (layouts, form, logo)
│   ├── roblox/            # Стилі Roblox (theme, form)
│   └── utils/             # Сторонні (intl-tel-input)
│
├── data/
│   ├── main.json          # Контент головної
│   └── roblox.json        # Контент Roblox
│
├── assets/
│   └── roblox/            # Оптимізовані зображення (Astro Image)
│
├── lib/                   # Утиліти (formSubmit, scrollLock, assets…)
├── store/                 # Zustand
└── icons/                 # SVG для astro-icon
```

## `public/`

Статичні файли без обробки збіркою:

```
public/
├── assets/                # Favicon, OGP, медіа головної
└── assets/roblox/         # Іконки, відгуки, opengraph Roblox
```

---

## Де що додавати

| Задача | Куди класти |
|--------|-------------|
| Нова секція головної | `src/sections/main/` + імпорт у `pages/index.astro` |
| Нова секція Roblox | `src/sections/roblox/` + імпорт у `pages/roblox.astro` |
| Спільний компонент (лого, FAB) | `src/components/shared/` |
| Тексти / JSON | `src/data/main.json` або `roblox.json` |
| Стилі Roblox (кнопка, анімація) | `src/styles/roblox/theme.css` |
| Стилі головної | `src/styles/main/` |

---

## Аліаси імпортів

У `tsconfig.json`:

- `@/*` → `src/*`
- `@/layouts/*`, `@/sections/main/*`, `@/components/shared/*` — через `@/`

Приклад:

```astro
import MainLayout from "@/layouts/MainLayout.astro";
import content from "@/data/main.json";
import Logo from "@/components/shared/Logo.astro";
```

---

## Збірка

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```
