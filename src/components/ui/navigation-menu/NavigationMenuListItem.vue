<script setup lang="ts">
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

const props = defineProps({
  title: String,
  to: {
    type: String,
    required: false,
    default: undefined,
  },
})
</script>

<template>
  <li>
    <NavigationMenuLink as-child>
      <a
        v-bind="$attrs"
        :href="props.to || '#'"
        class="focus:shadow-md hover:bg-linear-to-b from-muted/50 to-muted block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-hidden transition-colors"
      >
        <div class="mb-1.25 font-medium leading-[1.2]">
          {{ props.title }}
        </div>
        <p class="text-muted-foreground my-0 leading-[1.4]">
          <slot />
        </p>
      </a>
    </NavigationMenuLink>
  </li>
</template>
