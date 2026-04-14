<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useTeamInvitations } from '@/composables'
import { computed, h, onMounted, ref } from 'vue'
import type { DataTableAction, TeamInvitationData } from '@/utils/types.ts'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, FrownIcon, PlusIcon } from 'lucide-vue-next'
import { df } from '@/utils/dateTime.ts'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import DataTable from '@/components/DataTable.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useI18n } from 'vue-i18n'
import { APIScope } from '@/utils/api'
import AnswerInvitationsDialog from '@/components/dash/admin/AnswerInvitationsDialog.vue'
import CreateInvitationDialog from '@/components/dash/admin/CreateInvitationDialog.vue'

const { t } = useI18n()

const { invitations, fetch: fetchInvitations } = useTeamInvitations(APIScope.Admin)

const isLoading = ref<boolean>(false)
const isAnswerModalOpen = ref<boolean>(false)
const isAccepting = ref<boolean>(false)
const selectedInvitations = ref<TeamInvitationData[]>([])

const columns = computed<ColumnDef<TeamInvitationData, any>[]>(() => [
  {
    accessorKey: 'invitation.invitationId',
    id: 'invitationId',
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
    accessorKey: 'invitation.botId',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [t('pages.dash.admin.invitations.sender'), h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(DiscordAvatar, {
          id: row.original.invitation.botId,
          alt: row.original.botUsername,
          avatar: row.original.botAvatar,
          size: 'sm',
        }),
        h('span', [row.original.botUsername]),
      ])
    },
  },
  {
    accessorKey: 'invitation.userId',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          t('pages.dash.admin.invitations.recipient'),
          h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
        ],
      )
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(DiscordAvatar, {
          id: row.original.invitation.userId,
          alt: row.original.userUsername!,
          avatar: row.original.userAvatar,
          size: 'sm',
        }),
        h('span', [row.original.userUsername!]),
      ])
    },
  },
  {
    accessorKey: 'invitation.expiration',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          t('pages.dash.admin.invitations.expiration'),
          h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
        ],
      )
    },
    cell: ({ row }) => h('div', df.format(new Date(row.original.invitation.expiration))),
  },
])

const actions = computed<DataTableAction<TeamInvitationData>[]>(() => [
  {
    title: t('pages.dash.admin.invitations.actions.markAsAccepted'),
    onSelect(rowSelection, table) {
      selectedInvitations.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedInvitations.value.push(table.getRow(index).original)
      }
      isAnswerModalOpen.value = true
      isAccepting.value = true
    },
  },
  {
    title: t('pages.dash.admin.invitations.actions.markAsRejected'),
    onSelect(rowSelection, table) {
      selectedInvitations.value = []
      for (const [index, value] of Object.entries(rowSelection)) {
        if (value) selectedInvitations.value.push(table.getRow(index).original)
      }
      isAnswerModalOpen.value = true
      isAccepting.value = false
    },
    destructive: true,
  },
])

onMounted(async () => {
  isLoading.value = true
  await fetchInvitations()
  isLoading.value = false
})
</script>

<template>
  <AnswerInvitationsDialog
    :invitations="selectedInvitations"
    :open="isAnswerModalOpen"
    :accept="isAccepting"
    @update:open="(value) => (isAnswerModalOpen = value)"
  />

  <AdminDashLayout>
    <div class="container py-10 mx-auto">
      <DataTable
        :columns="columns"
        :data="invitations"
        :column-visibility="{ invitationId: false }"
        :search-placeholder="t('pages.dash.admin.invitations.searchPlaceholder')"
        :actions="actions"
      >
        <template #empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FrownIcon />
            </EmptyMedia>
            <EmptyTitle>{{ t('pages.dash.admin.invitations.empty.title') }}</EmptyTitle>
            <EmptyDescription>
              {{ t('pages.dash.admin.invitations.empty.description') }}
            </EmptyDescription>
          </EmptyHeader>
        </template>

        <template #header>
          <CreateInvitationDialog @created="fetchInvitations">
            <Button variant="outline">
              <PlusIcon />
              {{ t('pages.dash.admin.invitations.createButton') }}
            </Button>
          </CreateInvitationDialog>
        </template>
      </DataTable>
    </div>
  </AdminDashLayout>
</template>
