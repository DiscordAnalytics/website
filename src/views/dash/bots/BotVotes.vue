<script setup lang="ts">
import { computed, type Ref, watch } from 'vue'
import { useBotStats, useLoading } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { calculateVotes } from '@/utils/statsManager.ts'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import type { ChartConfig, ChartData } from '@/utils/types.ts'
import StatsPage from '@/components/dash/StatsPage.vue'
import { useI18n } from 'vue-i18n'
import { LineChart, PieChart } from '@/components/charts'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon, InfoIcon, XIcon } from 'lucide-vue-next'
import { useLocalStorage } from '@vueuse/core'

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const { t } = useI18n()
const maskedPopups = useLocalStorage<string[]>('maskedPopups', [])

const votesData = computed(() =>
  stats.value && statsRange.value ? calculateVotes(stats.value.votes, statsRange.value) : null,
)
const { isLoading, withLoading } = useLoading()

const defaultGetValue = (data: (ChartData | Omit<ChartData, 'date'>)[]): number =>
  data.reduce((sum, e) => sum + (e.Votes as number), 0)

const defaultIsEmpty = (
  data: (ChartData | Omit<ChartData, 'date'>)[],
  currentTab: string,
): boolean => data.every((d) => ((d[currentTab] as number) ?? 0) === 0)

const charts = computed((): ChartConfig[] => [
  {
    title: t('pages.dash.stats.charts.votes.evolution'),
    data: votesData.value?.allVotesEvolution ?? [],
    tabs: [{ id: 'Votes', label: 'Votes' }],
    component: LineChart,
    colSpan: 2,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.votes.pie'),
    data: votesData.value?.votesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.votes.providerEvolution', { provider: 'Top.gg' }),
    data: votesData.value?.topggVotesEvolution ?? [],
    tabs: [{ id: 'Votes', label: 'Votes' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.votes.providerEvolution', { provider: 'BotList.me' }),
    data: votesData.value?.botlistmeVotesEvolution ?? [],
    tabs: [{ id: 'Votes', label: 'Votes' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.votes.providerEvolution', { provider: 'Discord Bot List' }),
    data: votesData.value?.dblistVotesEvolution ?? [],
    tabs: [{ id: 'Votes', label: 'Votes' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.votes.providerEvolution', { provider: 'Discord Place' }),
    data: votesData.value?.discordplaceVotesEvolution ?? [],
    tabs: [{ id: 'Votes', label: 'Votes' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.votes.providerEvolution', { provider: 'Discords.com' }),
    data: votesData.value?.discordscomVotesEvolution ?? [],
    tabs: [{ id: 'Votes', label: 'Votes' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
])

const areAllChartEmpty = computed(() =>
  charts.value.some((chart) =>
    chart.isEmpty(
      chart.data,
      chart.tabs[0]?.id ?? Object.keys(chart.data[0] ?? {}).filter((k) => k !== 'date')[0]!,
    ),
  ),
)

watch(statsRange, async (value, oldValue) => {
  if (value.start !== oldValue.start || value.end !== oldValue.end) {
    await withLoading(async () => {
      await fetchStats(value)
    })
  }
})
</script>

<template>
  <StatsPage :charts="charts" :is-loading="isLoading">
    <template v-if="areAllChartEmpty && !maskedPopups.includes('votesStatsWarning')" #alerts>
      <Item
        variant="muted"
        class="mt-4 flex-col md:flex-row items-center text-center md:text-start"
      >
        <ItemMedia variant="icon" class="mx-auto">
          <InfoIcon />
        </ItemMedia>
        <ItemContent class="items-center md:items-start">
          <ItemTitle>{{ $t('pages.dash.stats.charts.votes.alert.title') }}</ItemTitle>
          <ItemDescription>
            {{ $t('pages.dash.stats.charts.votes.alert.description') }}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <a href="/docs/get-started/votes-integration" target="_blank">
            <Button size="sm" variant="outline">
              {{ $t('pages.dash.stats.charts.votes.alert.button') }}
              <ExternalLinkIcon />
            </Button>
          </a>
          <Button size="icon-sm" variant="ghost" @click="maskedPopups.push('votesStatsWarning')">
            <XIcon />
          </Button>
        </ItemActions>
      </Item>
    </template>
  </StatsPage>
</template>
