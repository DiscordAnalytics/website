<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'
import { useI18n } from 'vue-i18n'

import { NavBar } from '@/components'
import { Separator } from '@/components/ui'
import { useConfig, useSeo } from '@/composables'

const config = useConfig()
const { t } = useI18n()

const apiSpecs = config.apiBaseUrl + '/openapi.json'

useSeo({
  title: () => t('pages.apiDocs.seo.title'),
  description: () => t('pages.apiDocs.seo.description'),
})
</script>

<template>
  <main class="max-h-screen h-svh overflow-y-clip">
    <NavBar class="max-w-425 mx-auto px-4" />
    <Separator />
    <ApiReference
      :configuration="{
        url: apiSpecs,
        hideClientButton: true,
        hideDarkModeToggle: true,
        agent: {
          disabled: true,
        },
      }"
      class=""
    />
  </main>
</template>

<style>
html,
body,
#app {
  @apply h-svh;
}

.dark-mode,
.light-mode {
  --scalar-color-1: var(--foreground);
  --scalar-color-2: var(--muted-foreground);
  --scalar-color-3: var(--muted-foreground);
  --scalar-color-accent: var(--primary);
  --scalar-background-1: var(--background);
  --scalar-background-2: var(--card);
  --scalar-background-3: var(--accent);
  --scalar-background-accent: #ff0000;
  --scalar-border-color: var(--border);
}

.scalar-api-reference {
  @apply h-screen! overflow-y-scroll!;
}
</style>
