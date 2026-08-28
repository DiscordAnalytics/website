<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { StepperDescriptionProps } from 'reka-ui'
import { StepperDescription, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<StepperDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperDescription
    v-slot="slotProps"
    v-bind="forwarded"
    :class="
      cn(
        'mt-1 text-xs text-balance text-muted-foreground group-data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </StepperDescription>
</template>
