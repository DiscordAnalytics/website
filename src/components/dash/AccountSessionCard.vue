<script setup lang="ts">
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'
import { Spinner } from '@/components/ui/spinner'
import CustomIcon from '@/components/CustomIcon.vue'
import type { OAuthSession } from '@/utils/types.ts'
import { computed } from 'vue'
import { timeAgo } from '@/utils/dateTime.ts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps<{
  session: OAuthSession
  isLoading: boolean
  current?: boolean
}>()

defineEmits<{
  (event: 'revoke', sessionId: string): void
}>()

const os = computed(() => {
  const userAgent = props.session.userAgent?.toLowerCase() ?? ''

  if (userAgent.includes('linux')) return 'linux'
  else if (userAgent.includes('macintosh')) return 'macos'
  else if (userAgent.includes('windows')) return 'windows'
  else if (userAgent.includes('android')) return 'android'
  else if (userAgent.includes('iphone')) return 'ios'
  else return undefined
})

const osName = computed(() => {
  switch (os.value) {
    case 'linux':
      return 'Linux'
    case 'macos':
      return 'MacOS'
    case 'windows':
      return 'Windows'
    case 'android':
      return 'Android'
    case 'ios':
      return 'iOS'
    default:
      return ''
  }
})
</script>

<template>
  <Item :key="session.sessionId" variant="outline">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <ItemMedia variant="icon" class="h-14 w-14">
            <CustomIcon v-if="os" :icon="os" class="h-8! w-8!" />
          </ItemMedia>
        </TooltipTrigger>
        <TooltipContent v-if="os === 'linux'">I use arch btw</TooltipContent>
        <TooltipContent v-else-if="os === 'windows'">Windows sucks bro</TooltipContent>
        <TooltipContent v-else-if="os === 'macos'">
          $799 wheels not included with you $10k computer
        </TooltipContent>
        <TooltipContent v-else-if="os === 'ios'">Powered by Apple Intelligence</TooltipContent>
        <TooltipContent v-else-if="os === 'android'">rooted, obviously</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <ItemContent>
      <ItemTitle>{{ osName ?? session.ipAddress ?? session.sessionId }}</ItemTitle>
      <ItemDescription v-if="session.userAgent">{{ session.userAgent }}</ItemDescription>
      <ItemDescription>
        {{ session.ipAddress }}
        -
        {{ $t('pages.dash.account.sessions.createdAt') }} {{ timeAgo(session.createdAt) }}
        -
        {{ $t('pages.dash.account.sessions.lastUsedAt') }}
        {{
          session.lastUsedAt ? timeAgo(session.lastUsedAt) : $t('pages.dash.account.sessions.never')
        }}
      </ItemDescription>
    </ItemContent>
    <ItemActions v-if="!$props.current">
      <Button
        variant="destructive"
        size="icon"
        :disabled="isLoading"
        @click="$emit('revoke', $props.session.sessionId)"
      >
        <Spinner v-if="isLoading" />
        <XIcon v-else />
      </Button>
    </ItemActions>
  </Item>
</template>
