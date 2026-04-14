<script setup lang="ts">
import { computed, type Ref, watch } from 'vue'
import { useBotStats, useLoading, useLocale } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { calculateUsers } from '@/utils/statsManager.ts'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import type { ChartConfig, ChartData } from '@/utils/types.ts'
import StatsPage from '@/components/dash/StatsPage.vue'
import { useI18n } from 'vue-i18n'
import { BarChart, LineChart, PieChart } from '@/components/charts'
import { getDayOfWeek, parseDate } from '@internationalized/date'
import { dfWeekDay } from '@/utils/dateTime.ts'
import { InfoIcon, XIcon } from 'lucide-vue-next'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@vueuse/core'

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const { t } = useI18n()
const { getLocaleName } = useLocale()
const maskedPopups = useLocalStorage<string[]>('maskedPopups', [])
const { isLoading, withLoading } = useLoading()

const usersData = computed(() =>
  stats.value && statsRange.value ? calculateUsers(stats.value.stats, statsRange.value) : null,
)

const defaultGetValue = (
  data: (ChartData | Omit<ChartData, 'date'>)[],
  currentTab: string,
): number => (data[data.length - 1]?.[currentTab] as number) ?? 0

const defaultIsEmpty = (
  data: (ChartData | Omit<ChartData, 'date'>)[],
  currentTab: string,
): boolean => data.every((d) => ((d[currentTab] as number) ?? 0) === 0)

const toWeekDay = (date: Date) =>
  getDayOfWeek(parseDate(new Date(date).toISOString().slice(0, 10)), navigator.language)

const charts = computed((): ChartConfig[] => [
  {
    title: t('pages.dash.stats.charts.users.evolution'),
    data: usersData.value?.usersEvolution ?? [],
    tabs: [{ id: 'Users', label: 'Users' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.users.installsEvolution'),
    data: usersData.value?.userInstallEvolution ?? [],
    tabs: [{ id: 'Installations', label: 'Installations' }],
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.users.localesEvolution'),
    data: usersData.value?.usersLocalesEvolution ?? [],
    tabs: Object.keys(usersData.value?.usersLocalesEvolution[0] ?? {})
      .filter((key) => key !== 'date')
      .map((key) => ({ id: key, label: getLocaleName(key) ?? key })),
    component: LineChart,
    getValue: defaultGetValue,
    isEmpty: defaultIsEmpty,
  },
  {
    title: t('pages.dash.stats.charts.users.localesPie'),
    data: usersData.value?.usersLocalesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
  {
    title: t('pages.dash.stats.charts.users.activity'),
    description: ' ',
    data: (usersData.value?.activityOverTheWeek ?? []).map((e) => ({
      ...e,
      _origDate: e.date,
      date: toWeekDay(e.date),
    })),
    tabs: [{ id: 'Interactions', label: 'Interactions' }],
    component: BarChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: defaultIsEmpty,
    tickFormatter: (d: number | Date) => {
      const days = usersData.value?.activityOverTheWeek ?? []
      const entry = days.find((e) => toWeekDay(e.date) === d)
      if (!entry) return ''
      return dfWeekDay.format(new Date(entry.date))
    },
  },
  {
    title: t('pages.dash.stats.charts.users.types'),
    data: usersData.value?.usersTypesPie ?? [],
    tabs: [],
    component: PieChart,
    getValue: (data, currentTab) =>
      data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0),
    isEmpty: (data) => data.reduce((sum, e) => sum + (e.count as number), 0) === 0,
  },
])

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
    <template v-if="!maskedPopups.includes('usersStatsWarning')" #alerts>
      <Item
        variant="muted"
        class="mt-4 flex-col md:flex-row items-center text-center md:text-start"
      >
        <ItemMedia variant="icon" class="mx-auto">
          <InfoIcon />
        </ItemMedia>
        <ItemContent class="items-center md:items-start">
          <ItemTitle>{{ $t('pages.dash.stats.charts.users.alert.title') }}</ItemTitle>
          <ItemDescription class="line-clamp-none">
            {{ $t('pages.dash.stats.charts.users.alert.description') }}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon-sm" variant="ghost" @click="maskedPopups.push('usersStatsWarning')">
            <XIcon />
          </Button>
        </ItemActions>
      </Item>
    </template>
  </StatsPage>
</template>
