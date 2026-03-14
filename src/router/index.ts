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
    {
      path: '/blog/:articleId',
      component: () => import('@/views/blog/ArticlesReader.vue'),
    },
    {
      path: '/dash',
      component: () => import('@/views/dash/DashHome.vue'),
    },
    {
      path: '/dash/onboarding',
      component: () => import('@/views/dash/DashOnboarding.vue'),
    },
    {
      path: '/dash/bots/:id',
      redirect(to) {
        return `/dash/bots/${to.params.id}/interactions`
      },
    },
    {
      path: '/dash/bots/:id/interactions',
      component: () => import('@/views/dash/bots/BotInteractions.vue'),
    },
    {
      path: '/dash/bots/:id/guilds',
      component: () => import('@/views/dash/bots/BotGuilds.vue'),
    },
    {
      path: '/dash/bots/:id/users',
      component: () => import('@/views/dash/bots/BotUsers.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const { userInfos, fetch: fetchUser } = useCurrentUser()
  if ((to.path.startsWith('/dash') || to.path.startsWith('/admin')) && !userInfos.value) {
    try {
      await fetchUser()
    } catch {
      return `/auth?redirect=${encodeURI(to.fullPath)}`
    }
  }
})

export default router
