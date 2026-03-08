<script setup lang="ts">
import {
  NavBarAccountDropdown,
  NavBarCustomizePopUp,
  NavBarLinks,
  NavBarLocaleSelector,
  NavBarLogo,
} from '.'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/composables/useCurrentUser.ts'
import { onBeforeMount } from 'vue'
import NavBarMobileSheet from '@/components/navbar/NavBarMobileSheet.vue'
import { MenuIcon } from 'lucide-vue-next'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

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
