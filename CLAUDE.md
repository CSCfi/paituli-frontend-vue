# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Paituli is a geospatial data download portal for Finnish geodata. The frontend is a Vue 3 + TypeScript SPA built with Vite, providing an interactive OpenLayers map for browsing and downloading datasets. It talks to a backend at `localhost:8080` (proxied via `/api` in dev mode).

## Commands

```bash
npm run dev          # start dev server (proxies /api → localhost:8080)
npm run build        # type-check + production build
npm run build-only   # production build without type-check
npm run type-check   # vue-tsc type validation only
npm run lint         # ESLint with auto-fix
npm run build-test   # build with --mode test
```

There is no test suite. Node ≥ 22.13 is required.

## Environment Variables

Vite automatically loads `.env.[mode]` based on the build mode. All three files (`.env.development`, `.env.test`, `.env.production`) are present in the repo. `VITE_`-prefixed variables are exposed in client-side code via `import.meta.env`; most are centralised in `src/shared/constants.ts`.

- `VITE_GEOSERVER_BASE` — GeoServer base URL (used for WMS/WMTS/WFS/OGC endpoints)
- `VITE_METADATA_API` — dataset metadata API endpoint
- `VITE_DOWNLOAD_API` — download job API endpoint
- `VITE_ETSIN_BASE` — Etsin research data catalog base URL
- `VITE_MATOMO_TAG` — Matomo analytics environment tag (`DEV`/`TEST`/`PRODUCTION`)
- `VITE_BASE_PATH` — optional base path override; only set in `.env.test` (`/v4/`)

## Architecture

### State management (module pattern)

Global state lives in plain Vue `ref`s exported from modules under `src/modules/`:

| Module | Responsibility |
|---|---|
| `datasets.ts` | Fetched dataset list, currently selected dataset |
| `selection.ts` | OpenLayers feature collection for selected map sheets, checkbox visibility states |
| `layers.ts` | OL sources for all map layers; index layer loading via FlatGeoBuf |
| `controls.ts` | Toolbar mode (`move`/`select`/`inspect`), layer visibility toggles, menu tab mode |
| `locale.ts` | i18n instance, locale switching, localized content page loader |

### Routing and localized content pages

All routes except `/download` render `LocalizedContentView`, which dynamically loads a locale-specific component based on the route name and current locale. Content components follow the naming pattern `src/views/content/[RouteName]-[locale].vue` (e.g. `Home-en.vue`, `Home-fi.vue`). The loader uses `import.meta.glob` — adding a new content page means creating matching `[Name]-fi.vue` and `[Name]-en.vue` files and adding a route entry in `routes.ts`.

### Map data flow

1. User picks a dataset → `datasets.ts` sets `currentDataset`
2. `layers.ts` fetches map sheets from GeoServer WFS as FlatGeoBuf, populates `indexSource`
3. Selected sheets tracked in `selection.ts` (`selectedOlFeatures` Collection + `selectedFeaturesArray` shallowRef)
4. Data layer (WMTS) renders automatically based on `currentDataset.data_url`; auto-hidden when map zoom is too low (`dataHidden` computed from `mapViewResolution` vs `dataLayerMaxResolution`)

### CSC Design System web components

All `c-*` tags (e.g. `<c-button>`, `<c-menu>`, `<c-toasts>`) are CSC Design System web components from `@cscfi/csc-ui`. Vue treats them as custom elements (configured in `vite.config.ts`). The app must call `defineCustomElements()` and await `nextTick()` before mounting — skipping this causes web components to render empty.

### i18n

Locale is persisted in `localStorage`. Global translation keys (used across components) live in `locale.ts`. Component-local translations use `<i18n-t>` or scoped `useI18n()`. The two supported locales are `en` and `fi`.

### Directives

- `v-help` (`directives/help.ts`) — binds context-sensitive help text shown in the help sidebar panel
- `v-tooltip` (`directives/tooltip.ts`) — CSC UI tooltip integration
- `v-control` — from `@cscfi/csc-ui-vue`, for form control binding

## External API documentation

When working with OL or vue3-openlayers, fetch the relevant docs page rather than guessing option names — both APIs have many non-obvious options.

- **OpenLayers API** — https://openlayers.org/en/latest/apidoc/ (class list; append e.g. `module-ol_interaction_Select-Select.html` for a specific class)
- **vue3-openlayers** — https://vue3openlayers.netlify.app/get-started.html (component list in the sidebar)
