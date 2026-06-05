# Source structure

Paituli is a Vue 3 + TypeScript single-page application. The source is split between `.vue` component files (template, logic, and styles in one place) and plain `.ts` files for state, data, and utilities. Components consume the shared state from different `modules/`.

## Overview
```
src/
  assets/          [vue] Global styles and static files
  components/      [vue] Reusable UI pieces composed into pages
  composables/     [ts]  Reusable logic that hooks into Vue's reactivity system
  directives/      [ts]  Custom element attributes (v-help, v-tooltip)
  modules/         [ts]  Global reactive state and the functions that modify it
  shared/          [ts]  Constants, types, and utility functions
  views/           [vue] Full pages, one component per route
    content/       [vue] Locale-specific static page pairs (fi + en)
  App.vue          [vue] Root component — site header, footer, router outlet
  main.ts          [ts]  Entry point — registers plugins, directives, mounts the app
  routes.ts        [ts]  Route definitions and navigation hooks
```

## Vue
`.vue` files bundle a component's template (HTML), logic (TypeScript), and styles (CSS) in one place.  
They define what the user actually sees and interacts with in the app.

### src/assets
Static files processed by Vite, currently only hosting the global CSS.

### src/components
Reusable components, organized by section.
Nothing in here should be a full page — only pieces that make up pages.

```
components/
  common/      Generic components shared across the whole app (links, footer, code blocks)
  download/    Components that make up the /download page
    help/      Help messages
    map/       Map area, toolbar, layer controls, and location search
    modals/    Overlay dialogs (download, dataset info, web services)
```

### src/views
Top-level page components, directly referred to in `routes.ts`

- `DownloadView` is the interactive download page with the map, dataset selector, and download panel.
- `LocalizedContentView` is a generic loader used by all other routes. It finds and renders the right static content page from `src/views/content/` based on the current route and locale.

#### src/views/content
Locale-specific static pages, one Finnish and one English file per page.

---

## TypeScript
Plain `.ts` files contain logic, state, and data. They are decoupled outside of `.vue` files avoids monolithic components and makes state easy to share across the app.

### src/shared
URL constants, TypeScript type definitions, small utility functions.
`constants.ts` is the single place where all URLs (Geoserver, STAC, Etsin, etc) and app-wide settings are defined.

### src/modules
Global application state. Each file exports plain Vue reactive values (refs) and the functions that operate on them.

```
modules/
  controls.ts   Toolbar mode (move/select/inspect) and map layer visibility toggles
  datasets.ts   Fetched dataset list and the currently selected dataset
  etsin.ts      Fetching and parsing dataset metadata from the Etsin catalog
  helpText.ts   "Help box" visibility and content
  layers.ts     OpenLayers map sources and index layer loading
  locale.ts     Language setting, i18n instance, and localized page loader
  selection.ts  Selected map sheet features and their checkbox states
```

### src/composables
Reusable Vue logic which can be only called from inside Vue components.  
Currently hosts `toasts.ts` for user alerts and `compactness.ts` for component reactivity.

### src/directives
Custom attributes you can add to elements, like tooltip hover messages.
