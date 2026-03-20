<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import SettingCard from '@/components/dash/SettingCard.vue'
import { TrashIcon, TrophyIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouteParams } from '@vueuse/router'
import { useBot, useBotAchievements } from '@/composables'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

const router = useRouter()
const botId = useRouteParams<string>('id')
const { bot, remove: deleteBot } = useBot(botId)
const { reset: resetAchievements } = useBotAchievements(botId)

const isLoading = ref<boolean>(false)

async function onAchievementsReset() {
  isLoading.value = true
  await resetAchievements()
    .then(async () => {
      toast.success('Achievements reset successfully.')
    })
    .catch((err) => {
      toast.error(err.message)
    })
  isLoading.value = false
}

async function onDelete() {
  isLoading.value = true
  await deleteBot()
    .then(async () => {
      await router.push('/dash')
    })
    .catch((err) => {
      toast.error(err.message)
    })
  isLoading.value = false
}
</script>

<template>
  <BotDashLayout>
    <main v-if="bot" class="grid grid-cols-1 gap-4 my-8">
      <SettingCard
        title="Reset Achievements"
        :icon="TrophyIcon"
        description="Delete all current achievements and restore the default achievements. ALL CURRENT PROGRESS WILL BE LOST"
      >
        <template #actions>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline" class="w-full md:w-fit"> Reset Achievements </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to reset all achievements of {{ bot.username }} and their current
                  progress. This action cannot be undone and will immediately take effect!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {{ $t('pages.dash.stats.charts.customEvents.edit.deleteDialog.cancel') }}
                </AlertDialogCancel>
                <AlertDialogAction
                  class="bg-destructive text-white hover:bg-destructive/90"
                  :disabled="isLoading"
                  @click="onAchievementsReset"
                >
                  <Spinner v-if="isLoading" />
                  Reset achievements
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </template>
      </SettingCard>

      <SettingCard
        title="Delete bot"
        :icon="TrashIcon"
        :description="`Permanently delete ${bot.username} and all associated data.`"
        variant="destructive"
      >
        <template #actions>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive" class="w-full md:w-fit"> Delete bot </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to delete {{ bot.username }} and all associated data such as stats,
                  votes and bot information. This action cannot be undone and will immediately take
                  effect!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {{ $t('pages.dash.stats.charts.customEvents.edit.deleteDialog.cancel') }}
                </AlertDialogCancel>
                <AlertDialogAction
                  class="bg-destructive text-white hover:bg-destructive/90"
                  :disabled="isLoading"
                  @click="onDelete"
                >
                  <Spinner v-if="isLoading" />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </template>
      </SettingCard>
    </main>
  </BotDashLayout>
</template>
