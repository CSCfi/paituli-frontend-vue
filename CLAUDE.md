# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Paituli is a geospatial data download portal for Finnish geodata.
The frontend is a Vue 3 + TypeScript SPA built with Vite, providing an interactive OpenLayers map for browsing and downloading datasets.
It talks to a backend at `localhost:8080` (proxied via `/api` in dev mode).

## Commands

Node and npm are unavailable in the Claude Code environment, these commands are run only by the user. No need to remind the user about this either.
```bash
npm run dev          # start dev server (proxies /api → localhost:8080)
npm run build        # type-check + production build
npm run build-only   # production build without type-check
npm run type-check   # vue-tsc type validation only
npm run lint         # ESLint with auto-fix
npm run build-test   # build with --mode test
```

## Code style

Don't make formatting-only edits — Formatting is the linter's job.

## Environment modes and variables

Vite automatically loads `.env.[mode]` based on the build mode. These modes are `development`, `test` and `production`.
`VITE_`-prefixed variables are exposed in client-side code via `import.meta.env`; most are centralised in `src/shared/constants.ts`.

In deployments (prod and test) additional `build-info.json` is provided which is optionally rendered in the site header.
Frontend's copy is put into the web root next to `index.html` and backend serves its own at `VITE_BUILD_INFO_API`.
In a local dev environment the build info is usually omitted, and without one the frontend falls back to read from the local git checkout. 

Other environment variables:
- `VITE_GEOSERVER_BASE` — GeoServer base URL (used for WMS/WMTS/WFS/OGC endpoints)
- `VITE_METADATA_API` — dataset metadata API endpoint
- `VITE_DOWNLOAD_API` — download job API endpoint
- `VITE_ETSIN_BASE` — Etsin research data catalog base URL
- `VITE_MATOMO_TAG` — Matomo analytics environment tag (`DEV`/`TEST`/`PRODUCTION`)
- `VITE_BASE_PATH` — optional base path override
- `VITE_GEODATA_BASE` — archive base the browser fetches preview files from; set in development only, where it points at a Vite proxy
- `VITE_SHOW_BUILD_INFO` — forces the header build badges on (`true`) or off (`false`).

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

All routes except `/download` and `/preview` render `LocalizedContentView`, which dynamically loads a locale-specific component based on the route name and current locale.
Content components follow the naming pattern `src/views/content/[RouteName]-[locale].vue` (e.g. `Home-en.vue`, `Home-fi.vue`).
The loader uses `import.meta.glob` — adding a new content page means creating files matching the pattern and adding a route entry in `routes.ts`.

`/preview?data_id=…&path=…` renders a single archive file on its own, picking a renderer by extension — see `src/modules/preview.ts`.
It reads the file straight from the archive (`URLS.GEODATA_FETCH_BASE`) instead of via the backend, and resolves glob paths from the dataset's format.

### Map data flow

1. User picks a dataset → `datasets.ts` sets `currentDataset`
2. `layers.ts` fetches map sheets from GeoServer WFS as FlatGeoBuf, populates `indexSource`
3. Selected sheets tracked in `selection.ts` (`selectedOlFeatures` Collection + `selectedFeaturesArray` shallowRef)
4. Data layer (WMTS) renders automatically based on `currentDataset.data_url`

### CSC Design System web components

All `c-*` tags (e.g. `<c-button>`, `<c-menu>`, `<c-toasts>`) are CSC Design System web components from `@cscfi/csc-ui`.
Vue treats them as custom elements (configured in `vite.config.ts`).

### i18n

Locale is persisted in `localStorage`. Global translation keys (used across components) live in `locale.ts`.
Component-local translations use `<i18n-t>` or scoped `useI18n()`. The two supported locales are `en` and `fi`.

### Directives

- `v-help` (`directives/help.ts`) — binds context-sensitive help text shown in the help sidebar panel
- `v-tooltip` (`directives/tooltip.ts`) — CSC UI tooltip integration
- `v-control` — from `@cscfi/csc-ui-vue`, for form control binding

## External API documentation

When working with OL or vue3-openlayers, fetch the relevant docs pages — both APIs have many non-obvious options.

- **OpenLayers API** — https://openlayers.org/en/latest/apidoc/ (class list; append e.g. `module-ol_interaction_Select-Select.html` for a specific class)
- **vue3-openlayers** — https://vue3openlayers.netlify.app/get-started.html (component list in the sidebar)
