<script setup lang="ts">
import { Bell, IdCard, MonitorSmartphone, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SidebarLayout } from '@/components'
import { SidebarTrigger } from '@/components/ui'

const { t } = useI18n()

const sidebarItems = computed(() => [
  {
    title: t('pages.dash.account.layout.sidebar.account'),
    children: [
      {
        title: t('pages.dash.account.layout.sidebar.yourAccount'),
        icon: IdCard,
        to: `/dash/account`,
      },
      {
        title: t('pages.dash.account.layout.sidebar.invitations'),
        icon: Bell,
        to: `/dash/account/invitations`,
      },
    ],
  },
  {
    title: t('pages.dash.account.layout.sidebar.security'),
    children: [
      {
        title: t('pages.dash.account.layout.sidebar.sessions'),
        icon: MonitorSmartphone,
        to: `/dash/account/sessions`,
      },
      {
        title: t('pages.dash.account.layout.sidebar.dangerZone'),
        icon: TriangleAlert,
        to: `/dash/account/danger-zone`,
      },
    ],
  },
])
</script>

<template>
  <SidebarLayout :items="sidebarItems">
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
