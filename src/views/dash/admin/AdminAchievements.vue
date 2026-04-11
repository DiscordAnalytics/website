<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FrownIcon, PencilIcon, SparklesIcon, TrashIcon } from 'lucide-vue-next'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import type { Achievement } from '@/utils/types.ts'
import { useI18n } from 'vue-i18n'
import EditAchievementDialog from '@/components/dash/EditAchievementDialog.vue'
import DeleteAchievementDialog from '@/components/dash/DeleteAchievementDialog.vue'
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import useAchievementsStore from '@/composables/useAchievementsStore.ts'
import { APIScope } from '@/utils/api'
import { useBotAchievements } from '@/composables'
import { toast } from 'vue-sonner'
import { useStore } from '@/stores'
import { selectLocale } from '@/utils/functions.ts'

const { achievements, fetch: fetchAchievements } = useAchievementsStore(APIScope.Admin)
const store = useStore()
const { t } = useI18n()

const isLoading = ref<boolean>(false)
const editDialogOpen = ref<boolean>(false)
const deleteDialogOpen = ref<boolean>(false)
const editingAchievement = ref<Achievement | null>(null)

async function onAchievementUpdated(values: { title: string; description: string }) {
  isLoading.value = true
  const { update: editAchievement } = useBotAchievements(
    ref(editingAchievement.value!.botId!),
    APIScope.Admin,
  )
  await editAchievement({ ...values, id: editingAchievement.value!.id })
    .then(() => {
      const achievement = { ...editingAchievement.value!, ...values }
      const index = store.achievementsStore.findIndex(
        (achv) => achv.id === editingAchievement.value!.id,
      )
      if (index >= 0) store.achievementsStore[index] = achievement
      else store.achievementsStore.push(achievement)
      toast.success(t('pages.dash.achievements.toasts.updated'))
      editDialogOpen.value = false
    })
    .catch((e) => {
      toast.error(e.message)
    })
  isLoading.value = false
}

async function onAchievementUnpublished() {
  isLoading.value = true
  const { update: editAchievement } = useBotAchievements(
    ref(editingAchievement.value!.botId!),
    APIScope.Admin,
  )
  await editAchievement({ id: editingAchievement.value!.id, shared: false })
    .then(() => {
      const index = store.achievementsStore.findIndex(
        (achv) => achv.id === editingAchievement.value!.id,
      )
      if (index >= 0) store.achievementsStore.splice(index, 1)
      toast.success(t('pages.dash.achievements.toasts.deleted'))
      deleteDialogOpen.value = false
    })
    .catch((e) => {
      toast.error(e.message)
    })
  isLoading.value = false
}

onMounted(async () => {
  isLoading.value = true
  await fetchAchievements()
  isLoading.value = false
})
</script>

<template>
  <AdminDashLayout>
    <main
      v-if="!isLoading && achievements.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8"
    >
      <Card
        v-for="achievement in achievements"
        :key="achievement.id"
        class="group relative col-span-1 m-2 box-border flex flex-col justify-between select-none"
      >
        <div
          class="absolute top-0 border-b border-l rounded-tr-lg rounded-bl-lg bg-background shadow-sm right-0 block md:hidden group-hover:block overflow-clip"
        >
          <EditAchievementDialog
            v-if="!achievement.from"
            :achievement="editingAchievement"
            :is-loading="isLoading"
            v-model:open="editDialogOpen"
            @updated="onAchievementUpdated"
            @update:open="(value) => (editingAchievement = value ? achievement : null)"
          >
            <button class="p-2 border-x hover:bg-accent cursor-pointer">
              <PencilIcon class="md:h-4 md:w-4" />
            </button>
          </EditAchievementDialog>

          <DeleteAchievementDialog
            :is-loading="isLoading"
            v-model:open="deleteDialogOpen"
            @deleted="onAchievementUnpublished"
            @update:open="(value) => (editingAchievement = value ? achievement : null)"
          >
            <button class="p-2 rounded-tr-lg hover:bg-destructive cursor-pointer">
              <TrashIcon class="md:h-4 md:w-4" />
            </button>
          </DeleteAchievementDialog>
        </div>

        <CardHeader>
          <CardTitle class="text-wrap">
            {{
              achievement.titleI18n
                ? $t(achievement.titleI18n, { username: 'USERNAME' })
                : achievement.title.replace(/{username}/g, 'USERNAME')
            }}
          </CardTitle>
          <CardDescription class="text-wrap">
            {{
              achievement.descriptionI18n
                ? $t(achievement.descriptionI18n, { username: 'USERNAME' })
                : achievement.description.replace(/{username}/g, 'USERNAME')
            }}
          </CardDescription>
        </CardHeader>
        <CardContent class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span
              v-if="achievement.descriptionI18n && achievement.titleI18n"
              class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1"
            >
              {{ $t('pages.achievementsStore.dialog.trigger.multiple_langs') }}
            </span>
            <span v-else class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1">
              {{ selectLocale(achievement.lang!) }}
            </span>
            <span
              v-if="achievement.title.includes('{username}')"
              class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1"
            >
              <SparklesIcon />
              {{ $t('pages.achievementsStore.dialog.trigger.dynamic_achievement') }}
            </span>
          </div>
          <span
            v-if="achievement.usedBy > 0"
            class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1"
          >
            {{
              $t('pages.achievementsStore.dialog.trigger.used_by', achievement.usedBy, {
                named: { amount: achievement.usedBy },
              })
            }}
          </span>
        </CardContent>
      </Card>
    </main>
    <Empty v-else-if="isLoading" class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.dash.achievements.loading') }}</EmptyTitle>
      </EmptyHeader>
    </Empty>
    <Empty v-else class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FrownIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.dash.achievements.empty.title') }}</EmptyTitle>
        <EmptyDescription>{{ $t('pages.dash.achievements.empty.description') }}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </AdminDashLayout>
</template>
