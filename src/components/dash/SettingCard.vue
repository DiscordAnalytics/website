<script setup lang="ts">
import { type Component } from 'vue'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils.ts'

withDefaults(
  defineProps<{
    icon: Component
    title: string
    description: string
    variant?: 'outline' | 'destructive'
  }>(),
  {
    variant: 'outline',
  },
)
</script>

<template>
  <Item
    variant="outline"
    :class="
      cn(
        'flex-col md:flex-row items-start md:items-center justify-between flex-nowrap',
        $props.variant === 'destructive' && 'border-destructive',
      )
    "
  >
    <div class="flex flex-row gap-4">
      <ItemMedia>
        <component
          :is="$props.icon"
          :class="$props.variant === 'destructive' && 'text-destructive'"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle class="text-xl">{{ $props.title }}</ItemTitle>
        <ItemDescription class="line-clamp-none">{{ $props.description }}</ItemDescription>

        <slot name="content" />
      </ItemContent>
    </div>
    <ItemActions class="w-full md:w-fit">
      <slot name="actions" />
    </ItemActions>
  </Item>
</template>
