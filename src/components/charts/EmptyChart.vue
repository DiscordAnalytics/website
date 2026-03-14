<script setup lang="ts">
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { FrownIcon } from 'lucide-vue-next'
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FrownIcon />
      </EmptyMedia>
      <EmptyTitle>Empty chart</EmptyTitle>
      <EmptyDescription>No data in this chart for the selected date range</EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
