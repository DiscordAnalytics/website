<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import { ref } from 'vue'
import type { User } from '@/utils/types.ts'
import { useUsers } from '@/composables'
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

const props = defineProps<{
  users: User[]
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { remove: deleteUser } = useUsers()

const isLoading = ref<boolean>(false)

async function onSubmit() {
  isLoading.value = true
  try {
    for (const user of props.users) {
      await deleteUser(user.userId)
    }
    toast.success('The selected users have been successfully deleted.')
  } catch (e: any) {
    toast.error(e.message)
  }
  isLoading.value = false
  emit('update:open', false)
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {{ $props.users.length }} users...</AlertDialogTitle>
        <AlertDialogDescription>
          You're about to delete the selected users which means their account and all associated
          data will be permanently delete from the database.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">
          <Spinner v-if="isLoading" />
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction variant="destructive" :disabled="isLoading">
          <Spinner v-if="isLoading" />
          Delete user
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
