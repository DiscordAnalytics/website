<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import SettingCard from '@/components/dash/SettingCard.vue'
import { TrashIcon, TrophyIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouteParams } from '@vueuse/router'
import { useBot, useBotAchievements, useLoading } from '@/composables'
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
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const botId = useRouteParams<string>('id')
const { bot, remove: deleteBot } = useBot(botId)
const { reset: resetAchievements } = useBotAchievements(botId)
const { isLoading, withLoading } = useLoading()

async function onAchievementsReset() {
  await withLoading(async () => {
    await resetAchievements()
      .then(async () => {
        toast.success(t('pages.dash.settings.dangerZone.resetAchievements.toast'))
      })
      .catch((err) => {
        toast.error(err.message)
      })
  })
}

async function onDelete() {
  await withLoading(async () => {
    await deleteBot()
      .then(async () => {
        await router.push('/dash')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  })
}
</script>

<template>
  <BotDashLayout>
    <main v-if="bot" class="grid grid-cols-1 gap-4 my-8">
      <SettingCard
        :title="$t('pages.dash.settings.dangerZone.resetAchievements.title')"
        :icon="TrophyIcon"
        :description="$t('pages.dash.settings.dangerZone.resetAchievements.description')"
      >
        <template #actions>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline" class="w-full md:w-fit">
                {{ $t('pages.dash.settings.dangerZone.resetAchievements.button') }}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {{ $t('pages.dash.settings.dangerZone.confirm') }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {{
                    $t('pages.dash.settings.dangerZone.resetAchievements.dialog.description', {
                      username: bot.username,
                    })
                  }}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {{ $t('pages.dash.settings.dangerZone.cancel') }}
                </AlertDialogCancel>
                <AlertDialogAction
                  class="bg-destructive text-white hover:bg-destructive/90"
                  :disabled="isLoading"
                  @click="onAchievementsReset"
                >
                  <Spinner v-if="isLoading" />
                  {{ $t('pages.dash.settings.dangerZone.resetAchievements.button') }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </template>
      </SettingCard>

      <SettingCard
        :title="$t('pages.dash.settings.dangerZone.deleteBot.title')"
        :icon="TrashIcon"
        :description="
          $t('pages.dash.settings.dangerZone.deleteBot.description', { username: bot.username })
        "
        variant="destructive"
      >
        <template #actions>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive" class="w-full md:w-fit">
                {{ $t('pages.dash.settings.dangerZone.deleteBot.button') }}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {{ $t('pages.dash.settings.dangerZone.confirm') }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {{
                    $t('pages.dash.settings.dangerZone.deleteBot.dialog.description', {
                      username: bot.username,
                    })
                  }}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {{ $t('pages.dash.settings.dangerZone.cancel') }}
                </AlertDialogCancel>
                <AlertDialogAction
                  class="bg-destructive text-white hover:bg-destructive/90"
                  :disabled="isLoading"
                  @click="onDelete"
                >
                  <Spinner v-if="isLoading" />
                  {{ $t('pages.dash.settings.dangerZone.deleteBot.button') }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </template>
      </SettingCard>
    </main>
  </BotDashLayout>
</template>
