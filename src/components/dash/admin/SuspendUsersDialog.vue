<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { adminAskForReasonFormSchema } from '@/utils/formSchemas.ts'
import { toast } from 'vue-sonner'
import { ref } from 'vue'
import type { User } from '@/utils/types.ts'
import { useUsers } from '@/composables'

const props = defineProps<{
  users: User[]
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { suspend: suspendUser } = useUsers()
const form = useForm({
  validationSchema: toTypedSchema(adminAskForReasonFormSchema),
})

const isLoading = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    for (const user of props.users) {
      await suspendUser(user.userId, values.reason)
    }
    toast.success('The selected users have been successfully suspended.')
  } catch (e: any) {
    toast.error(e.message)
  }
  isLoading.value = false
  emit('update:open', false)
})
</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Suspend {{ $props.users.length }} users...</DialogTitle>
        <DialogDescription>
          You're about to suspended the selected users which means they won't be able to use Discord
          Analytics until the suspension is revoked (this also includes users' bots).
        </DialogDescription>
      </DialogHeader>

      <form id="suspendUsersForm" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="reason">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="reasonInput">Reason</FieldLabel>
              <Input
                id="reasonInput"
                v-bind="field"
                placeholder="The user did not respect our Terms of Service"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="sure">
            <Field :data-invalid="!!errors.length">
              <Label class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3">
                <Checkbox
                  id="acceptTosCheckbox"
                  :default-value="false"
                  :aria-invalid="!!errors.length"
                  :disabled="isLoading"
                  @update:model-value="
                    (checked) => {
                      field.onChange(checked)
                    }
                  "
                />
                <div class="grid gap-1.5 font-normal">
                  <p class="text-sm leading-none font-medium">Are you sure?</p>
                  <p class="text-muted-foreground text-sm">
                    Please confirm that you know what you're doing and that the action will be
                    immediate.
                  </p>
                </div>
              </Label>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <Field>
            <Button type="submit" form="suspendUsersForm" :disabled="isLoading" class="w-full">
              <Spinner v-if="isLoading" />
              {{ $t('pages.dash.onboarding.stepOne.submit') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
