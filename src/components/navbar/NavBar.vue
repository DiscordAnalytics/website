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

const { userInfos, fetch: fetchCurrentUser } = useCurrentUser()

onBeforeMount(() => {
  if (!userInfos.value) fetchCurrentUser().catch(() => {})
})
</script>

<template>
  <nav
    class="flex md:items-center justify-between px-8 py-4 w-full md:flex-row flex-col gap-2 relative z-50"
  >
    <NavBarLogo />

    <NavBarLinks />

    <div class="flex items-center gap-2">
      <NavBarCustomizePopUp />
      <NavBarLocaleSelector />
      <RouterLink v-if="!userInfos" to="/auth">
        <Button>
          {{ $t('components.navbar.account.login') }}
        </Button>
      </RouterLink>
      <NavBarAccountDropdown v-else />
    </div>
  </nav>
</template>
