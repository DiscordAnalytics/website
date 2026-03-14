<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue'
import { useBotStats } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { calculateVotes } from '@/utils/statsManager.ts'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import type { ChartConfig, ChartData } from '@/utils/types.ts'
import StatsPage from '@/components/StatsPage.vue'
import { useI18n } from 'vue-i18n'
import { LineChart, PieChart } from '@/components/charts'

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const { t } = useI18n()

const votesData = computed(() =>
  stats.value && statsRange.value ? calculateVotes(stats.value.votes, statsRange.value) : null,
)
const isLoading = ref<boolean>(false)

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

watch(statsRange, async (value, oldValue) => {
  if (value.start !== oldValue.start || value.end !== oldValue.end) {
    isLoading.value = true
    await fetchStats(value)
    isLoading.value = false
  }
})
</script>

<template>
  <StatsPage :charts="charts" :is-loading="isLoading" />
</template>
