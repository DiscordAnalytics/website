<script setup lang="ts">
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from '@/components/ui'
import { ref } from 'vue'
import { useBotTeam, useLoading } from '@/composables'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { adminCreateInvitationFormSchema } from '@/utils/formSchemas.ts'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'created'): void
}>()

const { isLoading, withLoading } = useLoading()
const form = useForm({
  validationSchema: toTypedSchema(adminCreateInvitationFormSchema),
})

const isOpen = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  await withLoading(async () => {
    const { add } = useBotTeam(ref(values.botId))
    await add(values.userId)
      .then(() => {
        toast.success(t('pages.dash.admin.invitations.create.toast'))
        isOpen.value = false
        emit('created')
      })
      .catch((e) => toast.error(e.message))
  })
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
