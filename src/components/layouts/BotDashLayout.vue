<script setup lang="ts">
import { NavBar } from '@/components/navbar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  ChartNoAxesColumn,
  ChevronsUpDownIcon,
  Mail,
  PlusIcon,
  Pointer,
  Server,
  Settings,
  Store,
  TriangleAlert,
  Trophy,
  Users,
  Vote,
  Webhook,
} from 'lucide-vue-next'
import { useRouteParams } from '@vueuse/router'
import { useBot, useCurrentUser } from '@/composables'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import type { BotScanResult } from '@/utils/types.ts'
import { Skeleton } from '@/components/ui/skeleton'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import scanBot, { getScanTypeColor } from '@/utils/botScanner.ts'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const currentBotId = useRouteParams<string>('id')
const { bot: currentBot } = useBot(currentBotId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const { userBots } = useCurrentUser()
const { t } = useI18n()
const breakpoints = useBreakpoints(breakpointsTailwind)

const largerThanMd = breakpoints.greater('md')
const scanResults = ref<{ [botId: string]: BotScanResult }>({})

const statsRangeQuery = computed(() =>
  statsRange.value.start && statsRange.value.end
    ? `?start=${statsRange.value.start.toString()}&end=${statsRange.value.end}`
    : '',
)

const sidebarItems = computed(() => [
  {
    title: t('pages.dash.layout.sidebar.links.stats'),
    children: [
      {
        title: t('pages.dash.layout.sidebar.links.interactions'),
        icon: Pointer,
        to: `/dash/bots/:id/interactions${statsRangeQuery.value}`,
      },
      {
        title: t('pages.dash.layout.sidebar.links.guilds'),
        icon: Server,
        to: `/dash/bots/:id/guilds${statsRangeQuery.value}`,
      },
      {
        title: t('pages.dash.layout.sidebar.links.users'),
        icon: Users,
        to: `/dash/bots/:id/users${statsRangeQuery.value}`,
      },
      { title: t('pages.dash.layout.sidebar.links.votes'), icon: Vote, to: '/dash/bots/:id/votes' },
      {
        title: t('pages.dash.layout.sidebar.links.customEvents'),
        icon: ChartNoAxesColumn,
        to: `/dash/bots/:id/custom-events${statsRangeQuery.value}`,
      },
    ],
  },
  {
    title: t('pages.dash.layout.sidebar.links.achievements'),
    children: [
      {
        title: t('pages.dash.layout.sidebar.links.myAchievements'),
        icon: Trophy,
        to: '/dash/bots/:id/achievements',
      },
      {
        title: t('pages.dash.layout.sidebar.links.communityStore'),
        icon: Store,
        to: '/community/achievements',
      },
    ],
  },
  {
    title: t('pages.dash.layout.sidebar.links.settings'),
    children: [
      {
        title: t('pages.dash.layout.sidebar.links.general'),
        icon: Settings,
        to: '/dash/bots/:id/settings/general',
      },
      {
        title: t('pages.dash.layout.sidebar.links.emailReports'),
        icon: Mail,
        to: '/dash/bots/:id/settings/reports',
      },
      {
        title: t('pages.dash.layout.sidebar.links.integrations'),
        icon: Webhook,
        to: '/dash/bots/:id/settings/integrations',
        tag: 'NEW',
      },
      {
        title: t('pages.dash.layout.sidebar.links.dangerZone'),
        icon: TriangleAlert,
        to: '/dash/bots/:id/settings/danger-zone',
      },
    ],
  },
])

async function scanBots() {
  for (const bot of userBots.value) {
    if (scanResults.value[bot.botId]) continue
    scanResults.value[bot.botId] = await scanBot(bot)
  }
}

onMounted(async () => {
  await scanBots()
})

watch(userBots, async () => {
  await scanBots()
})
</script>

<template>
  <main class="h-screen max-h-screen">
    <NavBar class="max-w-425 mx-auto px-4" />
    <div v-if="currentBot" class="border-t" :key="currentBotId">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger class="w-full">
                    <SidebarMenuButton size="lg" class="justify-between gap-2 cursor-pointer">
                      <div class="flex items-center gap-1">
                        <DiscordAvatar
                          :id="currentBot.botId"
                          :alt="currentBot.username"
                          :avatar="currentBot.avatar"
                          size="sm"
                        />
                        <div class="flex flex-col text-left text-sm gap-1">
                          <span class="truncate font-semibold">{{ currentBot.username }}</span>
                          <div v-if="scanResults[currentBotId]" class="flex items-center gap-1">
                            <span
                              :class="`h-2 w-2 rounded-full ${getScanTypeColor(scanResults[currentBotId]!.type)}`"
                            />
                            <span class="truncate text-xs">
                              {{ scanResults[currentBotId]!.title }}
                            </span>
                          </div>
                          <div v-else class="flex items-center gap-1">
                            <Skeleton class="h-2 w-2" />
                            <Skeleton class="h-2 w-20" />
                          </div>
                        </div>
                      </div>
                      <ChevronsUpDownIcon />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    :side="largerThanMd ? 'right' : 'bottom'"
                    class="w-(--reka-dropdown-menu-trigger-width)"
                  >
                    <DropdownMenuLabel>
                      {{ $t('pages.dash.layout.sidebar.selector.myBots') }}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <RouterLink
                      v-for="bot in userBots"
                      :to="`/dash/bots/${bot.botId}`"
                      :key="bot.botId"
                    >
                      <DropdownMenuItem class="gap-2 p-2">
                        <DiscordAvatar
                          :id="bot.botId"
                          :alt="bot.username"
                          :avatar="bot.avatar"
                          size="sm"
                        />
                        <div class="flex flex-col text-left text-sm gap-1">
                          <span class="truncate font-semibold">{{ bot.username }}</span>
                          <div v-if="scanResults[bot.botId]" class="flex items-center gap-1">
                            <span
                              :class="`h-2 w-2 rounded-full ${getScanTypeColor(scanResults[bot.botId]!.type)}`"
                            />
                            <span class="truncate text-xs">
                              {{ scanResults[bot.botId]!.title }}
                            </span>
                          </div>
                          <div v-else class="flex items-center gap-1">
                            <Skeleton class="h-2 w-2" />
                            <Skeleton class="h-2 w-20" />
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </RouterLink>
                    <DropdownMenuSeparator />
                    <RouterLink to="/dash/onboarding">
                      <DropdownMenuItem class="gap-2 p-2">
                        <div
                          class="flex size-6 items-center justify-center rounded-md border bg-transparent"
                        >
                          <PlusIcon />
                        </div>
                        <div class="font-medium text-muted-foreground">
                          {{ $t('pages.dash.layout.sidebar.selector.addBot') }}
                        </div>
                      </DropdownMenuItem>
                    </RouterLink>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup v-for="group in sidebarItems" :key="group.title">
              <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem v-for="item in group.children" :key="item.title">
                    <SidebarMenuButton as-child>
                      <RouterLink v-if="item.to" :to="item.to.replace(/:id/g, currentBotId)">
                        <component v-if="item.icon" :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <Badge v-if="item.tag" class="rounded-full hover:bg-primary">
                          {{ item.tag }}
                        </Badge>
                      </RouterLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset class="p-4 max-h-[calc(100vh-6.25rem)] overflow-y-scroll pb-16">
          <header class="flex md:items-center justify-between">
            <SidebarTrigger />
            <slot name="header" />
          </header>
          <slot
            v-if="
              (currentBot.framework && currentBot.language && currentBot.lastPush) ||
              route.path.includes('/settings')
            "
          />
          <Empty v-else class="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>{{ $t('pages.dash.layout.notConfigured.title') }}</EmptyTitle>
              <EmptyDescription>
                {{ $t('pages.dash.layout.notConfigured.description') }}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <RouterLink :to="`/dash/onboarding?botId=${currentBotId}`">
                <Button>{{ $t('pages.dash.layout.notConfigured.button') }}</Button>
              </RouterLink>
            </EmptyContent>
          </Empty>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </main>
</template>
