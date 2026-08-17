<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { StepperTitleProps } from 'reka-ui'
import { StepperTitle, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<StepperTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <StepperTitle
    v-bind="forwarded"
    :class="
      cn(
        'mt-3 text-sm font-semibold text-muted-foreground transition-colors lg:text-base',
        'group-data-[disabled]:opacity-50',
        'group-data-[state=active]:text-primary',
        'group-data-[state=completed]:text-foreground',
        props.class,
      )
    "
  >
    <slot />
  </StepperTitle>
</template>
