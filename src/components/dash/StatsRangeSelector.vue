<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { onMounted, ref, type Ref, watch } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils.ts'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'
import { RangeCalendar } from '@/components/ui/range-calendar'
import type { AcceptableValue, DateRange } from 'reka-ui'
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
import { breakpointsTailwind, createReusableTemplate, useBreakpoints } from '@vueuse/core'
import { ButtonGroup } from '@/components/ui/button-group'

const store = useStore()
const startQuery = useRouteQuery<string | null>('start')
const endQuery = useRouteQuery<string | null>('end')
const breakpoints = useBreakpoints(breakpointsTailwind)
const [DefineNavArrows, NavArrows] = createReusableTemplate()

const largerThanMd = breakpoints.greater('md')
const statsRange = ref({
  start: undefined,
  end: undefined,
}) as Ref<DateRange>
const selectValue = ref('last30days')

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
    const r = range()
    return (
      key !== 'custom' &&
      r.start.toString() === start.toString() &&
      r.end.toString() === end.toString()
    )
  })
  return match?.key ?? 'custom'
}

function handleSelectChange(key: AcceptableValue) {
  const preset = presets.find((p) => p.key === key)
  if (preset && key !== 'custom') statsRange.value = preset.range()
}

function shiftRange(direction: 'forward' | 'backward') {
  const start = statsRange.value.start!
  const end = statsRange.value.end!
  const duration = {
    years: end.year - start.year,
    months: end.month - start.month,
    days: end.day - start.day + 1,
  }

  statsRange.value =
    direction === 'forward'
      ? { start: end.add({ days: 1 }), end: end.add(duration) }
      : { start: start.subtract(duration), end: start.subtract({ days: 1 }) }

  selectValue.value =
    statsRange.value.start && statsRange.value.end
      ? detectPreset(statsRange.value.start as CalendarDate, statsRange.value.end as CalendarDate)
      : 'custom'
}

onMounted(() => {
  try {
    if (startQuery.value && endQuery.value) {
      statsRange.value = { start: parseDate(startQuery.value), end: parseDate(endQuery.value) }
    } else {
      statsRange.value = {
        start: today.subtract({ days: 30 }),
        end: today,
      }
    }
  } catch {
    // Malformed query params — keep store default (last 30 days)
    statsRange.value = {
      start: today.subtract({ days: 30 }),
      end: today,
    }
  }

  selectValue.value =
    statsRange.value.start && statsRange.value.end
      ? detectPreset(statsRange.value.start as CalendarDate, statsRange.value.end as CalendarDate)
      : 'last30days'
})

watch(statsRange, (value) => {
  if (value.start && value.end) {
    startQuery.value = value.start.toString()
    endQuery.value = value.end.toString()
    store.statsRange = {
      start: value.start,
      end: value.end,
    }
  }
})
</script>

<template>
  <DefineNavArrows>
    <ButtonGroup v-if="statsRange.start && statsRange.end">
      <Button variant="outline" size="icon" @click="shiftRange('backward')">
        <ChevronLeftIcon />
      </Button>
      <Button variant="outline" size="icon" @click="shiftRange('forward')">
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  </DefineNavArrows>

  <div class="flex items-center justify-end flex-wrap w-fit gap-2">
    <NavArrows v-if="largerThanMd" />
    <Popover v-if="selectValue === 'custom'">
      <PopoverTrigger as-child>
        <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
        <Button variant="outline" :class="cn('w-70 justify-start text-left font-normal')">
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ statsRange.start ? df.format(statsRange.start.toDate('Europe/Paris')) : '' }}
          -
          {{ statsRange.end ? df.format(statsRange.end.toDate('Europe/Paris')) : '' }}
        </Button>
        <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar
          v-model="statsRange"
          :number-of-months="largerThanMd ? 2 : 1"
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

    <NavArrows v-if="!largerThanMd" />

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

    <slot name="additional-actions" />
  </div>
</template>
