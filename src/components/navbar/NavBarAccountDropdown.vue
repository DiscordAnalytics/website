<script setup lang="ts">
import useCurrentUser from '../../composables/useCurrentUser.ts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { ChartLineIcon, LogOutIcon, ShieldIcon } from 'lucide-vue-next'

const { userInfos, logout } = useCurrentUser()
</script>

<template>
  <DropdownMenu v-if="userInfos">
    <DropdownMenuTrigger class="cursor-pointer">
      <DiscordAvatar
        :id="userInfos.userId"
        :alt="userInfos.username"
        :avatar="userInfos.avatar"
        :avatar-decoration="userInfos.avatarDecoration"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ userInfos.username }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <RouterLink to="/dash">
        <DropdownMenuItem class="cursor-pointer">
          <ChartLineIcon class="mr-2 h-4 w-4" />
          <span>{{ $t('components.navbar.account.links.dashboard') }}</span>
        </DropdownMenuItem>
      </RouterLink>
      <RouterLink to="/admin">
        <DropdownMenuItem class="cursor-pointer">
          <ShieldIcon class="mr-2 h-4 w-4" />
          <span>{{ $t('components.navbar.account.links.admin') }}</span>
        </DropdownMenuItem>
      </RouterLink>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="logout()">
        <LogOutIcon class="mr-2 h-4 w-4" />
        <span>{{ $t('components.navbar.account.logout') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
