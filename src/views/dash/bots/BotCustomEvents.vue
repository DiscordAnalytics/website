<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue'
import { useAnalytics, useBotCustomEvents, useBotStats, useLoading } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import type { ChartConfig, CustomEvent } from '@/utils/types.ts'
import StatsPage from '@/components/dash/StatsPage.vue'
import {
  formatCustomEventsStats,
  getRangeGranularity,
  getTickFormatter,
} from '@/utils/statsManager.ts'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { FrownIcon, PlusIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { LineChart } from '@/components/charts'
import CreateCustomEventDialog from '@/components/dash/CreateCustomEventDialog.vue'
import EditCustomEventDialog from '@/components/dash/EditCustomEventDialog.vue'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const botId = useRouteParams<string>('id')
const { stats, fetch: fetchStats } = useBotStats(botId)
const { statsRange: a } = storeToRefs(useStore())
const statsRange = a as Ref<DateRange>
const {
  events,
  fetch: fetchEvents,
  create: createCustomEvent,
  update: updateCustomEvent,
  remove: deleteCustomEvent,
} = useBotCustomEvents(botId)
const { capture } = useAnalytics()
const { isLoading, withLoading } = useLoading()

const editDialogOpen = ref(false)
const createDialogOpen = ref(false)
const editingEvent = ref<CustomEvent | null>(null)

const defaultGetValue = (data: Record<string, unknown>[], currentTab: string): number =>
  data.reduce((sum, e) => sum + ((e[currentTab] as number) ?? 0), 0)

const defaultIsEmpty = (data: Record<string, unknown>[], currentTab: string): boolean =>
  data.every((d) => ((d[currentTab] as number) ?? 0) === 0)

const eventsData = computed(() =>
  stats.value && statsRange.value
    ? formatCustomEventsStats(stats.value.stats, statsRange.value)
    : null,
)

const tickFormatter = computed(() => getTickFormatter(getRangeGranularity(statsRange.value)))

const charts = computed((): ChartConfig[] =>
  events.value && eventsData.value
    ? events.value.map((event) => ({
        title: event.graphName,
        data: eventsData.value!.map((entry) => ({
          date: entry.date,
          [event.eventKey]: entry[event.eventKey] as number,
        })),
        tabs: [{ id: event.eventKey, label: event.eventKey }],
        component: LineChart,
        getValue: defaultGetValue,
        isEmpty: defaultIsEmpty,
      }))
    : [],
)

const onSettingsClicked = (chart: ChartConfig) => {
  editingEvent.value = events.value.find((event) => chart.tabs[0]!.id === event.eventKey)!
  editDialogOpen.value = true
}

const onEventCreated = async (values: {
  eventKey: string
  graphName: string
  defaultMode: 'previous_hour' | 'fixed'
  defaultValue?: number | null
}) => {
  await withLoading(async () => {
    await createCustomEvent({
      eventKey: values.eventKey,
      graphName: values.graphName,
      defaultValue: values.defaultMode === 'fixed' ? values.defaultValue! : null,
    })
      .then(() => {
        toast.success(t('pages.dash.stats.charts.customEvents.toasts.created'))
        createDialogOpen.value = false
        capture('custom_event_created', { bot_id: botId.value, default_mode: values.defaultMode })
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
}

const onEventUpdated = async (eventKey: string, graphName: string) => {
  await withLoading(async () => {
    await updateCustomEvent(eventKey, graphName)
      .then(() => {
        toast.success(t('pages.dash.stats.charts.customEvents.toasts.updated'))
        editDialogOpen.value = false
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
}

const onEventDeleted = async (eventKey: string) => {
  await withLoading(async () => {
    await deleteCustomEvent(eventKey)
      .then(() => {
        toast.success(t('pages.dash.stats.charts.customEvents.toasts.deleted'))
        editDialogOpen.value = false
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
  editDialogOpen.value = false
}

onMounted(async () => {
  await withLoading(async () => {
    await fetchEvents()
  })
})

watch(statsRange, async (value, oldValue) => {
  if (value.start !== oldValue.start || value.end !== oldValue.end) {
    await withLoading(async () => {
      await fetchStats(value)
    })
  }
})
</script>

<template>
  <EditCustomEventDialog
    v-model:open="editDialogOpen"
    :event="editingEvent"
    :is-loading="isLoading"
    @updated="onEventUpdated"
    @deleted="onEventDeleted"
  />

  <StatsPage
    :charts="charts"
    :is-loading="isLoading"
    :tick-formatter="tickFormatter"
    chart-settings
    @settings-clicked="onSettingsClicked"
  >
    <template #default>
      <CreateCustomEventDialog
        v-model:open="createDialogOpen"
        :is-loading="isLoading"
        @created="onEventCreated"
      >
        <Empty class="border-4 border-dashed cursor-pointer hover:border-border/60 transition">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PlusIcon />
            </EmptyMedia>
            <EmptyTitle>{{ $t('pages.dash.stats.charts.customEvents.createTitle') }}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </CreateCustomEventDialog>
    </template>

    <template #empty>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FrownIcon />
          </EmptyMedia>
          <EmptyTitle>{{ $t('pages.dash.stats.charts.customEvents.empty.title') }}</EmptyTitle>
          <EmptyDescription>
            {{ $t('pages.dash.stats.charts.customEvents.empty.description') }}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateCustomEventDialog
            v-model:open="createDialogOpen"
            :is-loading="isLoading"
            @created="onEventCreated"
          >
            <Button>
              <PlusIcon />
              {{ $t('pages.dash.stats.charts.customEvents.createTitle') }}
            </Button>
          </CreateCustomEventDialog>
        </EmptyContent>
      </Empty>
    </template>
  </StatsPage>
</template>
