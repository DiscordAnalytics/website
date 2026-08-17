<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { StepperTriggerProps } from 'reka-ui'
import { StepperTrigger, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<StepperTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperTrigger
    v-bind="forwarded"
    :class="
      cn(
        'relative z-10 flex items-center justify-center rounded-full outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed',
        props.class,
      )
    "
  >
    <slot />
  </StepperTrigger>
</template>
