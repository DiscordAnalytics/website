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
import { adminUpdateBotsLimitFormSchema } from '@/utils/formSchemas.ts'
import { toast } from 'vue-sonner'
import { ref, watch } from 'vue'
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

const { updateLimits: updateUserLimits } = useUsers()
const form = useForm({
  validationSchema: toTypedSchema(adminUpdateBotsLimitFormSchema),
})

const isLoading = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    for (const user of props.users) {
      await updateUserLimits(user.userId, values.limit)
    }
    toast.success(t('pages.dash.admin.users.editLimits.toast'))
  } catch (e: any) {
    toast.error(e.message)
  }
  isLoading.value = false
  emit('update:open', false)
})

watch(
  () => props.users,
  (value) => {
    form.setValues({ limit: value.length === 1 ? value[0]?.botsLimit : 3 })
  },
)
</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{
            $t('pages.dash.admin.users.editLimits.title', $props.users.length, {
              named: { count: $props.users.length, username: $props.users[0]?.username },
            })
          }}
        </DialogTitle>
        <DialogDescription>
          {{
            $t('pages.dash.admin.users.editLimits.description', $props.users.length, {
              named: { username: $props.users[0]?.username },
            })
          }}
        </DialogDescription>
      </DialogHeader>

      <form id="updateBotsLimitForm" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="limit">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="limitInput">
                {{ $t('pages.dash.admin.users.fields.botsLimit.label') }}
              </FieldLabel>
              <Input
                id="limitInput"
                v-bind="field"
                :default-value="$props.users.length === 1 ? $props.users[0]?.botsLimit : 3"
                placeholder="5"
                type="number"
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
            <Button type="submit" form="updateBotsLimitForm" :disabled="isLoading" class="w-full">
              <Spinner v-if="isLoading" />
              {{ $t('pages.dash.admin.users.editLimits.submit') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
