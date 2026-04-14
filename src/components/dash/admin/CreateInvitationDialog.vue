<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { adminCreateInvitationFormSchema } from '@/utils/formSchemas.ts'
import { useBotTeam } from '@/composables'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'created'): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(adminCreateInvitationFormSchema),
})

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  const { add } = useBotTeam(ref(values.botId))
  await add(values.userId)
    .then(() => {
      toast.success(t('pages.dash.admin.invitations.create.toast'))
      isOpen.value = false
      emit('created')
    })
    .catch((e) => toast.error(e.message))
  isLoading.value = false
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger>
      <slot />
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t('pages.dash.admin.invitations.create.title') }}</DialogTitle>
        <DialogDescription>
          {{ t('pages.dash.admin.invitations.create.description') }}
        </DialogDescription>
      </DialogHeader>

      <form id="createInvitationForm" class="w-full" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="botId">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="botIdInput">
                {{ t('pages.dash.admin.invitations.create.botIdLabel') }}
              </FieldLabel>
              <Input
                id="botIdInput"
                v-bind="field"
                placeholder="1082615775619199057"
                autocomplete="off"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="userId">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="userIdInput">
                {{ t('pages.dash.admin.invitations.create.userIdLabel') }}
              </FieldLabel>
              <Input
                id="userIdInput"
                v-bind="field"
                placeholder="1082615775619199057"
                autocomplete="off"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <Field orientation="horizontal" class="flex justify-end">
            <Button type="submit" form="createInvitationForm" :disabled="isLoading">
              <Spinner v-if="isLoading" />
              {{ t('pages.dash.admin.invitations.create.submit') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
