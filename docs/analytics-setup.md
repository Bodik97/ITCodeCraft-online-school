# Налаштування аналітики — чекліст

Уніфікація трекінгу під **один site-wide GTM-контейнер** → одна GA4-property
(`G-00YT0R9QFP`), розподіл по сторінках через `content_group`.
Roblox лишається на власному контейнері (`GTM-NB6DC34X` + `G-Q2RD189P09`).

Код уже готовий (гілка `analytics/unified-gtm`) і gated на env `PUBLIC_GTM_ID` —
поки ID не заданий і теги в GTM не зібрані, сайт без трекінгу. **Не мерджити в
`main` до готовності кабінету.**

dataLayer-події, які вже шле сайт (їх підхоплює GTM):

| Подія | Параметри | Звідки |
|---|---|---|
| `cta_click` | `cta_text`, `cta_location`, `cta_href`, `page_group` | усі кнопки/посилання |
| `lead` | `course`, `form_id`, `conversionId` | Form.tsx (успішна заявка) |
| `registration_modal_open` | `cta_source`, `course` | Modal.astro |
| `page_group` (init push) | `main` / `minecraft` / `scratch` / `frontend` | Analytics.astro |

---

## 🔓 Крок 1 — Створити GTM-контейнер (розблоковує код)
- [ ] tagmanager.google.com → Create Account
- [ ] Account: `ITCodeCraft`, Country: Ukraine
- [ ] Container: `itcodecraft.tech`, target **Web**
- [ ] Скопіювати `GTM-XXXXXXX`
- [ ] **Дати ID розробнику** → впише `PUBLIC_GTM_ID` у `.env`

## ⚙️ Крок 2 — GTM (теги / тригери / змінні)
- [ ] **2.1** Data Layer Variable `dlv - page_group` (Variable Name: `page_group`)
- [ ] **2.2** GA4 Configuration (Google Tag), Measurement ID `G-00YT0R9QFP`,
      параметр `content_group` = `{{dlv - page_group}}`, trigger **Initialization – All Pages**
- [ ] **2.3** Custom Event trigger `lead` → GA4 Event tag `generate_lead`
- [ ] **2.4** Custom Event trigger `registration_modal_open` → GA4 Event tag `registration_modal_open`
- [ ] **2.5** Custom Event trigger `cta_click` → GA4 Event tag `cta_click`
      (параметри `cta_text`, `cta_location`, `cta_href` через однойменні DLV)
- [ ] **2.6** Google Ads Conversion tag (Conversion ID + Label з Кроку 4), trigger `lead`

## 📊 Крок 3 — GA4
- [ ] Custom dimension: Name `page_group`, Scope **Event**, Parameter `content_group`
- [ ] Позначити `generate_lead` як **Key event / Conversion**

## 💰 Крок 4 — Google Ads
- [ ] New conversion action (Website) «Заявка з сайту» → взяти **Conversion ID + Label** (для 2.6)
- [ ] Перевірити лінк акаунта `AW-18135456615` ↔ GA4 `G-00YT0R9QFP`

## ✅ Крок 5 — Тест і публікація
- [ ] GTM **Preview**: клік по кнопці (`cta_click`), відкриття форми (`registration_modal_open`), заявка (`lead`)
- [ ] GA4 **DebugView**: події приходять, `content_group` = правильна сторінка
- [ ] GTM **Submit / Publish**

## 🚀 Крок 6 — Реліз
- [ ] Повідомити розробника → мердж `analytics/unified-gtm` → `main` (авто-деплой)
