<script setup lang="ts">
import { MenuIcon } from '@lucide/vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { onBeforeMount } from 'vue'

import {
  NavBarAccountDropdown,
  NavBarCustomizePopUp,
  NavBarLinks,
  NavBarLocaleSelector,
  NavBarLogo,
  NavBarMobileSheet,
} from '@/components'
import { Button } from '@/components/ui'
import { useCurrentUser } from '@/composables'

const breakpoints = useBreakpoints(breakpointsTailwind)
const { userInfos, fetch: fetchCurrentUser } = useCurrentUser()

const largerThanMd = breakpoints.greater('md')

onBeforeMount(() => {
  if (!userInfos.value) fetchCurrentUser().catch(() => {})
})
</script>

<template>
  <nav class="flex md:items-center justify-between py-4 w-full flex-row gap-2 relative z-50">
    <NavBarLogo />

    <NavBarLinks v-if="largerThanMd" />

    <div v-if="largerThanMd" class="flex items-center gap-2">
      <NavBarCustomizePopUp />
      <NavBarLocaleSelector />
      <RouterLink v-if="!userInfos" to="/auth">
        <Button>
          {{ $t('components.navbar.account.login') }}
        </Button>
      </RouterLink>
      <NavBarAccountDropdown v-else />
    </div>

    <NavBarMobileSheet v-if="!largerThanMd" class="block md:hidden">
      <Button variant="secondary" size="icon">
        <MenuIcon />
      </Button>
    </NavBarMobileSheet>
  </nav>
</template>
