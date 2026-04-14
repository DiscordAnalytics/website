<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useLoading, useUser } from '@/composables'
import { computed, h, onMounted, ref } from 'vue'
import EditUsersLimitsDialog from '@/components/dash/admin/EditUsersLimitsDialog.vue'
import SuspendUsersDialog from '@/components/dash/admin/SuspendUsersDialog.vue'
import DeleteUsersDialog from '@/components/dash/admin/DeleteUsersDialog.vue'
import { useRouteParams } from '@vueuse/router'
import { APIScope } from '@/utils/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { df } from '@/utils/dateTime.ts'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Bot } from '@/utils/types.ts'
import { Badge } from '@/components/ui/badge'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import DataTable from '@/components/DataTable.vue'
import { FrownIcon } from 'lucide-vue-next'
import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const { t } = useI18n()
const router = useRouter()
const userId = useRouteParams<string>('id')
const {
  userInfos,
  ownedBots,
  fetch: fetchUser,
  accessibleBots,
  unsuspend: unsuspendUser,
} = useUser(APIScope.Admin, userId)

const { isLoading, withLoading } = useLoading()
const isEditLimitsModalOpen = ref<boolean>(false)
const isSuspendModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)

const columns = computed<ColumnDef<Bot, any>[]>(() => [
  {
    accessorKey: 'botId',
    id: 'botId',
  },
  {
    accessorKey: 'username',
    header: () => h('span', [t('pages.dash.admin.users.user.bots.table.bot')]),
    cell: ({ row }) => {
      const bot = accessibleBots.value.find((bot) => bot.botId === row.getValue('botId'))!

      return h('div', { class: 'flex items-center gap-2' }, [
        h(DiscordAvatar, {
          id: bot.botId,
          alt: bot.username,
          avatar: bot.avatar,
          size: 'sm',
        }),
        h('span', [bot.username]),
        bot.suspended
          ? h(Badge, { variant: 'destructive' }, [t('pages.dash.admin.users.table.suspended')])
          : undefined,
        bot.team.includes(userInfos.value?.userId ?? '')
          ? h(Badge, [t('pages.dash.admin.users.user.bots.table.teamMember')])
          : undefined,
      ])
    },
  },
  {
    accessorKey: 'watchedSince',
    header: () => h('span', [t('pages.dash.admin.users.user.bots.table.watchedSince')]),
    cell: ({ row }) => h('div', df.format(new Date(row.getValue('watchedSince')))),
  },
  {
    accessorKey: 'lastPush',
    header: () => h('span', [t('pages.dash.admin.users.user.bots.table.lastPush')]),
    cell: ({ row }) => h('div', df.format(new Date(row.getValue('lastPush')))),
  },
])

async function onUserUnsuspend() {
  await withLoading(async () => {
    await unsuspendUser()
  })
}

onMounted(async () => {
  await withLoading(async () => {
    if (!userInfos.value) await fetchUser()
  })
})
</script>

<template>
  <EditUsersLimitsDialog
    v-if="userInfos"
    :users="[userInfos]"
    :open="isEditLimitsModalOpen"
    @update:open="(value) => (isEditLimitsModalOpen = value)"
  />

  <SuspendUsersDialog
    v-if="userInfos"
    :users="[userInfos]"
    :open="isSuspendModalOpen"
    @update:open="(value) => (isSuspendModalOpen = value)"
  />

  <DeleteUsersDialog
    v-if="userInfos"
    :users="[userInfos]"
    :open="isDeleteModalOpen"
    @update:open="(value) => (isDeleteModalOpen = value)"
  />

  <AdminDashLayout>
    <div v-if="userInfos" class="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('pages.dash.admin.users.user.identity.title') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex items-center flex-col gap-4 flex-1">
          <DiscordAvatar
            :id="userInfos.userId"
            :alt="userInfos.username"
            :avatar="userInfos.avatar"
            :avatar-decoration="userInfos.avatarDecoration"
            size="xl"
          />
          <h1 class="text-4xl font-bold">{{ userInfos.username }}</h1>
          <Field class="flex-1">
            <FieldLabel for="joinedAt">{{ $t('pages.dash.account.infos.joinedAt') }}</FieldLabel>
            <Input id="joinedAt" :model-value="df.format(new Date(userInfos.joinedAt))" readonly />
          </Field>
          <Field class="flex-1">
            <FieldLabel for="createdAt">{{ $t('pages.dash.account.infos.createdAt') }}</FieldLabel>
            <Input
              id="createdAt"
              :model-value="df.format(new Date(userInfos.createdAt))"
              readonly
            />
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('pages.dash.admin.users.user.bots.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="container mx-auto">
            <DataTable
              :columns="columns"
              :data="accessibleBots"
              :column-visibility="{ botId: false }"
              :actions="[]"
              no-header
              no-pagination
              @row-click="(row) => router.push(`/dash/admin/bots/${row.original.botId}`)"
            >
              <template #empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FrownIcon />
                  </EmptyMedia>
                  <EmptyTitle>{{ $t('pages.dash.admin.users.user.bots.empty.title') }}</EmptyTitle>
                  <EmptyDescription>
                    {{ $t('pages.dash.admin.users.user.bots.empty.description') }}
                  </EmptyDescription>
                </EmptyHeader>
              </template>
            </DataTable>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">{{ $t('pages.dash.account.infos.usage.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <div class="flex items-center gap-4 justify-between">
              <FieldLabel>{{ $t('pages.dash.account.infos.usage.bots') }}</FieldLabel>
              <FieldLabel>{{ ownedBots.length }}/{{ userInfos.botsLimit }}</FieldLabel>
            </div>
            <Progress :model-value="(ownedBots.length * 100) / userInfos.botsLimit" />
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('pages.dash.admin.users.user.actions.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 py-4 justify-center">
            <Button variant="secondary" @click="isEditLimitsModalOpen = true">
              {{ $t('pages.dash.admin.users.actions.editLimits') }}
            </Button>
            <Button
              v-if="!userInfos.suspended"
              variant="secondary"
              @click="isSuspendModalOpen = true"
            >
              {{ $t('pages.dash.admin.users.actions.suspend') }}
            </Button>
            <Button v-else variant="secondary" :disabled="isLoading" @click="onUserUnsuspend">
              <Spinner v-if="isLoading" />
              {{ $t('pages.dash.admin.users.actions.unsuspend') }}
            </Button>
            <Button variant="destructive" @click="isDeleteModalOpen = true">
              {{ $t('pages.dash.admin.users.actions.delete') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminDashLayout>
</template>
