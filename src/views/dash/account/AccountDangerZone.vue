<script setup lang="ts">
import SettingCard from '@/components/dash/SettingCard.vue'
import { TrashIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAnalytics, useCurrentUser, useLoading } from '@/composables'
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
import AccountDashLayout from '@/components/layouts/AccountDashLayout.vue'

const { remove: deleteUser } = useCurrentUser()
const { capture } = useAnalytics()
const { isLoading, withLoading } = useLoading()

async function onDelete() {
  await withLoading(async () => {
    await deleteUser()
      .then(() => capture('account_deleted'))
      .catch((err) => toast.error(err.message))
  })
}
</script>

<template>
  <AccountDashLayout>
    <main class="grid grid-cols-1 gap-4 my-8">
      <SettingCard
        :title="$t('pages.dash.account.dangerZone.title')"
        :icon="TrashIcon"
        :description="$t('pages.dash.account.dangerZone.description')"
        variant="destructive"
      >
        <template #actions>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive" class="w-full md:w-fit">
                {{ $t('pages.dash.account.dangerZone.title') }}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {{ $t('pages.dash.account.dangerZone.dialog.title') }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {{ $t('pages.dash.account.dangerZone.dialog.intro') }}
                  <ul class="list-disc ml-8 my-2">
                    <li>{{ $t('pages.dash.account.dangerZone.dialog.bullets.bots') }}</li>
                    <li>{{ $t('pages.dash.account.dangerZone.dialog.bullets.stats') }}</li>
                    <li>{{ $t('pages.dash.account.dangerZone.dialog.bullets.data') }}</li>
                  </ul>
                  <strong>{{ $t('pages.dash.account.dangerZone.dialog.irreversible') }}</strong>
                  <span>{{ $t('pages.dash.account.dangerZone.dialog.logs') }}</span>
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
                  {{ $t('pages.dash.account.dangerZone.title') }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </template>
      </SettingCard>
    </main>
  </AccountDashLayout>
</template>
