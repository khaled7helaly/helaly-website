# Helaly Frontend Architecture

This document records the frontend structure for the Helaly React + Vite project as it is
actually implemented. It is a concise companion to the full reference in
[`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md) and the project entry point in
[`README.md`](README.md).

The application is a **client-side single-page app with no backend**. There is no API layer,
database, authentication, or server-side rendering. Conversion happens through a WhatsApp
handoff: the request wizard composes a prefilled message and opens a `wa.me` link.

## Project structure

```text
helaly/
├── public/
│   ├── favicon.svg
│   ├── icons.svg                     # present but unreferenced by src/
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── sitemap.xml                   # EMPTY file (0 bytes)
│   └── images/brand/image1.svg
├── src/
│   ├── app/
│   │   ├── App.jsx                   # mounts <RouterProvider>
│   │   ├── router.jsx                # createBrowserRouter route map + breadcrumb handles
│   │   └── layouts/MainLayout.jsx    # shared shell: navbar, breadcrumbs, footer, brand intro
│   ├── assets/                       # default Vite assets, currently unused
│   ├── components/
│   │   ├── brand/BrandLogo.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── ThemeSwitcher.jsx
│   │   │   └── navigation.js         # NAVIGATION_ITEMS + shared path constants
│   │   └── ui/                       # Accordion, Badge, Breadcrumbs, Button, Checkbox,
│   │                                 # Container, EmptyState, FormField, PagePlaceholder,
│   │                                 # Price, SectionHeading, SelectField, SpotlightCard,
│   │                                 # Startbutton, TextAreaField
│   ├── config/contact.js             # WhatsApp number, email/phone, social links
│   ├── context/ThemeContext.jsx      # theme provider + useTheme()
│   ├── data/
│   │   ├── services.json             # 12 services
│   │   ├── serviceCategories.json    # 11 categories, grouped
│   │   ├── proposals.json            # 12 proposals (4 complete, rest outline)
│   │   ├── addons.json               # optional add-ons
│   │   ├── packages.json             # fixed packages
│   │   ├── requestOptions.json       # project types, currencies, timelines
│   │   ├── packageFieldOptions.json  # option groups for package form selects
│   │   ├── processSteps.json         # the 5 shared process steps
│   │   ├── faqs.js                   # FAQ id → translation keys
│   │   └── projects.json             # EMPTY array []
│   ├── features/
│   │   ├── brand-intro/{BrandIntro.jsx, BrandIntroProvider.jsx, BrandIntroContext.js, useBrandIntro.js, brandIntro.constants.js}
│   │   ├── home/components/          # homepage sections
│   │   ├── packages/{components,utils}/
│   │   ├── projects/{components,utils}/
│   │   ├── request/{components,context,hooks,reducers,utils}/
│   │   └── services/{components,hero,preview,utils}/
│   ├── i18n/
│   │   ├── index.js                  # i18next init + document lang/dir sync
│   │   └── locales/{en.json, ar.json}
│   ├── lib/                          # readTranslation, getSafeExternalUrl, processSteps,
│   │                                 # Motionpresets, socialIcons
│   ├── pages/                        # route-level page modules
│   ├── styles/index.css              # design tokens + Tailwind v4 entry (@theme inline)
│   └── main.jsx                      # React entry: StrictMode + ThemeProvider + App
├── tests/
│   ├── fixtures/{projects.fixture.js, services.fixture.js}
│   ├── helpers/{reactTestServer.js, requestTestServer.js}
│   ├── projects/{project-page.test.js, projects-selectors.test.js}
│   ├── request/{request-pricing, request-reducer, request-selection, request-url, request-validation, whatsapp-message}.test.js
│   └── services/{service-hero-backdrop, service-page, service-preview, services-selectors}.test.js
├── ARCHITECTURE.md
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── .oxlintrc.json
├── .gitignore
└── eslint.config.js                  # EMPTY file (0 bytes) — not functional
```

The Vite entry point in `src/main.jsx` mounts `src/app/App.jsx` and imports the global
stylesheet from `src/styles/index.css`.

## Directory responsibilities

- `public/`: Static files served as-is, including search metadata and public image assets.
- `src/app/`: Application composition, route definitions, and the shared page layout.
- `src/assets/`: Assets imported by source modules. Currently holds only unused defaults.
- `src/components/`: Reusable components shared across features. Subfolders group brand,
  site layout, and general UI concerns.
- `src/config/`: Site-wide settings, currently the contact details in `contact.js`.
- `src/context/`: Application-wide React Context providers (theme).
- `src/features/`: Domain-specific website areas, their components, and logic that is only
  meaningful within those areas.
- `src/pages/`: Route-level page modules. Pages compose shared layout and feature components
  rather than owning repeated domain logic.
- `src/data/`: Central source for service, add-on, package, project, FAQ, and process content.
- `src/i18n/`: Translation runtime setup and the two language resource files.
- `src/lib/`: Small framework-independent helpers shared by multiple areas.
- `src/styles/`: Global stylesheet and design tokens.
- `eslint.config.js`: An empty placeholder; it does not configure anything. Linting is done by
  Oxlint via `.oxlintrc.json`.

## Shared components strategy

Components belong in `src/components/` only when they have a clear reuse case across pages or
features. Domain-specific presentation belongs beside its feature in
`src/features/<feature>/components/`. Pages assemble these pieces; they do not duplicate common
UI or embed business rules.

## Feature-based architecture

Each feature owns the UI and supporting logic for its domain. The `home`, `services`,
`packages`, `projects`, `request`, and `brand-intro` areas are independently organized. Shared
functionality moves to a common location only when it is genuinely reused and has a stable,
domain-neutral responsibility.

## Centralized data management

Static content and catalogue records belong in `src/data/`, not duplicated across page or
component files. Global values belong in `src/config/`. Records store **translation keys**, and
display strings live in `src/i18n/locales/`. Components refer to centralized records and
translation keys rather than maintaining parallel copies of content.

## Routing organization

`src/app/router.jsx` owns the route map and `src/app/layouts/MainLayout.jsx` provides the shared
site shell. Every route renders inside `MainLayout`, and page modules are lazy-loaded with
`React.lazy`. The current route map is:

| Route | Page |
|---|---|
| `/` | `HomePage` |
| `/services` | `ServicesPage` |
| `/services/:slug` | `ServiceDetailsPage` |
| `/packages` | `PackagesPage` |
| `/packages/:slug` | `PackageDetailsPage` |
| `/work` | `WorkPage` |
| `/work/:slug` | `ProjectDetailsPage` |
| `/about` | `AboutPage` |
| `/contact` | `ContactPage` |
| `/request` | `RequestPage` (via `RequestProvider`) |
| `*` | `NotFoundPage` |

The `/request` route scopes the request Context provider to that feature rather than the whole
application. Per-route `handle.breadcrumb` metadata drives the `Breadcrumbs` component.

## Internationalization organization

`src/i18n/index.js` configures the active translation system, while
`src/i18n/locales/en.json` and `ar.json` contain the English and Arabic resources. User-facing
text is translated through these resources. The active language is read from and written to
`localStorage["language"]` (default `en`), and language changes update `document.documentElement.lang`
and `dir` (`ar` → `rtl`). There is no locale segment in the URL.

## Theme organization

`src/context/ThemeContext.jsx` provides the application-wide theme. The theme is stored in
`localStorage["helaly-theme"]`, defaults to `dark`, and is applied via a `data-theme` attribute
plus `colorScheme` on the document element. `src/styles/index.css` holds the design tokens for
both themes.

## Brand Intro responsibilities

The `src/features/brand-intro/` feature owns the brand introduction experience. `BrandIntro.jsx`
represents its presentation, `BrandIntroProvider.jsx` its application-level state boundary,
`useBrandIntro.js` its consumer hook, and `brandIntro.constants.js` its local constants. The
provider is mounted in `MainLayout`, which marks the shell `inert` while the intro is active.
Its `seen` flag is persisted in `localStorage["helaly_intro_seen"]`.

## Request System organization

The request journey is a **three-step wizard** owned by `src/features/request/`.
`RequestConfigurator` coordinates navigation and step validation; each form component owns its
fields; `OrderSummary` presents the review; and `WhatsAppSubmitButton` prepares a prefilled
message on the final step. A single `RequestProvider` is scoped to the `/request` route in
`src/app/router.jsx`, with shared request data held in its `useReducer`-backed Context.
`validateRequest` is the common source for step and final-submit validation, and
`isAddonCompatible` shares service-specific compatibility rules between the selector and
reducer. Service, category, add-on, and option records remain in their JSON catalogs, and
request state stores stable IDs rather than catalog objects. Customer contact data remains in
memory and is not persisted to local storage. The business WhatsApp destination belongs in
`src/config/contact.js`; opening a `wa.me` link does not confirm delivery, and the customer
reviews and sends the prepared message manually. Run `npm test` for request state, validation,
selection, URL, pricing, and message regression tests.

## Design system location

Global design tokens and baseline styling live in `src/styles/index.css`. Reusable visual
primitives belong in `src/components/ui/`. Feature-specific styling remains close to its feature
when needed, without introducing duplicated global definitions.

## Rules for avoiding duplication

1. Keep each content record in one `src/data/` file and keep global settings in `src/config/`.
2. Reuse shared UI from `src/components/` instead of copying markup between features.
3. Keep feature-only components and rules inside their owning feature.
4. Keep route composition in pages and route declarations in `src/app/router.jsx`.
5. Keep shared calculations and formatting in one utility rather than repeating them in components.
6. Add abstractions only when they clarify ownership or provide real reuse.
7. Store translation keys in data records and display strings in the locale files; never
   duplicate user-facing text.
