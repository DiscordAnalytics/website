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
import StatsPage from '@/components/StatsPage.vue'

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>

const interactionsData = computed(() =>
  stats.value && statsRange.value
    ? calculateInteractions(stats.value.stats, statsRange.value)
    : null,
)
const isLoading = ref<boolean>(false)

const charts = computed((): ChartConfig[] => [
  {
    title: 'Evolution of interactions',
    description: 'All the received interactions of your bot',
    data: interactionsData.value?.allInteractionsEvolution ?? [],
    tabs: [{ id: 'Interactions', label: 'Interactions' }],
    component: LineChart,
    colSpan: 2,
    getValue: (data) => data.reduce((sum, e) => sum + (e.Interactions as number), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.Interactions as number), 0) === 0,
  },
  {
    title: 'Most Used Interactions',
    description: 'Chart of the 3 most used interactions',
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
    title: 'Most Used interactions by type',
    description: 'Pie of the most used interactions types',
    data: interactionsData.value?.interactionsTypesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: 'Most Used commands',
    description: 'Chart of the 3 most used commands',
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
    title: 'Most Used commands by type',
    description: 'Pie of the most used commands types',
    data: interactionsData.value?.commandsTypesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: 'Most Used components',
    description: 'Chart of the 3 most used components',
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
    title: 'Most Used modals',
    description: 'Chart of the 3 most used modals',
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
    setTimeout(async () => {
      await fetchStats(value)
      isLoading.value = false
    }, 1000)
  }
})
</script>

<template>
  <StatsPage :charts="charts" :is-loading="isLoading" />
</template>
