<script setup lang="ts">
import type { NavigationMenuViewportProps } from 'reka-ui'
import { NavigationMenuViewport as NavigationMenuViewportPrimitive, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<NavigationMenuViewportProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <NavigationMenuViewportPrimitive
    v-bind="forwardedProps"
    :style="{ height: 'var(--reka-navigation-menu-viewport-height)' }"
    :class="
      cn(
        'absolute left-0 top-full flex justify-center origin-top-center mt-1.5 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[--reka-navigation-menu-viewport-width]',
        props.class,
      )
    "
  />
</template>
