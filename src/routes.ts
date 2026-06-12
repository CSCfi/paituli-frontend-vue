import { createRouter, createWebHistory, type RouteLocation, type RouteRecordRaw } from 'vue-router'
import LocalizedContentView from '@/views/LocalizedContentView.vue'
import DownloadView from '@/views/DownloadView.vue'
import { i18n } from './modules/locale'
import { watch } from 'vue'

// `meta.nav: true` marks routes shown in the main navigation.
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: { nav: true },
    component: LocalizedContentView,
  },
  {
    path: '/download',
    name: 'Download',
    meta: { nav: true, hideFooter: true },
    component: DownloadView,
  },
  {
    path: '/webservices',
    name: 'WebServices',
    meta: { nav: true },
    component: LocalizedContentView,
  },
  {
    path: '/files',
    name: 'BatchDownload',
    meta: { nav: true },
    component: LocalizedContentView,
  },
  {
    path: '/stac',
    name: 'STAC',
    meta: { nav: true },
    component: LocalizedContentView,
  },
  {
    path: '/opendata',
    name: 'ShareYourData',
    meta: { nav: true },
    component: LocalizedContentView,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: LocalizedContentView,
  },
  {
    path: '/cookies',
    name: 'Cookies',
    component: LocalizedContentView,
  },
  {
    path: '/accessibility',
    name: 'Accessibility',
    component: LocalizedContentView,
  },
  {
    path: '/:pathMatch(.*)*', // Matches all other routes for a 404 view
    name: 'NotFound',
    component: LocalizedContentView,
  },
]

// Main navigation in route order. Each label is the i18n key
// `pages.<name lowercased>` (same convention as the document title below).
export const navLinks = routes
  .filter(route => route.meta?.nav)
  .map(route => ({ path: route.path, name: String(route.name) }))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

function updateDocumentTitle(route: RouteLocation) {
  // Keys for page titles are defined in locale.ts
  const key = `pages.${route.name?.toString().toLowerCase()}`
  document.title = `${i18n.global.t(key)} – Paituli`
}

// Fairdata Matomo analytics API (see index.html/fdwe.js)
declare const fdweRecordEvent: () => void

// Update page title and Matomo after each routing
router.afterEach((to) => {
  updateDocumentTitle(to)
  fdweRecordEvent()
})

// Update page title also if locale changes
watch(i18n.global.locale, () => updateDocumentTitle(router.currentRoute.value))

export default router
