<script setup lang="ts">
import SidebarLayout from '@/components/layouts/SidebarLayout.vue'
import { computed } from 'vue'
import { Bell, CreditCard, IdCard, MonitorSmartphone, TriangleAlert } from 'lucide-vue-next'
import { SidebarTrigger } from '@/components/ui/sidebar'

const sidebarItems = computed(() => [
  {
    title: 'Account',
    children: [
      {
        title: 'Account Informations',
        icon: IdCard,
        to: `/dash/account`,
      },
      {
        title: 'Invitations',
        icon: Bell,
        to: `/dash/account/invitations`,
      },
      {
        title: 'Usage',
        icon: CreditCard,
        to: `/dash/account/usage`,
      },
    ],
  },
  {
    title: 'Security',
    children: [
      {
        title: 'Sessions',
        icon: MonitorSmartphone,
        to: `/dash/account/sessions`,
      },
      {
        title: 'Danger Zone',
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
        class="flex md:items-center justify-between sticky top-0 bg-background w-full z-50 p-4"
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
