<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useLoading, useUsers } from '@/composables'
import { computed, h, onMounted, ref } from 'vue'
import type { DataTableAction, User } from '@/utils/types.ts'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, FrownIcon } from 'lucide-vue-next'
import { df } from '@/utils/dateTime.ts'
import { useRouter } from 'vue-router'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import DataTable from '@/components/DataTable.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import EditUsersLimitsDialog from '@/components/dash/admin/EditUsersLimitsDialog.vue'
import SuspendUsersDialog from '@/components/dash/admin/SuspendUsersDialog.vue'
import { Badge } from '@/components/ui/badge'
import DeleteUsersDialog from '@/components/dash/admin/DeleteUsersDialog.vue'
import { useI18n } from 'vue-i18n'
import { Spinner } from '@/components/ui/spinner'

const { t } = useI18n()

const router = useRouter()
const { users, fetch: fetchUsers } = useUsers()

const { isLoading, withLoading } = useLoading()
const isEditLimitsModalOpen = ref<boolean>(false)
const isSuspendModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)
const selectedUsers = ref<User[]>([])

const columns = computed<ColumnDef<User, any>[]>(() => [
  {
    accessorKey: 'userId',
    id: 'userId',
  },
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        'onUpdate:model-value': (value: boolean) => table.toggleAllPageRowsSelected(value),
        ariaLabel: t('pages.dash.admin.users.table.selectAll'),
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:model-value': (value: boolean) => row.toggleSelected(value),
        ariaLabel: t('pages.dash.admin.users.table.selectRow'),
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
        () => [t('pages.dash.admin.users.table.user'), h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const user = users.value!.find((user) => user.userId === row.getValue('userId'))!

      return h('div', { class: 'flex items-center gap-2' }, [
        h(DiscordAvatar, {
          id: user.userId,
          alt: user.username,
          avatar: user.avatar,
          size: 'sm',
        }),
        h('span', [user.username]),
        user.admin ? h(Badge, [t('pages.dash.admin.users.table.admin')]) : undefined,
        user.suspended
          ? h(Badge, { variant: 'destructive' }, [t('pages.dash.admin.users.table.suspended')])
          : undefined,
      ])
    },
  },
  {
    accessorKey: 'joinedAt',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          t('pages.dash.admin.users.table.joinedAt'),
          h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
        ],
      )
    },
    cell: ({ row }) => h('div', df.format(new Date(row.getValue('joinedAt')))),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          t('pages.dash.admin.users.table.createdAt'),
          h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
        ],
      )
    },
    cell: ({ row }) => h('div', {}, df.format(new Date(row.getValue('createdAt')))),
  },
])

const actions = computed<DataTableAction<User>[]>(() => [
  {
    title: t('pages.dash.admin.users.actions.editLimits'),
    onSelect(rowSelection, table) {
      selectedUsers.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedUsers.value.push(table.getRow(index).original)
      }
      isEditLimitsModalOpen.value = true
    },
  },
  {
    title: t('pages.dash.admin.users.actions.suspend'),
    onSelect(rowSelection, table) {
      selectedUsers.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedUsers.value.push(table.getRow(index).original)
      }
      isSuspendModalOpen.value = true
    },
  },
  {
    title: t('pages.dash.admin.users.actions.delete'),
    onSelect(rowSelection, table) {
      selectedUsers.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedUsers.value.push(table.getRow(index).original)
      }
      isDeleteModalOpen.value = true
    },
    destructive: true,
  },
])

onMounted(async () => {
  await withLoading(async () => {
    await fetchUsers()
  })
})
</script>

<template>
  <EditUsersLimitsDialog
    :users="selectedUsers"
    :open="isEditLimitsModalOpen"
    @update:open="(value) => (isEditLimitsModalOpen = value)"
  />

  <SuspendUsersDialog
    :users="selectedUsers"
    :open="isSuspendModalOpen"
    @update:open="(value) => (isSuspendModalOpen = value)"
  />

  <DeleteUsersDialog
    :users="selectedUsers"
    :open="isDeleteModalOpen"
    @update:open="(value) => (isDeleteModalOpen = value)"
  />

  <AdminDashLayout>
    <div class="container py-10 mx-auto">
      <DataTable
        :columns="columns"
        :data="users"
        :column-visibility="{ userId: false }"
        :search-placeholder="$t('pages.dash.admin.users.searchPlaceholder')"
        :actions="actions"
        @row-click="(row) => router.push(`/dash/admin/users/${row.original.userId}`)"
      >
        <template #empty>
          <EmptyHeader v-if="!isLoading">
            <EmptyMedia variant="icon">
              <FrownIcon />
            </EmptyMedia>
            <EmptyTitle>{{ $t('pages.dash.admin.users.empty.title') }}</EmptyTitle>
            <EmptyDescription>
              {{ $t('pages.dash.admin.users.empty.description') }}
            </EmptyDescription>
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
