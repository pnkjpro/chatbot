import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../pages/ChatDashboard.vue'),
    },
    {
      path: '/ui',
      name: 'UI',
      component: () => import('../pages/CheckingUi.vue'),
    }
    // {
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   component: () => import('../pages/ChatDashboard.vue'),
    // },
  ],
})

export default router
