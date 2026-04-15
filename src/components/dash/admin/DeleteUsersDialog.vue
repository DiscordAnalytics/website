<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import type { User } from '@/utils/types.ts'
import { useLoading, useUsers } from '@/composables'
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
  users: User[]
  open: boolean
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const { remove: deleteUser } = useUsers()
const { isLoading, withLoading } = useLoading()

async function onSubmit() {
  await withLoading(async () => {
    try {
      await Promise.all(props.users.map((user) => deleteUser(user.userId)))
      toast.success(t('pages.dash.admin.users.delete.toast'))
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
            $t('pages.dash.admin.users.delete.title', $props.users.length, {
              named: {
                username: $props.users[0]?.username,
                count: $props.users.length,
              },
            })
          }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{
            $t('pages.dash.admin.users.delete.description', $props.users.length, {
              named: {
                username: $props.users[0]?.username,
              },
            })
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">
          <Spinner v-if="isLoading" />
          {{ $t('pages.dash.admin.users.delete.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction variant="destructive" :disabled="isLoading" @click="onSubmit">
          <Spinner v-if="isLoading" />
          {{
            $t('pages.dash.admin.users.delete.submit', $props.users.length, {
              named: {
                username: $props.users[0]?.username,
              },
            })
          }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
