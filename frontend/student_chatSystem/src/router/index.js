import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/LocalChat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/local',
    name: 'Local Chat',
    component: Index,
  },
  {
    path: '/server',
    name: 'Server Chat',
    component: () => import('@/pages/ServerChat.vue'),
  }
  ],
})

export default router
