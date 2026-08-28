<script lang="ts" setup>
import { injectStepperRootContext } from 'reka-ui'
import { type HTMLAttributes, computed, nextTick, onMounted, ref, watch } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const { modelValue } = injectStepperRootContext()

const track = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const offset = computed(() => String(-activeIndex.value))

async function syncActiveIndex() {
  await nextTick()
  const items = Array.from(track.value?.children ?? [])
  const index = items.findIndex((item) => item.getAttribute('data-state') === 'active')
  if (index !== -1) activeIndex.value = index
}

onMounted(syncActiveIndex)
watch(modelValue, syncActiveIndex)
</script>

<template>
  <div class="overflow-x-clip py-1 md:overflow-x-visible">
    <div
      ref="track"
      :style="{ '--stepper-offset': offset }"
      :class="
        cn(
          'flex w-full items-start transition-transform duration-300 ease-in-out',
          'translate-x-[calc(var(--stepper-offset)*100%)]',
          'md:translate-x-0 md:transition-none',
          props.class,
        )
      "
    >
      <slot />
    </div>
  </div>
</template>
