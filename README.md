# Helaly

Marketing website for **Helaly**, a web design & digital marketing studio. It is a
bilingual (English / Arabic) **single-page application** built with React 19 + Vite 8.
The application is entirely client-side: there is no backend, database, or
authentication. Project inquiries are not posted to a server — they are handed off to
**WhatsApp** as a prefilled message that the visitor reviews and sends themselves.

> This README is the entry point. For the complete technical reference see
> [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) and the shorter
> [ARCHITECTURE.md](ARCHITECTURE.md).

- **Repository:** https://github.com/khaled7helaly/helaly-website
- **Live website:** https://khaled7helaly.github.io/helaly-website/

---

## Overview

Helaly presents a studio's services through a data-driven catalogue. All content
(services, packages, proposals, process steps, FAQs) lives in centralized JSON files
under `src/data/`, and every user-facing string is resolved through the i18n system
(`en` / `ar`). Components read records and translation keys — nothing hardcodes copy.

The visitor journey is: explore services (or fixed packages) → open a service/package
detail page → start a request → submit a prefilled WhatsApp message.

## Main purpose

- Present Helaly's web-development and digital-marketing services in two languages.
- Let visitors discover a service, read its proposal, and open a tailored request flow.
- Route every lead to WhatsApp without operating any server infrastructure.

## Key features

- **Bilingual EN / AR** with automatic LTR ↔ RTL switching (`document.lang` / `dir`).
- **Dark / light theme** with persistence and a no-flash inline bootstrap script.
- **Data-driven service catalogue** — 12 services across 11 categories, driven by JSON.
- **Service detail pages** with overview, inclusions, deliverables, process, FAQ,
  related work and an optional interactive proposal document.
- **Fixed-package catalogue** with pricing, add-ons, comparison and inquiry forms.
- **3-step request wizard** (service → budget/timeline → contact) with URL prefill
  (`/request?service=<slug>&addons=<ids>`), live validation and an order summary.
- **WhatsApp handoff** for both the request flow and package inquiries.
- **Animated brand intro** shown once per browser, animating the wordmark into the navbar.
- **Accessibility-aware**: reduced-motion variants, keyboard-navigable menus,
  focus management, `inert`/ARIA on overlays, native `<dialog>` lightbox.

## Technology stack

| Area                 | Technology                                                    |
| -------------------- | ------------------------------------------------------------- |
| UI library           | React `19.3.1`, react-dom `19.3.1`                            |
| Routing              | react-router `7.18.5` (`createBrowserRouter`)                 |
| Build tool           | Vite `8.3.5` + `@vitejs/plugin-react` `6.1.2`                 |
| Styling              | Tailwind CSS `4.3.3` + `@tailwindcss/vite` (CSS-first config) |
| Animation            | `motion` `14.9.0` (`motion/react`)                            |
| Internationalization | `i18next` `26.6.0` + `react-i18next` `17.1.9`                 |
| Icons                | `lucide-react` `1.66.0`                                       |
| Fonts                | `@fontsource-variable/manrope`, `@fontsource-variable/cairo`  |
| Linting              | `oxlint` `1.89.0`                                             |
| Tests                | Node built-in test runner (`node --test`)                     |

Full dependency rationale (what it does / why / where) is in
[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md#5-dependencies).

## Architecture overview

Feature-based, layered front end with no server tier:

```
index.html → src/main.jsx → src/app/App.jsx → src/app/router.jsx → src/app/layouts/MainLayout.jsx → src/pages/*
```

- **`src/app/`** owns composition: the router map and the shared shell.
- **`src/pages/`** are route-level modules that assemble feature components.
- **`src/features/`** own domain UI + logic (`home`, `services`, `projects`, `request`,
  `packages`, `brand-intro`).
- **`src/components/`** holds reusable UI (`ui/`), site layout (`layout/`) and brand marks.
- **`src/data/`** is the single source of content; **`src/i18n/`** the single source of text.
- Global state is limited to three React Contexts: theme, brand intro, and the request
  wizard (scoped to the `/request` route).

See the diagrams in
[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md#6-architecture-diagrams).

## Project structure

```text
helaly/
├── public/                     # static assets served as-is (favicon, manifest, robots.txt, sitemap.xml)
│   └── images/brand/           # brand marks
├── src/
│   ├── app/                    # App.jsx, router.jsx, layouts/MainLayout.jsx
│   ├── assets/                 # (mostly unused default assets)
│   ├── components/
│   │   ├── brand/BrandLogo.jsx
│   │   ├── layout/             # Navbar, MobileMenu, Footer, LanguageSwitcher, ThemeSwitcher, navigation.js
│   │   └── ui/                 # Button, Container, SectionHeading, Badge, Price, Accordion, ...
│   ├── config/contact.js       # WhatsApp number, email/phone, social links
│   ├── context/ThemeContext.jsx
│   ├── data/                   # JSON content: services, serviceCategories, proposals, addons,
│   │                           # packages, requestOptions, packageFieldOptions, processSteps + faqs.js
│   ├── features/
│   │   ├── brand-intro/        # first-visit animated intro
│   │   ├── home/components/    # homepage sections
│   │   ├── packages/           # fixed-package catalog, pricing, inquiry
│   │   ├── projects/           # case-study components + selectors
│   │   ├── request/            # 3-step wizard: context, reducer, hooks, utils
│   │   └── services/           # catalogue, detail sections, hero/preview systems, selectors
│   ├── i18n/                   # index.js + locales/{en,ar}.json
│   ├── lib/                    # small shared helpers (readTranslation, getSafeExternalUrl, ...)
│   ├── pages/                  # route-level modules
│   ├── styles/index.css        # design tokens + base styles (Tailwind v4 entry)
│   └── main.jsx                # application entry
├── tests/                      # node:test suites (request, services, projects) + fixtures/helpers
├── ARCHITECTURE.md
└── vite.config.js
```

The complete per-file structure, with responsibilities, is in
[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md#4-project-structure).

## Installation

**Prerequisites:** Node.js (a version compatible with Vite 8 — Node 20.19+ or 22.12+) and npm.

```bash
# install dependencies
npm install

# start the development server (Vite, with HMR)
npm run dev
```

## Environment variables

**None.** The project currently reads no environment variables and ships no `.env` file.
All configurable values live in `src/config/contact.js` and `src/data/*.json`. There are
no API keys or secrets in the repository.

## Available scripts

| Script            | Command                            | Description                                          |
| ----------------- | ---------------------------------- | ---------------------------------------------------- |
| `npm run dev`     | `vite`                             | Development server with HMR.                         |
| `npm run build`   | `vite build`                       | Production build into `dist/`.                       |
| `npm run preview` | `vite preview`                     | Serve the built `dist/` locally.                     |
| `npm run lint`    | `oxlint`                           | Lint the codebase (config in `.oxlintrc.json`).      |
| `npm test`        | `node --test --test-concurrency=1` | Run the `tests/` suites with Node's built-in runner. |

## Development instructions

1. Run `npm run dev` and open the printed local URL.
2. Content changes: edit `src/data/*.json`; text changes: edit `src/i18n/locales/{en,ar}.json`
   — keep the two locale files in parity.
3. Verify a change with `npm run lint` and `npm test`, then `npm run build`.

## Build and deployment

`npm run build` emits a static bundle to `dist/` (ignored by git).

The site is hosted on **GitHub Pages** at
**https://khaled7helaly.github.io/helaly-website/** and is deployed automatically by
GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). Every push
to the `main` branch (or a manual run from the Actions tab) installs dependencies with
`npm ci`, builds the production bundle, and publishes `dist/` to Pages. Because the site is
served from a sub-path, Vite's `base` is set to `/helaly-website/` in
[`vite.config.js`](vite.config.js), and the router uses the same value
(`import.meta.env.BASE_URL`) as its basename. Deep links and refreshes are handled by a
`404.html` SPA fallback generated during the build.

- **Deployment source:** Settings → Pages → Build and deployment → **GitHub Actions**.

See [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md#15-build--deployment) for the
full build details.

## Documentation

| Document                                                       | Contents                                                                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) | Complete technical reference: architecture, structure, components, routing, data flow, dependencies, setup, testing, and known gaps. |
| [ARCHITECTURE.md](ARCHITECTURE.md)                             | Concise record of the frontend structure and conventions.                                                                            |

## Important notes

- **No backend/API/database/auth exists.** "Submitting" a request or package inquiry opens
  WhatsApp (`wa.me`) with a prepared message; it is not stored anywhere.
- **`src/data/projects.json` is currently an empty array.** `/work`, `/work/:slug` and the
  homepage projects section therefore render empty states / nothing.
- **Service hero images are referenced but absent.** `services.json` points to
  `/images/hero/*.webp`, but `public/images/` contains only `public/images/brand/image1.svg`;
  cards fall back to a text/glyph treatment.
- **Pricing is unset.** Every service `price` is `null`, so `Price` renders nothing and
  proposals show a "price on request" state.
- **Contact details are placeholders.** `src/config/contact.js` has an empty email/phone and
  root-domain social URLs; empty/placeholder entries are filtered out of the UI.
- **SEO is not implemented.** `index.html` is the only source of `<title>`/description; there
  is no per-route metadata, canonical, hreflang, Open Graph, JSON-LD, and `public/sitemap.xml`
  is empty.
- **Some files are unused** (dead code / default template assets). See
  [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md#17-unused-files-and-architectural-notes).
