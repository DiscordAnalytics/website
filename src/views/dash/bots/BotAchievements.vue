<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import { useRouteParams } from '@vueuse/router'
import { useAnalytics, useBot, useBotAchievements, useLoading } from '@/composables'
import { onMounted, ref } from 'vue'
import { goal2Percent } from '@/utils/statsManager.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CircleCheckIcon,
  FrownIcon,
  PencilIcon,
  PlusIcon,
  Share2Icon,
  TrashIcon,
} from 'lucide-vue-next'
import { Progress } from '@/components/ui/progress'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import CreateAchievementDialog from '@/components/dash/CreateAchievementDialog.vue'
import { toast } from 'vue-sonner'
import type { Achievement, GoalType } from '@/utils/types.ts'
import { useI18n } from 'vue-i18n'
import ShareAchievementDialog from '@/components/dash/ShareAchievementDialog.vue'
import { Badge } from '@/components/ui/badge'
import { df } from '@/utils/dateTime.ts'
import EditAchievementDialog from '@/components/dash/EditAchievementDialog.vue'
import DeleteAchievementDialog from '@/components/dash/DeleteAchievementDialog.vue'

const botId = useRouteParams<string>('id')
const {
  achievements,
  fetch: fetchAchievements,
  create: createAchievement,
  update: editAchievement,
  remove: deleteAchievement,
} = useBotAchievements(botId)
const { bot } = useBot(botId)
const { t } = useI18n()
const { capture } = useAnalytics()
const { isLoading, withLoading } = useLoading()

const createDialogOpen = ref<boolean>(false)
const isAchievementCreated = ref<boolean>(false)
const shareDialogOpen = ref<boolean>(false)
const editDialogOpen = ref<boolean>(false)
const deleteDialogOpen = ref<boolean>(false)
const editingAchievement = ref<Achievement | null>(null)

const onAchievementCreated = async (values: {
  title: string
  description: string
  type: string
  objective: number
}) => {
  await withLoading(async () => {
    await createAchievement({
      title: values.title,
      description: values.description,
      objective: {
        type: values.type as GoalType,
        value: values.objective,
      },
    })
      .then(() => {
        toast.success(t('pages.dash.achievements.toasts.created'))
        createDialogOpen.value = false
        isAchievementCreated.value = true
        capture('achievement_created', { bot_id: botId.value, objective_type: values.type })
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
}

async function onAchievementShared(lang: string) {
  await withLoading(async () => {
    await editAchievement({ lang, id: editingAchievement.value!.id, shared: true })
      .then(() => {
        toast.success(t('pages.dash.achievements.toasts.published'))
        shareDialogOpen.value = false
        capture('achievement_shared', { bot_id: botId.value, language: lang })
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
}

async function onAchievementUpdated(values: { title: string; description: string }) {
  await withLoading(async () => {
    await editAchievement({ ...values, id: editingAchievement.value!.id })
      .then(() => {
        toast.success(t('pages.dash.achievements.toasts.updated'))
        editDialogOpen.value = false
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
}

async function onAchievementDeleted() {
  await withLoading(async () => {
    await deleteAchievement(editingAchievement.value!.id)
      .then(() => {
        toast.success(t('pages.dash.achievements.toasts.deleted'))
        deleteDialogOpen.value = false
        capture('achievement_deleted', { bot_id: botId.value })
      })
      .catch((e) => {
        toast.error(e.message)
      })
  })
}

onMounted(async () => {
  await withLoading(async () => {
    await fetchAchievements()
  })
})
</script>

<template>
  <BotDashLayout>
    <template #header>
      <CreateAchievementDialog
        v-model:open="createDialogOpen"
        :is-loading="isLoading"
        :is-achievement-created="isAchievementCreated"
        @created="onAchievementCreated"
        @update:open="isAchievementCreated = false"
      >
        <Button variant="outline">
          <PlusIcon />
          {{ $t('pages.dash.achievements.dialogs.create.create') }}
        </Button>
      </CreateAchievementDialog>
    </template>

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
          <ShareAchievementDialog
            v-if="!achievement.from && !achievement.shared"
            :is-loading="isLoading"
            v-model:open="shareDialogOpen"
            @shared="onAchievementShared"
            @update:open="(value) => (editingAchievement = value ? achievement : null)"
          >
            <button class="p-2 hover:bg-accent cursor-pointer">
              <Share2Icon class="md:h-4 md:w-4" />
            </button>
          </ShareAchievementDialog>

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
            v-if="!achievement.shared"
            :is-loading="isLoading"
            v-model:open="deleteDialogOpen"
            @deleted="onAchievementDeleted"
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
                ? $t(achievement.titleI18n, { username: bot!.username })
                : achievement.title.replace(/{username}/g, bot!.username)
            }}
          </CardTitle>
          <CardDescription class="text-wrap">
            {{
              achievement.descriptionI18n
                ? $t(achievement.descriptionI18n, { username: bot!.username })
                : achievement.description.replace(/{username}/g, bot!.username)
            }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="goal2Percent(achievement) !== 100" class="flex items-center gap-2">
            <Progress
              :model-value="goal2Percent(achievement)"
              progress-color="bg-primary"
              class="h-4"
            />
            <Badge variant="secondary">
              {{ $t('pages.dash.achievements.percent', { percent: goal2Percent(achievement) }) }}
            </Badge>
          </div>
          <div v-else-if="achievement.achievedOn" class="flex items-center gap-2 text-green-500">
            <CircleCheckIcon class="h-6 w-6" />
            <p>
              {{
                $t('pages.dash.achievements.achieved_on', {
                  date: df.format(new Date(achievement.achievedOn)),
                })
              }}
            </p>
          </div>
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
      <EmptyContent>
        <CreateAchievementDialog
          v-model:open="createDialogOpen"
          :is-loading="isLoading"
          :is-achievement-created="isAchievementCreated"
          @created="onAchievementCreated"
          @update:open="isAchievementCreated = false"
        >
          <Button>
            <PlusIcon />
            {{ $t('pages.dash.achievements.dialogs.create.create') }}
          </Button>
        </CreateAchievementDialog>
      </EmptyContent>
    </Empty>
  </BotDashLayout>
</template>
