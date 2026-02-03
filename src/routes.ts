import { createRouter, createWebHistory } from 'vue-router'
import LocalizedContentView from '@/views/LocalizedContentView.vue'
import DownloadView from '@/views/DownloadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LocalizedContentView,
    },
    {
      path: '/download',
      component: DownloadView,
    },
    {
      path: '/webservices',
      name: 'WebServices',
      component: LocalizedContentView,
    },
    {
      path: '/files',
      name: 'BatchDownload',
      component: LocalizedContentView,
    },
    {
      path: '/stac',
      name: 'STAC',
      component: LocalizedContentView,
    },
    {
      path: '/opendata',
      name: 'ShareYourData',
      component: LocalizedContentView,
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: LocalizedContentView,
    },
    {
      path: '/accessibility',
      name: 'Accessibility',
      component: LocalizedContentView,
    },
  ],
})

export default router
