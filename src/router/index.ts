import { createRouter, createWebHistory } from 'vue-router'
import useCurrentUser from '@/composables/useCurrentUser.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/auth',
      component: () => import('@/views/AuthView.vue'),
    },
    {
      path: '/blog',
      component: () => import('@/views/blog/ArticlesList.vue'),
    },
  ],
})

router.beforeEach(async (to, from) => {
  const { userInfos, fetch: fetchUser } = useCurrentUser()
  if ((to.path.startsWith('/dash') || to.path.startsWith('/admin')) && !userInfos) {
    try {
      await fetchUser()
    } catch (error) {
      return { path: '/auth' }
    }
  }
})

export default router
