<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue'
import { useBotCustomEvents, useBotStats } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import type { DateRange } from 'reka-ui'
import type { ChartConfig, CustomEvent } from '@/utils/types.ts'
import StatsPage from '@/components/dash/StatsPage.vue'
import { formatCustomEventsStats } from '@/utils/statsManager.ts'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { FrownIcon, PlusIcon } from 'lucide-vue-next'
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

const isLoading = ref(false)
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
  isLoading.value = true
  await createCustomEvent({
    eventKey: values.eventKey,
    graphName: values.graphName,
    defaultValue: values.defaultMode === 'fixed' ? values.defaultValue! : null,
  })
    .then(() => {
      toast.success(t('pages.dash.stats.charts.customEvents.toasts.created'))
      createDialogOpen.value = false
      isLoading.value = false
    })
    .catch((e) => {
      toast.error(e.message)
      isLoading.value = false
    })
  isLoading.value = false
}

const onEventUpdated = async (eventKey: string, graphName: string) => {
  isLoading.value = true
  await updateCustomEvent(eventKey, graphName)
    .then(() => {
      toast.success(t('pages.dash.stats.charts.customEvents.toasts.updated'))
      editDialogOpen.value = false
      isLoading.value = false
    })
    .catch((e) => {
      toast.error(e.message)
      isLoading.value = false
    })
}

const onEventDeleted = async (eventKey: string) => {
  isLoading.value = true
  await deleteCustomEvent(eventKey)
    .then(() => {
      toast.success(t('pages.dash.stats.charts.customEvents.toasts.deleted'))
      editDialogOpen.value = false
      isLoading.value = false
    })
    .catch((e) => {
      toast.error(e.message)
      isLoading.value = false
    })
  editDialogOpen.value = false
  isLoading.value = false
}

onMounted(async () => {
  isLoading.value = true
  await fetchEvents()
  isLoading.value = false
})

watch(statsRange, async (value, oldValue) => {
  if (value.start !== oldValue.start || value.end !== oldValue.end) {
    isLoading.value = true
    await fetchStats(value)
    isLoading.value = false
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
