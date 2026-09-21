/// <reference types="vite/client" />

/** Build timestamp (ISO string), injected by Vite via `define`. */
declare const __BUILD_TIME__: string

/** Branch and commit of the dev server's checkout, empty in builds. */
declare const __BUILD_BRANCH__: string
declare const __BUILD_COMMIT__: string
