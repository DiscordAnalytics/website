<script setup lang="ts">
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Trash2Icon } from '@lucide/vue'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { editCustomEventSchema } from '@/utils/formSchemas.ts'
import type { CustomEvent } from '@/utils/types'
import { watch } from 'vue'

const props = defineProps<{
  open: boolean
  event: CustomEvent | null
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'updated', eventKey: string, graphName: string): void
  (e: 'deleted', eventKey: string): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(editCustomEventSchema),
})

const onSubmit = form.handleSubmit(async (values) => {
  emit('updated', props.event!.eventKey, values.graphName)
})

function onDelete() {
  emit('deleted', props.event!.eventKey)
}

watch(props, (value) => {
  if (value.open) {
    form.setValues({ graphName: value.event?.graphName })
  }
})
</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t('pages.dash.stats.charts.customEvents.edit.title') }}</DialogTitle>
        <DialogDescription v-if="props.event">
          {{ $t('pages.dash.stats.charts.customEvents.edit.description') }}
          <code class="bg-muted rounded px-1 py-0.5 text-xs font-mono">
            {{ props.event.eventKey }}
          </code>
        </DialogDescription>
      </DialogHeader>

      <form id="editEventForm" class="w-full" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="graphName">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="editChartTitleInput">
                {{ $t('pages.dash.stats.charts.customEvents.fields.chartTitle') }}
              </FieldLabel>
              <Input
                id="editChartTitleInput"
                v-bind="field"
                placeholder="My Custom Event Chart"
                autocomplete="off"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
                :default-value="props.event?.graphName"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
              <FieldDescription v-else>
                {{ $t('pages.dash.stats.charts.customEvents.fields.chartTitleDescription') }}
              </FieldDescription>
            </Field>
          </VeeField>

          <Field orientation="horizontal" class="flex items-center justify-between pt-2">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button type="button" variant="destructive" :disabled="isLoading">
                  <Spinner v-if="isLoading" />
                  <Trash2Icon v-else class="size-4" />
                  {{ $t('pages.dash.stats.charts.customEvents.edit.deleteButton') }}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {{ $t('pages.dash.stats.charts.customEvents.edit.deleteDialog.title') }}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {{ $t('pages.dash.stats.charts.customEvents.edit.deleteDialog.description') }}
                    <strong>{{ props.event?.graphName }}</strong>
                    {{
                      $t('pages.dash.stats.charts.customEvents.edit.deleteDialog.descriptionSuffix')
                    }}
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
                    {{ $t('pages.dash.stats.charts.customEvents.edit.deleteDialog.confirm') }}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" form="editEventForm" :disabled="$props.isLoading">
              <Spinner v-if="$props.isLoading" />
              {{ $t('pages.dash.stats.charts.customEvents.edit.saveButton') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
