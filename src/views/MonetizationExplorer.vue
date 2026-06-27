<script setup lang="ts">
import { ChevronsLeftRightEllipsisIcon } from '@lucide/vue'

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
</script>

<template>
  <PageLayout>
    <Empty class="min-h-200">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ChevronsLeftRightEllipsisIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.appMonetizationExplorer.title') }}</EmptyTitle>
        <EmptyDescription>
          {{ $t('pages.appMonetizationExplorer.description') }}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <RouterLink class="w-full" :to="`/support`">
          <Button class="w-full">{{ $t('pages.appMonetizationExplorer.cta') }}</Button>
        </RouterLink>
      </EmptyContent>
    </Empty>
  </PageLayout>
</template>
