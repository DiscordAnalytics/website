<script setup lang="ts">
import fireworksParticlesOptions from '@/utils/particles/fireworks.ts'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StoreIcon } from 'lucide-vue-next'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { createAchievementFormSchema } from '@/utils/formSchemas.ts'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{
  isLoading: boolean
  open: boolean
  isAchievementCreated: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (
    e: 'created',
    values: {
      title: string
      description: string
      type: string
      objective: number
    },
  ): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(createAchievementFormSchema),
  initialValues: {
    type: 'GuildCount',
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  emit('created', values)
})
</script>

<template>
  <Dialog @update:open="(value) => $emit('update:open', value)">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent v-if="!isAchievementCreated">
      <DialogHeader>
        <DialogTitle>{{ $t('pages.dash.achievements.dialogs.create.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('pages.dash.achievements.dialogs.create.description') }}
        </DialogDescription>
      </DialogHeader>

      <form id="editEventForm" class="w-full" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="title">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="createAchievementTitleInput">
                {{ $t('pages.dash.achievements.dialogs.create.form.title') }}
              </FieldLabel>
              <Input
                id="createAchievementTitleInput"
                v-bind="field"
                placeholder="So famous"
                autocomplete="off"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="description">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="createAchievementDescriptionInput">
                {{ $t('pages.dash.achievements.dialogs.create.form.description') }}
              </FieldLabel>
              <Input
                id="createAchievementDescriptionInput"
                v-bind="field"
                placeholder="Be on 50k servers"
                autocomplete="off"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <div class="w-full flex items-end gap-2 my-2">
            <VeeField v-slot="{ field, errors }" name="objective">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="createAchievementObjectiveInput">
                  {{ $t('pages.dash.achievements.dialogs.create.form.condition') }}
                </FieldLabel>
                <Input
                  id="createAchievementObjectiveInput"
                  v-bind="field"
                  placeholder="50000"
                  autocomplete="off"
                  autofocus
                  type="number"
                  :aria-invalid="!!errors.length"
                  :disabled="isLoading"
                />
                <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="type">
              <Field :data-invalid="!!errors.length">
                <Select
                  :name="field.name"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  :disabled="isLoading"
                  class="w-full"
                  default-value="GuildCount"
                >
                  <SelectTrigger class="w-full" :aria-invalid="!!errors.length">
                    <SelectValue
                      :placeholder="
                        $t('pages.dash.achievements.dialogs.create.form.type.placeholder')
                      "
                    />
                  </SelectTrigger>
                  <SelectContent class="w-(--reka-select-trigger-width)">
                    <SelectItem value="GuildCount">
                      {{ $t('pages.dash.achievements.dialogs.create.form.type.guilds') }}
                    </SelectItem>
                    <SelectItem value="InteractionAverageWeek">
                      {{ $t('pages.dash.achievements.dialogs.create.form.type.interactions_week') }}
                    </SelectItem>
                    <SelectItem value="FrenchPercentage">
                      {{ $t('pages.dash.achievements.dialogs.create.form.type.french_percentage') }}
                    </SelectItem>
                    <SelectItem value="UserCount">
                      {{ $t('pages.dash.achievements.dialogs.create.form.type.users') }}
                    </SelectItem>
                    <SelectItem value="VotesCount">
                      {{ $t('pages.dash.achievements.dialogs.create.form.type.votes_month') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
              </Field>
            </VeeField>
          </div>

          <Field orientation="horizontal" class="flex items-center justify-end pt-2">
            <RouterLink to="/community/achievements">
              <Button class="w-full" variant="outline">
                <StoreIcon class="mr-2" />
                {{ $t('pages.dash.achievements.dialogs.create.buttons.explore') }}
              </Button>
            </RouterLink>
            <Button type="submit" form="editEventForm" :disabled="$props.isLoading">
              <Spinner v-if="$props.isLoading" />
              {{ $t('pages.dash.achievements.dialogs.create.buttons.submit') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
    <DialogContent v-else>
      <h1 class="text-center text-4xl font-bold">
        {{ $t('pages.dash.achievements.dialogs.create.success.title') }}
      </h1>
      <p>
        {{ $t('pages.dash.achievements.dialogs.create.success.description') }}
      </p>
      <RouterLink to="/community/achievements" class="w-full">
        <Button class="w-full">
          <StoreIcon class="mr-2" />
          {{ $t('pages.dash.achievements.dialogs.create.buttons.explore') }}
        </Button>
      </RouterLink>
      <DialogClose class="w-full">
        <Button variant="ghost" class="w-full">
          {{ $t('pages.dash.achievements.dialogs.create.buttons.not_now') }}
        </Button>
      </DialogClose>
    </DialogContent>
  </Dialog>

  <vue-particles
    v-if="isAchievementCreated"
    id="tsparticles"
    :options="fireworksParticlesOptions"
    class="z-60 fixed h-screen w-screen"
  />
</template>
