<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
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

defineProps<{
  isLoading: boolean
  open: boolean
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'deleted'): void
}>()
</script>

<template>
  <AlertDialog @update:open="(value) => $emit('update:open', value)">
    <AlertDialogTrigger>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{ $t('pages.dash.achievements.dialogs.delete.title') }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('pages.dash.achievements.dialogs.delete.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          {{ $t('pages.dash.achievements.dialogs.delete.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction @click="$emit('deleted')">
          <Spinner v-if="isLoading" />
          {{ $t('pages.dash.achievements.dialogs.delete.delete') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
