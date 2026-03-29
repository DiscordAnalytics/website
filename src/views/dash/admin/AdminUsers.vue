<script setup lang="ts" generic="TData, TValue">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useUsers } from '@/composables'
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

const router = useRouter()
const { users, fetch: fetchUsers } = useUsers()

const isLoading = ref<boolean>(false)
const isEditLimitsModalOpen = ref<boolean>(false)
const isSuspendModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)
const selectedUsers = ref<User[]>([])

const columns = computed<ColumnDef<User>[]>(() => [
  {
    accessorKey: 'userId',
    id: 'userId',
  },
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelected(value),
        ariaLabel: 'Select row',
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
        () => ['User', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
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
        user.admin ? h(Badge, ['Admin']) : undefined,
        user.suspended ? h(Badge, { variant: 'destructive' }, ['Suspended']) : undefined,
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
        () => ['Joined At', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
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
        () => ['Created At', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', {}, df.format(new Date(row.getValue('createdAt')))),
  },
])

const actions = computed<
  DataTableAction<{
    userId: string
    username: string
    avatar?: string | undefined
    avatarDecoration?: string | undefined
    suspended: boolean
    joinedAt: string
    createdAt: string
    botsLimit: number
    admin: boolean
  }>[]
>(() => [
  {
    title: 'Edit limits',
    onSelect(rowSelection, table) {
      selectedUsers.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedUsers.value.push(table.getRow(index).original)
      }
      isEditLimitsModalOpen.value = true
    },
  },
  {
    title: 'Suspend',
    onSelect(rowSelection, table) {
      selectedUsers.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedUsers.value.push(table.getRow(index).original)
      }
      isSuspendModalOpen.value = true
    },
  },
  {
    title: 'Delete',
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
  isLoading.value = true
  await fetchUsers()
  isLoading.value = false
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
        search-placeholder="Search in users..."
        :actions="actions"
        @row-click="(row) => router.push(`/dash/admin/users/${row.original.userId}`)"
      >
        <template #empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FrownIcon />
            </EmptyMedia>
            <EmptyTitle>No users</EmptyTitle>
            <EmptyDescription>No users found for the selected filters</EmptyDescription>
          </EmptyHeader>
        </template>
      </DataTable>
    </div>
  </AdminDashLayout>
</template>
