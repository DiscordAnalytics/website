<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from 'vue-i18n'
import { maintainedLocales } from '@/locales'
import { toast } from 'vue-sonner'
import { ChevronDownIcon } from 'lucide-vue-next'

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
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost">
        {{ selectLocale(i18n.locale.value) }}
        <ChevronDownIcon class="ml-2" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{{ $t('components.navbar.customize.language.title') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="locale in i18n.availableLocales"
        :id="locale"
        :key="locale"
        @click="switchLocale(locale)"
      >
        {{ selectLocale(locale) }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
