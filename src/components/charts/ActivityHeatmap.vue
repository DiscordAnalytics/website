<script setup lang="ts">
import { computed } from 'vue'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui'
import { dfWeekDay } from '@/utils/dateTime.ts'
import type { ChartData, ChartTab } from '@/utils/types'

const props = defineProps<{
  data: ChartData[]
  activeTab: string
  tabs: Omit<ChartTab, 'value'>[]
}>()

const hours = Array.from({ length: 24 }, (_, i) => i)

// chartsData.activityHeatmap is seeded Sun(0)..Sat(6); display Mon..Sun
const displayOrder = [1, 2, 3, 4, 5, 6, 0]

const rows = computed(() =>
  displayOrder.map((dayIndex) => {
    const entry = props.data[dayIndex]
    const values = hours.map((h) => (entry?.[`h${h}`] as number) ?? 0)
    return {
      label: entry ? dfWeekDay.format(new Date(entry.date)) : '',
      values,
      total: values.reduce((sum, v) => sum + v, 0),
    }
  }),
)

const columnTotals = computed(() =>
  hours.map((h) => rows.value.reduce((sum, row) => sum + row.values[h]!, 0)),
)

const grandTotal = computed(() => columnTotals.value.reduce((sum, v) => sum + v, 0))

const maxValue = computed(() => Math.max(1, ...rows.value.flatMap((row) => row.values)))

function cellStyle(value: number) {
  if (value === 0) return {}
  const alpha = 0.12 + (value / maxValue.value) * 0.68
  return { backgroundColor: `oklch(from var(--primary) l c h / ${alpha})` }
}

function cellTextClass(value: number) {
  if (value === 0) return 'text-muted-foreground'
  return value / maxValue.value > 0.45 ? 'text-primary-foreground' : 'text-foreground'
}
</script>

<template>
  <Table class="min-w-max">
    <TableHeader>
      <TableRow class="hover:bg-transparent">
        <TableHead class="sticky left-0 z-10 bg-card" />
        <TableHead v-for="h in hours" :key="h" class="px-1 text-center">
          {{
            $t('pages.dash.stats.charts.interactions.activityHourLabel', {
              hour: h.toString().padStart(2, '0'),
            })
          }}
        </TableHead>
        <TableHead class="bg-muted/50 text-center">
          {{ $t('pages.dash.stats.charts.all') }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TooltipProvider>
      <TableBody>
        <TableRow v-for="row in rows" :key="row.label" class="hover:bg-transparent">
          <TableCell class="sticky left-0 z-10 bg-card font-medium whitespace-nowrap">
            {{ row.label }}
          </TableCell>
          <Tooltip v-for="(value, h) in row.values" :key="h">
            <TooltipTrigger as-child>
              <TableCell
                :class="['px-1 text-center tabular-nums', cellTextClass(value)]"
                :style="cellStyle(value)"
              >
                {{ value }}
              </TableCell>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {{
                  $t('pages.dash.stats.charts.interactions.activityTooltip', {
                    day: row.label,
                    hour: h.toString().padStart(2, '0'),
                    count: value,
                  })
                }}
              </p>
            </TooltipContent>
          </Tooltip>
          <TableCell class="bg-muted/50 text-center font-semibold tabular-nums">
            {{ row.total }}
          </TableCell>
        </TableRow>
        <TableRow class="hover:bg-transparent">
          <TableCell class="sticky left-0 z-10 bg-muted/50 font-semibold">
            {{ $t('pages.dash.stats.charts.all') }}
          </TableCell>
          <TableCell
            v-for="(total, h) in columnTotals"
            :key="h"
            class="bg-muted/50 text-center font-semibold tabular-nums"
          >
            {{ total }}
          </TableCell>
          <TableCell class="bg-primary text-center font-bold text-primary-foreground tabular-nums">
            {{ grandTotal }}
          </TableCell>
        </TableRow>
      </TableBody>
    </TooltipProvider>
  </Table>
</template>
