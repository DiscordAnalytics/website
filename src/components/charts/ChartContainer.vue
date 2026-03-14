<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, watch } from 'vue'
import type { ChartTab } from '@/utils/types.ts'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  title: string
  description: string
  tabs: ChartTab[]
  isLoading: boolean
}>()

const activeTab = ref<string>(props.tabs.length > 0 ? props.tabs[0]!.id : '')

watch(props, ({ tabs }) => {
  if (tabs.length > 0) activeTab.value = tabs[0]!.id
})
</script>

<template>
  <Card class="py-4 sm:py-0">
    <CardHeader class="flex flex-col items-stretch border-b p-0! sm:flex-row min-h-25">
      <div class="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
        <CardTitle>{{ $props.title }}</CardTitle>
        <CardDescription>{{ $props.description }}</CardDescription>
      </div>
      <div class="flex">
        <button
          v-for="tab in [...$props.tabs]"
          :key="tab.id"
          :data-active="activeTab === tab.id && $props.tabs.length > 1"
          class="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
          @click="activeTab = tab.id"
        >
          <span class="text-muted-foreground text-xs">
            {{ tab.label }}
          </span>
          <Skeleton v-if="isLoading" class="w-14 h-8" />
          <span v-else class="text-lg leading-none font-bold sm:text-3xl">
            {{ tab.value.toLocaleString() }}
          </span>
        </button>
      </div>
    </CardHeader>
    <CardContent class="px-2 sm:p-6">
      <slot :activeTab="activeTab" :tabs="$props.tabs" />
    </CardContent>
  </Card>
</template>
