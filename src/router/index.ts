import { useLocalStorage } from '@vueuse/core'
import { createRouter, createWebHistory } from 'vue-router'

import { useCurrentUser } from '@/composables'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/features/graphs',
      component: () => import('@/views/features/GraphsFeature.vue'),
    },
    {
      path: '/features/custom-graphs',
      component: () => import('@/views/features/CustomGraphsFeature.vue'),
    },
    {
      path: '/features/votes',
      component: () => import('@/views/features/VotesFeature.vue'),
    },
    {
      path: '/features/achievements',
      component: () => import('@/views/features/AchievementsFeature.vue'),
    },
    {
      path: '/features/teams',
      component: () => import('@/views/features/TeamsFeature.vue'),
    },
    {
      path: '/features/:slug',
      component: () => import('@/views/features/FeatureNotFound.vue'),
    },
    {
      path: '/pricing',
      component: () => import('@/views/PricingView.vue'),
    },
    {
      path: '/self-hosting',
      component: () => import('@/views/SelfHostingView.vue'),
    },
    {
      path: '/app-monetization-explorer',
      component: () => import('@/views/MonetizationExplorer.vue'),
    },
    {
      path: '/docs/api',
      component: () => import('@/views/ApiDocs.vue'),
    },
    {
      path: '/support',
      component: () => import('@/views/RedirectionView.vue'),
    },
    {
      path: '/status',
      component: () => import('@/views/RedirectionView.vue'),
    },
    {
      path: '/github',
      component: () => import('@/views/RedirectionView.vue'),
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
      path: '/invitations/:id',
      component: () => import('@/views/TeamInvitationView.vue'),
    },
    {
      path: '/community/achievements',
      component: () => import('@/views/AchievementsStore.vue'),
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
    {
      path: '/dash/bots/:id/votes',
      component: () => import('@/views/dash/bots/BotVotes.vue'),
    },
    {
      path: '/dash/bots/:id/custom-events',
      component: () => import('@/views/dash/bots/BotCustomEvents.vue'),
    },
    {
      path: '/dash/bots/:id/achievements',
      component: () => import('@/views/dash/bots/BotAchievements.vue'),
    },
    {
      path: '/dash/bots/:id/settings',
      redirect(to) {
        return `/dash/bots/${to.params.id}/settings/general`
      },
    },
    {
      path: '/dash/bots/:id/settings/general',
      component: () => import('@/views/dash/bots/settings/BotGeneralSettings.vue'),
    },
    {
      path: '/dash/bots/:id/settings/reports',
      component: () => import('@/views/dash/bots/settings/BotReportsSettings.vue'),
    },
    {
      path: '/dash/bots/:id/settings/votes-configuration',
      component: () => import('@/views/dash/bots/settings/BotVotesSettings.vue'),
    },
    {
      path: '/dash/bots/:id/settings/danger-zone',
      component: () => import('@/views/dash/bots/settings/BotDangerZone.vue'),
    },
    {
      path: '/dash/account',
      component: () => import('@/views/dash/account/AccountInfos.vue'),
    },
    {
      path: '/dash/account/invitations',
      component: () => import('@/views/dash/account/AccountInvitations.vue'),
    },
    {
      path: '/dash/account/sessions',
      component: () => import('@/views/dash/account/AccountSessions.vue'),
    },
    {
      path: '/dash/account/danger-zone',
      component: () => import('@/views/dash/account/AccountDangerZone.vue'),
    },
    {
      path: '/dash/admin',
      redirect() {
        return `/dash/admin/users`
      },
    },
    {
      path: '/dash/admin/users',
      component: () => import('@/views/dash/admin/AdminUsers.vue'),
    },
    {
      path: '/dash/admin/users/:id',
      component: () => import('@/views/dash/admin/AdminUser.vue'),
    },
    {
      path: '/dash/admin/bots',
      component: () => import('@/views/dash/admin/AdminBots.vue'),
    },
    {
      path: '/dash/admin/bots/:id',
      component: () => import('@/views/dash/admin/AdminBot.vue'),
    },
    {
      path: '/dash/admin/invitations',
      component: () => import('@/views/dash/admin/AdminInvitations.vue'),
    },
    {
      path: '/dash/admin/blog',
      component: () => import('@/views/dash/admin/AdminArticles.vue'),
    },
    {
      path: '/dash/admin/blog/:tag',
      component: () => import('@/views/dash/admin/AdminArticle.vue'),
    },
    {
      path: '/dash/admin/achievements',
      component: () => import('@/views/dash/admin/AdminAchievements.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Error404.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.params.id === 'demo-bot' && to.path.includes('/settings')) {
    return '/dash/bots/demo-bot/teammates'
  }
  if (to.params.id && to.params.id !== 'demo-bot' && useLocalStorage('sandbox_demo', false).value) {
    useLocalStorage('sandbox_demo', false).value = false
  }
  const { userInfos, fetch: fetchUser } = useCurrentUser()
  if (to.path.startsWith('/dash') && !userInfos.value) {
    try {
      await fetchUser()
    } catch {
      return `/auth?redirect=${encodeURI(to.fullPath)}`
    }
  }
  if (to.path.startsWith('/dash/admin') && !userInfos.value?.admin) return '/dash'
})

export default router
