# Paituli Frontend

Frontend for the [Paituli](https://paituli.csc.fi) geospatial data download portal. Built with Vue 3, TypeScript, and Vite. Produces static files that can be served by any web server.

## Install dependencies

```
npm install
```

## Development

```
npm run dev
```

Starts a dev server at `localhost:5173`. API calls to `/api` are proxied to the backend at `localhost:8080`.

## Build

```
npm run build
```

Output goes to `/dist`. For a test build:

```
npm run build-test
```

## Configuration

Environment variables are in `.env.development`, `.env.test`, and `.env.production`. Vite loads the right file automatically based on the build mode. See `src/shared/constants.ts` for how they are used.
