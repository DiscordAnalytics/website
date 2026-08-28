<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { StepperIndicatorProps } from 'reka-ui'
import { StepperIndicator, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<StepperIndicatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperIndicator
    v-slot="slotProps"
    v-bind="forwarded"
    :class="
      cn(
        'relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full',
        'bg-muted text-sm font-medium text-muted-foreground transition-colors [&_svg]:size-5',
        // Disabled
        'group-data-[disabled]:opacity-50',
        // Active
        'group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground',
        'group-data-[state=active]:ring-2 group-data-[state=active]:ring-ring',
        'group-data-[state=active]:ring-offset-2 group-data-[state=active]:ring-offset-background',
        // Completed
        'group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </StepperIndicator>
</template>
