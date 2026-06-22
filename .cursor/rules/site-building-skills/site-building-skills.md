# 🌐 Скіли для будування сайтів

> Складено: 22 червня 2026
> Для: Bohdan (voits.bohdan@gmail.com)

Цей файл містить усі скіли, які використовуються для дизайну та будування сайтів — з локальними шляхами та офіційними посиланнями на джерела.

---

## 1. Дизайн / UI-скіли (ClaudeKit) — встановлені 21 червня 2026

Усі ці скіли від автора **claudekit** і походять з одного репозиторію:

🔗 **Репозиторій:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
📚 **Документація:** https://docs.claudekit.cc
📦 **Маркетплейс:** https://claudemarketplaces.com/skills/nextlevelbuilder/ui-ux-pro-max-skill

| Скіл | Версія | Що робить | Локальний шлях |
|------|--------|-----------|----------------|
| **ui-ux-pro-max** | — | Головний UI/UX-движок: 50+ стилів, 161 палітра, 57 шрифтових пар, патерни під React/Next.js/Vue/Svelte/Tailwind/shadcn | `~/.agents/skills/ui-ux-pro-max` |
| **ckm-design** | 2.1.0 | Комплексний дизайн: брендинг, токени, логотипи (55 стилів, Gemini AI), банери, іконки, соцфото | `~/.agents/skills/ckm-design` |
| **ckm-ui-styling** | 1.0.0 | Інтерфейси на shadcn/ui + Tailwind, адаптив, доступність, dark mode | `~/.agents/skills/ckm-ui-styling` |
| **ckm-design-system** | 1.0.0 | Дизайн-система: 3-рівневі токени, специфікації компонентів | `~/.agents/skills/ckm-design-system` |
| **ckm-banner-design** | 1.0.0 | Банери для героїв сайту, реклами, соцмереж (22 стилі) | `~/.agents/skills/ckm-banner-design` |
| **ckm-brand** | 1.0.0 | Бренд-голос, візуальна айдентика, гайдлайни, перевірка консистентності | `~/.agents/skills/ckm-brand` |
| **ckm-slides** | 1.0.0 | HTML-презентації з Chart.js | `~/.agents/skills/ckm-slides` |

**Окремі сторінки документації:**
- ckm:design → https://docs.claudekit.cc/docs/marketing/skills/ui-ux-pro-max
- ckm:design-system → https://docs.claudekit.cc/docs/marketing/skills/design-system/
- ckm:brand → https://claudemarketplaces.com/skills/nextlevelbuilder/ui-ux-pro-max-skill/ckm:brand

**Як встановити заново (за потреби):**
```bash
# Через маркетплейс Claude Code:
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill

# Або окремий скіл через CLI:
npx -y skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ckm:design --agent claude-code
```

**Зовнішні джерела, на які спираються ці скіли:**
- shadcn/ui — https://ui.shadcn.com/llms.txt
- Tailwind CSS — https://tailwindcss.com/docs

---

## 2. Розробницькі скіли (fullstack-dev-skills) — встановлені 21 червня 2026

🔗 **Репозиторій:** https://github.com/Jeffallan/claude-skills

Корисні для коду сайту:
- `react-expert` — React
- `nextjs-developer` — Next.js
- `vue-expert` / `vue-expert-js` — Vue
- `typescript-pro` / `javascript-pro` — TS/JS
- `shopify-expert`, `wordpress-pro` — e-commerce / CMS
- `code-reviewer`, `secure-code-guardian` — перевірка коду

(локально: `~/.claude/plugins/marketplaces/fullstack-dev-skills/skills`)

---

## 3. Офіційні скіли Anthropic

🔗 **Репозиторій:** https://github.com/anthropics/skills
🔗 **Плагіни Claude Code:** https://github.com/anthropics/claude-code

Корисні для сайтів: `frontend-design`, `web-artifacts-builder`, `webapp-testing`, `canvas-design`, `theme-factory`, `brand-guidelines`.

(локально: `~/.claude/plugins/marketplaces/anthropic-agent-skills/skills`)

---

## 4. Маркетингові / SEO-скіли — встановлені 31 березня 2026

🔗 **Репозиторій:** https://github.com/coreyhaines31/marketingskills

Корисні для сайтів: `seo-audit`, `copywriting`, `page-cro`, `schema-markup`, `site-architecture`, `programmatic-seo`, `ai-seo`, `analytics-tracking`.

(локально: `~/.agents/skills/`)

---

## Джерела (посилання)

- [ui-ux-pro-max-skill (GitHub)](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [ClaudeKit Documentation](https://docs.claudekit.cc/docs/getting-started/introduction/)
- [ckm:design (docs)](https://docs.claudekit.cc/docs/marketing/skills/ui-ux-pro-max)
- [ckm:brand (marketplace)](https://claudemarketplaces.com/skills/nextlevelbuilder/ui-ux-pro-max-skill/ckm:brand)
- [fullstack-dev-skills (GitHub)](https://github.com/Jeffallan/claude-skills)
- [anthropic/skills (GitHub)](https://github.com/anthropics/skills)
- [marketingskills (GitHub)](https://github.com/coreyhaines31/marketingskills)
