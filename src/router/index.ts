import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DownloadView from '@/views/DownloadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/download',
      name: 'download',
      component: DownloadView,
    },
    {
      path: '/webservices',
      name: 'webservices',
      // route level code-splitting
      // this generates a separate chunk (e.g. About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/WebServicesView.vue'),
    },
    {
      path: '/files',
      name: 'batchdownload',
      component: () => import('@/views/BatchDownloadView.vue'),
    },
    {
      path: '/stac',
      name: 'stac',
      component: () => import('@/views/STACView.vue'),
    },
    {
      path: '/opendata',
      name: 'shareyourdata',
      component: () => import('@/views/ShareYourDataView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/accessibility',
      name: 'accessibility',
      component: () => import('@/views/AccessibilityView.vue'),
    },
  ],
})

export default router
