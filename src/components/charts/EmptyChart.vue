<script setup lang="ts">
import { FrownIcon } from '@lucide/vue'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui'
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FrownIcon />
      </EmptyMedia>
      <EmptyTitle>{{ $t('pages.dash.stats.charts.empty.title') }}</EmptyTitle>
      <EmptyDescription>{{ $t('pages.dash.stats.charts.empty.description') }}</EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
