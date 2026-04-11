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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
    await Promise.all(props.users.map((user) => suspendUser(user.userId, values.reason)))
    toast.success(t('pages.dash.admin.users.suspend.toast'))
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
        <DialogTitle>
          {{
            $t('pages.dash.admin.users.suspend.title', $props.users.length, {
              named: {
                username: $props.users[0]?.username,
                count: $props.users.length,
              },
            })
          }}
        </DialogTitle>
        <DialogDescription>
          {{
            $t('pages.dash.admin.users.suspend.description', $props.users.length, {
              named: {
                username: $props.users[0]?.username,
              },
            })
          }}
        </DialogDescription>
      </DialogHeader>

      <form id="suspendUsersForm" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="reason">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="reasonInput">
                {{ $t('pages.dash.admin.users.fields.reason.label') }}
              </FieldLabel>
              <Input
                id="reasonInput"
                v-bind="field"
                :placeholder="$t('pages.dash.admin.users.fields.reason.placeholder')"
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
                  <p class="text-sm leading-none font-medium">
                    {{ $t('pages.dash.admin.users.fields.sure.label') }}
                  </p>
                  <p class="text-muted-foreground text-sm">
                    {{ $t('pages.dash.admin.users.fields.sure.description') }}
                  </p>
                </div>
              </Label>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <Field>
            <Button type="submit" form="suspendUsersForm" :disabled="isLoading" class="w-full">
              <Spinner v-if="isLoading" />
              {{
                $t('pages.dash.admin.users.suspend.submit', $props.users.length, {
                  named: {
                    username: $props.users[0]?.username,
                  },
                })
              }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
