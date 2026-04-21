<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAchievementsStore from '@/composables/useAchievementsStore.ts'
import { computed, onMounted, ref } from 'vue'
import { FrownIcon, FunnelXIcon, SparklesIcon } from '@lucide/vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from 'vue-i18n'
import { selectLocale } from '@/utils/functions.ts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentUser, useLoading } from '@/composables'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { copyAchievementFormSchema } from '@/utils/formSchemas.ts'
import { Field, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import type { Achievement } from '@/utils/types.ts'
import { toast } from 'vue-sonner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const { achievements, fetch: fetchAchievements, copy: copyAchievement } = useAchievementsStore()
const { userInfos, ownedBots: userBots } = useCurrentUser()
const i18n = useI18n()

const { isLoading, withLoading } = useLoading()
const langFilter = ref<string | null>(null)
const selectedAchievement = ref<Achievement | null>(null)
const isCopyModelOpen = ref<boolean>(false)
const filteredAchievements = computed(() =>
  langFilter.value
    ? achievements.value.filter((achievement) => achievement.lang === langFilter.value)
    : achievements.value,
)

const form = useForm({
  validationSchema: toTypedSchema(copyAchievementFormSchema),
})

const onSubmit = form.handleSubmit(async (values) => {
  await withLoading(async () => {
    await copyAchievement(values.botId, selectedAchievement.value!.id)
      .then(() => {
        toast.success('Achievement successfully copied!')
        isCopyModelOpen.value = false
      })
      .catch((err) => {
        toast.error(err.message)
      })
  })
})

onMounted(async () => {
  if (achievements.value.length === 0) {
    await withLoading(async () => {
      await fetchAchievements()
    })
  }
})
</script>

<template>
  <PageLayout>
    <header class="mt-16">
      <h1 class="text-4xl font-bold mb-2">{{ $t('pages.achievementsStore.header.title') }}</h1>
      <p>{{ $t('pages.achievementsStore.header.description') }}</p>
    </header>
    <div class="flex justify-end gap-2">
      <Button v-if="langFilter" variant="outline" size="icon" @click="langFilter = null">
        <FunnelXIcon />
      </Button>
      <Select v-model:model-value="langFilter">
        <SelectTrigger class="w-full max-w-48">
          <SelectValue :placeholder="$t('pages.achievementsStore.dropdown.placeholder')" />
        </SelectTrigger>
        <SelectContent class="w-(--reka-select-trigger-width)">
          <SelectGroup>
            <SelectLabel>{{ $t('components.navbar.customize.language.title') }}</SelectLabel>
            <SelectItem v-for="locale in i18n.availableLocales" :value="locale" :key="locale">
              {{ selectLocale(locale) }}
            </SelectItem>
            <SelectItem value="other">
              {{ $t('pages.achievementsStore.dropdown.other') }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-16 mt-8">
      <Card
        v-for="achievement in filteredAchievements"
        :key="achievement.id"
        class="w-full h-full text-left cursor-pointer hover:bg-background"
        @click="
          () => {
            selectedAchievement = achievement
            isCopyModelOpen = true
          }
        "
      >
        <CardHeader>
          <CardTitle class="truncate">
            {{
              achievement.titleI18n
                ? $t(achievement.titleI18n, { username: 'BOT' })
                : achievement.title.replace(/{username}/g, 'BOT')
            }}
          </CardTitle>
          <CardDescription class="truncate">
            {{
              achievement.descriptionI18n
                ? $t(achievement.descriptionI18n, { username: 'BOT' })
                : achievement.description.replace(/{username}/g, 'BOT')
            }}
          </CardDescription>
        </CardHeader>
        <CardContent class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span
              v-if="achievement.descriptionI18n && achievement.titleI18n"
              class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1"
            >
              {{ $t('pages.achievementsStore.dialog.trigger.multiple_langs') }}
            </span>
            <span v-else class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1">
              {{ selectLocale(achievement.lang!) }}
            </span>
            <span
              v-if="achievement.title.includes('{username}')"
              class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1"
            >
              <SparklesIcon />
              {{ $t('pages.achievementsStore.dialog.trigger.dynamic_achievement') }}
            </span>
          </div>
          <span
            v-if="achievement.usedBy > 0"
            class="bg-accent rounded px-2 py-1 text-sm flex items-center gap-1"
          >
            {{
              $t('pages.achievementsStore.dialog.trigger.used_by', achievement.usedBy, {
                named: { amount: achievement.usedBy },
              })
            }}
          </span>
        </CardContent>
      </Card>
    </main>

    <Dialog
      v-model:open="isCopyModelOpen"
      @update:open="
        (value) => {
          if (!value) selectedAchievement = null
        }
      "
    >
      <DialogContent v-if="userInfos && userBots.length > 0">
        <DialogHeader>
          <DialogTitle>
            {{ $t('pages.achievementsStore.dialog.header.title.default') }}
          </DialogTitle>
          <DialogDescription>
            {{ $t('pages.achievementsStore.dialog.header.description.default') }}
          </DialogDescription>
        </DialogHeader>
        <form id="copyAchievementForm" @submit="onSubmit">
          <VeeField v-slot="{ field, errors }" name="botId">
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
                    :placeholder="$t('pages.achievementsStore.dialog.selectPlaceholder')"
                  />
                </SelectTrigger>
                <SelectContent class="w-(--reka-select-trigger-width)">
                  <SelectGroup>
                    <SelectLabel>
                      {{ $t('pages.achievementsStore.dialog.your_bots') }}
                    </SelectLabel>
                    <SelectItem
                      v-for="bot in userBots.filter((b) => b.ownerId === userInfos!.userId)"
                      :key="bot.botId"
                      :value="bot.botId"
                      class="flex items-center gap-1"
                    >
                      <div class="flex items-center gap-1">
                        <DiscordAvatar
                          :id="bot.botId"
                          :avatar="bot.avatar"
                          :alt="bot.username"
                          size="sm"
                        />
                        <span class="truncate">
                          {{ bot.username }}
                        </span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>
          <Field orientation="horizontal" class="flex items-center justify-end pt-2">
            <Button type="submit" form="copyAchievementForm" :disabled="isLoading">
              <Spinner v-if="isLoading" />
              {{ $t('pages.achievementsStore.dialog.add') }}
            </Button>
          </Field>
        </form>
      </DialogContent>
      <DialogContent v-else-if="userInfos && userBots.length === 0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FrownIcon />
            </EmptyMedia>
            <EmptyTitle>{{ $t('pages.achievementsStore.dialog.header.title.oops') }}</EmptyTitle>
            <EmptyDescription>
              {{ $t('pages.achievementsStore.dialog.header.description.oops') }}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RouterLink class="w-full" :to="`/dash/onboarding`">
              <Button class="w-full">
                {{ $t('pages.achievementsStore.dialog.add_bot') }}
              </Button>
            </RouterLink>
          </EmptyContent>
        </Empty>
      </DialogContent>
      <DialogContent v-else>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FrownIcon />
            </EmptyMedia>
            <EmptyTitle>{{ $t('pages.achievementsStore.dialog.header.title.oops') }}</EmptyTitle>
            <EmptyDescription>
              {{ $t('pages.achievementsStore.dialog.header.description.no_logged_in') }}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RouterLink
              class="w-full"
              :to="`/auth?redirect=${encodeURIComponent('/community/achievements')}`"
            >
              <Button class="w-full">
                {{ $t('pages.achievementsStore.dialog.login') }}
              </Button>
            </RouterLink>
          </EmptyContent>
        </Empty>
      </DialogContent>
    </Dialog>
  </PageLayout>
</template>
