<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import type { Bot } from '@/utils/types.ts'
import { useBots, useLoading } from '@/composables'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  bots: Bot[]
  open: boolean
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const { remove: deleteBot } = useBots()
const { isLoading, withLoading } = useLoading()

async function onSubmit() {
  await withLoading(async () => {
    try {
      await Promise.all(props.bots.map((bot) => deleteBot(bot.botId)))
      toast.success(t('pages.dash.admin.bots.delete.toast'))
    } catch (e: any) {
      toast.error(e.message)
    }
  })
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{
            $t('pages.dash.admin.bots.delete.title', $props.bots.length, {
              named: {
                username: $props.bots[0]?.username,
                count: $props.bots.length,
              },
            })
          }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{
            $t('pages.dash.admin.bots.delete.description', $props.bots.length, {
              named: {
                username: $props.bots[0]?.username,
              },
            })
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">
          <Spinner v-if="isLoading" />
          {{ $t('pages.dash.admin.bots.delete.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction variant="destructive" :disabled="isLoading" @click="onSubmit">
          <Spinner v-if="isLoading" />
          {{
            $t('pages.dash.admin.bots.delete.submit', $props.bots.length, {
              named: {
                username: $props.bots[0]?.username,
              },
            })
          }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
