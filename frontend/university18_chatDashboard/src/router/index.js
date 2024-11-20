import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/server',
    },
    {
      path: '/server/:client/:examinerName/:examinerUsername',
      name: 'Server Chat',
      component: () => import('../pages/ServerChat.vue'),
      props: true, // Pass route params as props
    }
  ],
})

export default router
