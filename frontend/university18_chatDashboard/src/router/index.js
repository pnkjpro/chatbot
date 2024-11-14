import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/local',
      name: 'Local Chat',
      component: () => import('../pages/LocalChat.vue'),
    },
    {
      path: '/server',
      name: 'Server Chat',
      component: () => import('../pages/ServerChat.vue'),
    }
  ],
})

export default router
