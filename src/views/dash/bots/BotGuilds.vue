<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue'
import { useBotStats, useLocale } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { calculateGuilds } from '@/utils/statsManager.ts'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import type { ChartConfig, ChartData } from '@/utils/types.ts'
import StatsPage from '@/components/StatsPage.vue'
import { useI18n } from 'vue-i18n'
import { BarChart, LineChart, PieChart, TableChart } from '@/components/charts'
import { TableHead, TableRow } from '@/components/ui/table'

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const { t } = useI18n()
const { getLocaleName } = useLocale()

const guildsData = computed(() =>
  stats.value && statsRange.value ? calculateGuilds(stats.value.stats, statsRange.value) : null,
)
const isLoading = ref<boolean>(false)

const defaultGetValue = (
  data: (ChartData | Omit<ChartData, 'date'>)[],
  currentTab: string,
): number => (data[data.length - 1]?.[currentTab] as number) ?? 0

const defaultIsEmpty = (
  data: (ChartData | Omit<ChartData, 'date'>)[],
  currentTab: string,
): boolean => data.every((d) => ((d[currentTab] as number) ?? 0) === 0)

const charts = computed((): ChartConfig[] => [
  {
    title: t('pages.dash.stats.charts.guilds.evolution'),
    data: guildsData.value?.guildsEvolution ?? [],
    tabs: [{ id: 'Guilds', label: 'Guilds' }],
    component: LineChart,
    colSpan: 2,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.guilds.localesEvolution'),
    data: guildsData.value?.guildsLocalesEvolution ?? [],
    tabs: Object.keys(guildsData.value?.guildsLocalesEvolution[0] ?? {})
      .filter((key) => key !== 'date')
      .map((key) => ({ id: key, label: getLocaleName(key) ?? key })),
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.guilds.localesPie'),
    data: guildsData.value?.guildsLocalesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.guilds.localesPie'),
    data: guildsData.value?.guildsSizeDistribution ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.guilds.addsAndRemoves'),
    description: ' ',
    data: guildsData.value?.addsAndRemoves ?? [],
    tabs: [
      { id: 'Additions', label: 'Additions' },
      { id: 'Removals', label: 'Removals' },
    ],
    component: BarChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
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
  <StatsPage :charts="charts" :is-loading="isLoading">
    <TableChart
      :title="$t('pages.dash.stats.charts.guilds.biggestGuildsRank.title')"
      :is-loading="isLoading"
      :data="guildsData ? guildsData.biggestGuildsRank : []"
    >
      <template #header>
        <TableRow>
          <TableHead>{{ $t('pages.dash.stats.charts.guilds.biggestGuildsRank.guild') }}</TableHead>
          <TableHead>
            {{ $t('pages.dash.stats.charts.guilds.biggestGuildsRank.members') }}
          </TableHead>
        </TableRow>
      </template>
    </TableChart>
    <TableChart
      :title="$t('pages.dash.stats.charts.guilds.mostActiveGuildsRank.title')"
      :is-loading="isLoading"
      :data="guildsData ? guildsData.mostActiveGuildsRank : []"
    >
      <template #header>
        <TableRow>
          <TableHead>{{ $t('pages.dash.stats.charts.guilds.biggestGuildsRank.guild') }}</TableHead>
          <TableHead>
            {{ $t('pages.dash.stats.charts.guilds.mostActiveGuildsRank.interactions') }}
          </TableHead>
        </TableRow>
      </template>
    </TableChart>
  </StatsPage>
</template>
