<script setup lang="ts">
import { SearchXIcon } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

import { PageLayout } from '@/components'
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui'
import { useSeo } from '@/composables'

const { t } = useI18n()

useSeo({
  title: () => t('pages.features.not_found.title'),
  description: () => t('pages.features.not_found.description'),
  noindex: true,
})
</script>

<template>
  <PageLayout>
    <Empty class="min-h-200">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.features.not_found.title') }}</EmptyTitle>
        <EmptyDescription>{{ $t('pages.features.not_found.description') }}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <RouterLink class="w-full" to="/#learn-more">
          <Button class="w-full">{{ $t('pages.features.not_found.cta') }}</Button>
        </RouterLink>
      </EmptyContent>
    </Empty>
  </PageLayout>
</template>
