<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue'
import { useBotStats } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { calculateInteractions } from '@/utils/statsManager.ts'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import { LineChart, PieChart } from '@/components/charts'
import type { ChartConfig } from '@/utils/types.ts'
import StatsPage from '@/components/dash/StatsPage.vue'
import { useI18n } from 'vue-i18n'

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const { t } = useI18n()

const interactionsData = computed(() =>
  stats.value && statsRange.value
    ? calculateInteractions(stats.value.stats, statsRange.value)
    : null,
)
const isLoading = ref<boolean>(false)

const charts = computed((): ChartConfig[] => [
  {
    title: t('pages.dash.stats.charts.interactions.evolution'),
    data: interactionsData.value?.allInteractionsEvolution ?? [],
    tabs: [{ id: 'Interactions', label: 'Interactions' }],
    component: LineChart,
    colSpan: 2,
    getValue: (data) => data.reduce((sum, e) => sum + (e.Interactions as number), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.Interactions as number), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.interactions.mostUsed'),
    data: interactionsData.value?.mostUsedInteractions ?? [],
    tabs: Object.keys(interactionsData.value?.mostUsedInteractions[0] ?? {})
      .filter((key) => key !== 'date')
      .map((key) => ({ id: key, label: key })),
    component: LineChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.interactions.typesPie'),
    data: interactionsData.value?.interactionsTypesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.interactions.mostUsedCommands'),
    data: interactionsData.value?.mostUsedCommands ?? [],
    tabs: Object.keys(interactionsData.value?.mostUsedCommands[0] ?? {})
      .filter((key) => key !== 'date')
      .map((key) => ({ id: key, label: key })),
    component: LineChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.interactions.commandsTypesPie'),
    data: interactionsData.value?.commandsTypesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.interactions.mostUsedComponents'),
    data: interactionsData.value?.mostUsedComponents ?? [],
    tabs: Object.keys(interactionsData.value?.mostUsedComponents[0] ?? {})
      .filter((key) => key !== 'date')
      .map((key) => ({ id: key, label: key })),
    component: LineChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.interactions.mostUsedModals'),
    data: interactionsData.value?.mostUsedModals ?? [],
    tabs: Object.keys(interactionsData.value?.mostUsedModals[0] ?? {})
      .filter((key) => key !== 'date')
      .map((key) => ({ id: key, label: key })),
    component: LineChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0) === 0,
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
