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
        <EmptyTitle>Coming soon...</EmptyTitle>
        <EmptyDescription>
          We're currently working on an improved version of the App Monetization Explorer. Join the
          support server to receive a notification when it becomes available.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <RouterLink class="w-full" :to="`/support`">
          <Button class="w-full">Join Support</Button>
        </RouterLink>
      </EmptyContent>
    </Empty>
  </PageLayout>
</template>
