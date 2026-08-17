<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { StepperSeparatorProps } from 'reka-ui'
import { StepperSeparator, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<StepperSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)

const base = 'absolute top-5 h-0.5 -translate-y-1/2 rounded-full bg-muted transition-colors'
</script>

<template>
  <StepperSeparator
    v-bind="forwarded"
    :class="
      cn(
        base,
        'left-[calc(50%+24px)] right-0 group-last:hidden md:right-[calc(-50%+24px)]',
        'data-[state=completed]:bg-primary',
        'group-data-[disabled]:opacity-50',
        props.class,
      )
    "
  />
  <StepperSeparator
    v-bind="forwarded"
    :class="
      cn(
        base,
        'left-0 right-[calc(50%+24px)] group-first:hidden md:hidden',
        'data-[state=active]:bg-primary data-[state=completed]:bg-primary',
        'group-data-[disabled]:opacity-50',
        props.class,
      )
    "
  />
</template>
