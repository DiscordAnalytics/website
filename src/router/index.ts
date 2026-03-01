import { createRouter, createWebHistory } from 'vue-router'
import useCurrentUser from '@/composables/useCurrentUser.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const { userInfos, fetch: fetchUser } = useCurrentUser()
  if ((to.path.startsWith('/dash') || to.path.startsWith('/admin')) && !userInfos) {
    try {
      await fetchUser()
      next()
    } catch (error) {
      return { path: '/auth' }
    }
  } else next()
})

export default router
