<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { ChevronsLeftRightEllipsisIcon } from 'lucide-vue-next'
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
