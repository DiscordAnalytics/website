<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useBots, useLoading } from '@/composables'
import { computed, h, onMounted, ref } from 'vue'
import type { Bot, DataTableAction } from '@/utils/types.ts'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, FrownIcon } from 'lucide-vue-next'
import { df } from '@/utils/dateTime.ts'
import { useRouter } from 'vue-router'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import DataTable from '@/components/DataTable.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { useI18n } from 'vue-i18n'
import EditBotsLimitsDialog from '@/components/dash/admin/EditBotsLimitsDialog.vue'
import SuspendBotsDialog from '@/components/dash/admin/SuspendBotsDialog.vue'
import DeleteBotsDialog from '@/components/dash/admin/DeleteBotsDialog.vue'
import { Spinner } from '@/components/ui/spinner'

const { t } = useI18n()

const router = useRouter()
const { bots, fetch: fetchBots } = useBots()

const { isLoading, withLoading } = useLoading()
const isEditLimitsModalOpen = ref<boolean>(false)
const isSuspendModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)
const selectedBots = ref<Bot[]>([])

const columns = computed<ColumnDef<Bot, any>[]>(() => [
  {
    accessorKey: 'botId',
    id: 'botId',
  },
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        'onUpdate:model-value': (value: boolean) => table.toggleAllPageRowsSelected(value),
        ariaLabel: t('pages.dash.admin.bots.table.selectAll'),
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:model-value': (value: boolean) => row.toggleSelected(value),
        ariaLabel: t('pages.dash.admin.bots.table.selectRow'),
      }),
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [t('pages.dash.admin.bots.table.bot'), h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const bot = bots.value!.find((bot) => bot.botId === row.getValue('botId'))!

      return h('div', { class: 'flex items-center gap-2' }, [
        h(DiscordAvatar, {
          id: bot.botId,
          alt: bot.username,
          avatar: bot.avatar,
          size: 'sm',
        }),
        h('span', [bot.username]),
        bot.suspended
          ? h(Badge, { variant: 'destructive' }, [t('pages.dash.admin.bots.table.suspended')])
          : undefined,
      ])
    },
  },
  {
    accessorKey: 'watchedSince',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          t('pages.dash.admin.bots.table.watchedSince'),
          h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
        ],
      )
    },
    cell: ({ row }) => h('div', df.format(new Date(row.getValue('watchedSince')))),
  },
  {
    accessorKey: 'lastPush',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          t('pages.dash.admin.bots.table.lastPush'),
          h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
        ],
      )
    },
    cell: ({ row }) => h('div', df.format(new Date(row.getValue('lastPush')))),
  },
])

const actions = computed<DataTableAction<Bot>[]>(() => [
  {
    title: t('pages.dash.admin.bots.actions.editLimits'),
    onSelect(rowSelection, table) {
      selectedBots.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedBots.value.push(table.getRow(index).original)
      }
      isEditLimitsModalOpen.value = true
    },
  },
  {
    title: t('pages.dash.admin.bots.actions.suspend'),
    onSelect(rowSelection, table) {
      selectedBots.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedBots.value.push(table.getRow(index).original)
      }
      isSuspendModalOpen.value = true
    },
  },
  {
    title: t('pages.dash.admin.bots.actions.delete'),
    onSelect(rowSelection, table) {
      selectedBots.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedBots.value.push(table.getRow(index).original)
      }
      isDeleteModalOpen.value = true
    },
    destructive: true,
  },
])

onMounted(async () => {
  await withLoading(async () => {
    await fetchBots()
  })
})
</script>

<template>
  <EditBotsLimitsDialog
    :bots="selectedBots"
    :open="isEditLimitsModalOpen"
    @update:open="(value) => (isEditLimitsModalOpen = value)"
  />

  <SuspendBotsDialog
    :bots="selectedBots"
    :open="isSuspendModalOpen"
    @update:open="(value) => (isSuspendModalOpen = value)"
  />

  <DeleteBotsDialog
    :bots="selectedBots"
    :open="isDeleteModalOpen"
    @update:open="(value) => (isDeleteModalOpen = value)"
  />

  <AdminDashLayout>
    <div class="container py-10 mx-auto">
      <DataTable
        :columns="columns"
        :data="bots"
        :column-visibility="{ botId: false }"
        :search-placeholder="$t('pages.dash.admin.bots.searchPlaceholder')"
        :actions="actions"
        @row-click="(row) => router.push(`/dash/admin/bots/${row.original.botId}`)"
      >
        <template #empty>
          <EmptyHeader v-if="!isLoading">
            <EmptyMedia variant="icon">
              <FrownIcon />
            </EmptyMedia>
            <EmptyTitle>{{ $t('pages.dash.admin.bots.empty.title') }}</EmptyTitle>
            <EmptyDescription>{{ $t('pages.dash.admin.bots.empty.description') }}</EmptyDescription>
          </EmptyHeader>
          <EmptyHeader v-else>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
          </EmptyHeader>
        </template>
      </DataTable>
    </div>
  </AdminDashLayout>
</template>
