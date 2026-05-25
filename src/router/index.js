import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ych',
      name: 'YchGame',
      component: () => import('@/components/YchGame.vue'),
    },
    {
      path: '/family',
      name: 'FamilyPuzzle',
      component: () => import('@/components/FamilyPuzzle.vue'),
    },
  ],
})

export default router
