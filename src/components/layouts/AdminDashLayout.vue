<script setup lang="ts">
import SidebarLayout from '@/components/layouts/SidebarLayout.vue'
import { computed } from 'vue'
import { Bot, HomeIcon, Mails, Rss, Trophy, Users } from '@lucide/vue'
import { SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sidebarItems = computed(() => [
  {
    title: t('pages.dash.admin.layout.administration'),
    children: [
      {
        title: t('pages.dash.admin.layout.bots'),
        icon: Bot,
        to: `/dash/admin/bots`,
      },
      {
        title: t('pages.dash.admin.layout.users'),
        icon: Users,
        to: `/dash/admin/users`,
      },
      {
        title: t('pages.dash.admin.layout.invitations'),
        icon: Mails,
        to: `/dash/admin/invitations`,
      },
    ],
  },
  {
    title: t('pages.dash.admin.layout.content'),
    children: [
      {
        title: t('pages.dash.admin.layout.blog'),
        icon: Rss,
        to: `/dash/admin/blog`,
      },
      {
        title: t('pages.dash.admin.layout.achievements'),
        icon: Trophy,
        to: `/dash/admin/achievements`,
      },
    ],
  },
])
</script>

<template>
  <SidebarLayout :items="sidebarItems">
    <template #header>
      <SidebarMenuItem>
        <SidebarMenuButton as-child>
          <RouterLink to="/dash">
            <HomeIcon />
            <span>{{ $t('pages.dash.admin.layout.goback') }}</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </template>

    <template #inset>
      <header
        class="flex md:items-center justify-between sticky top-0 bg-background w-full z-40 p-4"
      >
        <SidebarTrigger />
        <slot name="header" />
      </header>
      <main class="px-4">
        <slot />
      </main>
    </template>
  </SidebarLayout>
</template>
