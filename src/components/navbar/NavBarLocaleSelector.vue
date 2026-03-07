<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { maintainedLocales } from '@/locales'
import { toast } from 'vue-sonner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{
  mobile?: boolean
}>()

const i18n = useI18n()

function selectLocale(locale: string) {
  switch (locale) {
    case 'fr':
      return i18n.t('components.navbar.customize.language.locales.fr')
    case 'tr':
      return i18n.t('components.navbar.customize.language.locales.tr')
    case 'en':
    default:
      return i18n.t('components.navbar.customize.language.locales.en')
  }
}

function switchLocale(locale: (typeof i18n.availableLocales)[number]) {
  if (i18n.availableLocales.includes(locale)) {
    i18n.locale.value = locale
    localStorage.setItem('locale', locale)
    document.querySelector('html')?.setAttribute('lang', locale)
    if (!maintainedLocales.includes(locale))
      toast({
        description: i18n.t('components.navbar.customize.language.not_maintained'),
      })
  }
}
</script>

<template>
  <Select
    :default-value="i18n.locale.value"
    @update:model-value="(value) => switchLocale(value as (typeof i18n.availableLocales)[number])"
  >
    <SelectTrigger :class="$props.mobile ? 'w-full' : 'border-none shadow-none gap-1'">
      <SelectValue placeholder="Select lang" />
    </SelectTrigger>
    <SelectContent class="w-(--reka-select-trigger-width)">
      <SelectGroup>
        <SelectLabel>{{ $t('components.navbar.customize.language.title') }}</SelectLabel>
        <SelectItem v-for="locale in i18n.availableLocales" :value="locale" :key="locale">
          {{ selectLocale(locale) }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
