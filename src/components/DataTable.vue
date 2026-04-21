<script setup lang="ts" generic="TData, TValue">
import {
  type ColumnDef,
  type ColumnFiltersState,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronsUpDownIcon } from '@lucide/vue'
import type { DataTableAction } from '@/utils/types.ts'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnVisibility: Record<string, boolean>
  noHeader?: boolean
  searchPlaceholder?: string
  noPagination?: boolean
  actions: DataTableAction<TData>[]
}>()

defineEmits<{
  (event: 'row-click', row: Row<TData>): void
}>()

const sorting = ref<SortingState>([])
const rowSelection = ref({})
const columnFilters = ref<ColumnFiltersState>([])

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
  initialState: {
    columnVisibility: props.columnVisibility,
    pagination: {
      pageIndex: 0,
      pageSize: 30,
    },
  },
})
</script>

<template>
  <div>
    <div v-if="!$props.noHeader" class="flex items-center gap-2 mb-4">
      <Input
        :placeholder="$props.searchPlaceholder"
        class="w-full"
        @update:model-value="table.setGlobalFilter($event)"
      />
      <DropdownMenu v-if="Object.keys(rowSelection).length">
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="w-48 justify-between">
            {{ $t('pages.dash.admin.users.table.actions') }}
            <ChevronsUpDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-(--reka-dropdown-menu-trigger-width)">
          <DropdownMenuItem
            v-for="action in $props.actions"
            :key="action.title"
            :class="action.destructive ? 'text-destructive dark:text-destructive-foreground' : ''"
            @click="action.onSelect(rowSelection, table)"
          >
            {{ action.title }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="w-48 justify-between">
            {{ table.getState().pagination.pageSize }}
            {{ $t('pages.dash.admin.users.table.rows') }}
            <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-(--reka-dropdown-menu-trigger-width)">
          <DropdownMenuLabel>
            {{ $t('pages.dash.admin.users.table.pageSize') }}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            v-for="size in [10, 20, 30, 40, 50]"
            :key="size"
            :model-value="table.getState().pagination.pageSize === size"
            @update:model-value="
              (value) => {
                if (value) table.setPageSize(size)
              }
            "
          >
            {{ size }}
            {{ $t('pages.dash.admin.users.table.rows') }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <slot name="header" />
    </div>

    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="cursor-pointer"
                @click="
                  () => {
                    if (cell.column.id !== 'select') $emit('row-click', row)
                  }
                "
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableEmpty class="hover:bg-background" :colspan="columns.length">
              <slot name="empty" />
            </TableEmpty>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="!$props.noPagination" class="flex items-center gap-4 mt-4 flex-col">
      <Pagination
        v-slot="{ page }"
        :total="table.getFilteredRowModel().rows.length"
        :items-per-page="table.getState().pagination.pageSize"
        :sibling-count="3"
        :default-page="1"
        @update:page="(p) => table.setPageIndex(p - 1)"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious @click="table.previousPage()" />

          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              :is-active="item.value === page"
            >
              {{ item.value }}
            </PaginationItem>
          </template>

          <PaginationNext @click="table.nextPage()" />
        </PaginationContent>
      </Pagination>

      <div class="flex items-center text-xs text-muted-foreground whitespace-nowrap">
        {{
          $t('pages.dash.admin.users.table.pageProgression', {
            currentPage: table.getState().pagination.pageIndex + 1,
            pagesCount: table.getPageCount(),
          })
        }}
      </div>
    </div>
  </div>
</template>
