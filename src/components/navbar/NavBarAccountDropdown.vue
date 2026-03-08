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
import { ChartLineIcon, ChevronsUpDownIcon, LogOutIcon, ShieldIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{
  mobile?: boolean
}>()

const { userInfos, logout } = useCurrentUser()
</script>

<template>
  <DropdownMenu v-if="userInfos">
    <DropdownMenuTrigger class="cursor-pointer w-full">
      <Button v-if="$props.mobile" variant="outline" class="justify-between w-full h-12">
        <div class="flex items-center gap-2">
          <DiscordAvatar
            :id="userInfos.userId"
            :alt="userInfos.username"
            :avatar="userInfos.avatar"
            :avatar-decoration="userInfos.avatarDecoration"
            size="sm"
          />
          {{ userInfos.username }}
        </div>
        <ChevronsUpDownIcon />
      </Button>
      <DiscordAvatar
        v-else
        :id="userInfos.userId"
        :alt="userInfos.username"
        :avatar="userInfos.avatar"
        :avatar-decoration="userInfos.avatarDecoration"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-(--reka-dropdown-menu-trigger-width)">
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
