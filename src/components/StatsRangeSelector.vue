<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ref, watch } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils.ts'
import { CalendarIcon } from 'lucide-vue-next'
import { RangeCalendar } from '@/components/ui/range-calendar'
import type { AcceptableValue } from 'reka-ui'
import {
  CalendarDate,
  endOfMonth,
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  today as getToday,
} from '@internationalized/date'
import { df } from '@/utils/dateTime.ts'
import { useRouteQuery } from '@vueuse/router'
import { useStore } from '@/stores'

const store = useStore()

const startQuery = useRouteQuery<string | null>('start')
const endQuery = useRouteQuery<string | null>('end')

const tz = getLocalTimeZone()
const today = getToday(tz)

type Preset = {
  key: string
  label: string
  range: () => { start: CalendarDate; end: CalendarDate }
}

const presets: Preset[] = [
  { key: 'today', label: 'Today', range: () => ({ start: today, end: today }) },
  {
    key: 'yesterday',
    label: 'Yesterday',
    range: () => ({ start: today.subtract({ days: 1 }), end: today.subtract({ days: 1 }) }),
  },
  {
    key: 'last7days',
    label: 'Last 7 days',
    range: () => ({ start: today.subtract({ days: 7 }), end: today }),
  },
  {
    key: 'last30days',
    label: 'Last 30 days',
    range: () => ({ start: today.subtract({ days: 30 }), end: today }),
  },
  {
    key: 'last90days',
    label: 'Last 90 days',
    range: () => ({ start: today.subtract({ days: 90 }), end: today }),
  },
  {
    key: 'monthToDate',
    label: 'Month to Date',
    range: () => ({ start: today.set({ day: 1 }), end: today }),
  },
  {
    key: 'lastMonth',
    label: 'Last Month',
    range: () => ({
      start: startOfMonth(today.subtract({ months: 1 })),
      end: endOfMonth(today.subtract({ months: 1 })),
    }),
  },
  {
    key: 'yearToDate',
    label: 'Year to Date',
    range: () => ({ start: today.set({ day: 1, month: 1 }), end: today }),
  },
  {
    key: 'last12months',
    label: 'Last 12 Months',
    range: () => ({ start: today.subtract({ months: 12 }), end: today }),
  },
  { key: 'custom', label: 'Custom Range', range: () => ({ start: today, end: today }) },
]

function detectPreset(start: CalendarDate, end: CalendarDate): string {
  const match = presets.find(({ key, range }) => {
    if (key === 'custom') return false
    const r = range()
    return r.start.toString() === start.toString() && r.end.toString() === end.toString()
  })
  return match?.key ?? 'custom'
}

function handleSelectChange(key: AcceptableValue) {
  const preset = presets.find((p) => p.key === key)
  if (preset && key !== 'custom') store.statsRange = preset.range()
}

try {
  if (startQuery.value && endQuery.value) {
    const parsedStart = parseDate(startQuery.value)
    const parsedEnd = parseDate(endQuery.value)
    store.statsRange = { start: parsedStart, end: parsedEnd }
  } else {
    store.statsRange = {
      start: today.subtract({ days: 30 }),
      end: today,
    }
    startQuery.value = store.statsRange.start!.toString()
    endQuery.value = store.statsRange.end!.toString()
  }
} catch {
  // Malformed query params — keep store default (last 30 days)
}

const selectValue = ref(
  store.statsRange.start && store.statsRange.end
    ? detectPreset(store.statsRange.start as CalendarDate, store.statsRange.end as CalendarDate)
    : 'last30days',
)

watch(
  () => store.statsRange,
  (value) => {
    if (value.start && value.end) {
      startQuery.value = value.start.toString()
      endQuery.value = value.end.toString()
    }
  },
)
</script>

<template>
  <div class="flex items-center w-fit gap-2">
    <Popover v-if="selectValue === 'custom'">
      <PopoverTrigger as-child>
        <Button variant="outline" :class="cn('w-70 justify-start text-left font-normal')">
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{
            store.statsRange.start ? df.format(store.statsRange.start.toDate('Europe/Paris')) : ''
          }}
          -
          {{ store.statsRange.end ? df.format(store.statsRange.end.toDate('Europe/Paris')) : '' }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar
          v-model="store.statsRange"
          :number-of-months="2"
          :maximum-days="365"
          prevent-deselect
          :max-value="
            new CalendarDate(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate(),
            )
          "
          :week-starts-on="1"
        />
      </PopoverContent>
    </Popover>

    <Select v-model="selectValue" @update:model-value="handleSelectChange">
      <SelectTrigger class="w-48 cursor-pointer">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent class="w-(--reka-select-trigger-width)">
        <SelectItem v-for="preset in presets" :key="preset.key" :value="preset.key">
          {{ preset.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
