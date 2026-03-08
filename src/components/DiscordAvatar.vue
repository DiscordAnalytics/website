<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils.ts'
import { useElementHover, useWindowFocus } from '@vueuse/core'

interface Props {
  id: string
  avatar?: string
  alt: string
  avatarDecoration?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animation?: 'window-focus' | 'hover' | 'disabled'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  animation: 'window-focus',
})

const isWindowFocused = useWindowFocus()
const avatarBox = useTemplateRef('avatarBox')
const isAvatarDecorationHovered = useElementHover(avatarBox)

const sizeConfig = {
  sm: {
    container: 'h-10 w-10',
    avatar: 'h-8 w-8',
    decoration: 'h-10 w-10',
  },
  md: {
    container: 'h-13 w-13',
    avatar: 'h-10 w-10',
    decoration: 'h-13 w-13',
  },
  lg: {
    container: 'h-21 w-21',
    avatar: 'h-16 w-16',
    decoration: 'h-21 w-21',
  },
  xl: {
    container: 'h-26 w-26',
    avatar: 'h-20 w-20',
    decoration: 'h-26 w-26',
  },
}

const avatarFallbackUrl = computed(
  () => `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(props.id) >> 22n) % 6n)}.png`,
)

const avatarUrl = computed(() => {
  if (props.avatar) return `https://cdn.discordapp.com/avatars/${props.id}/${props.avatar}.webp`
  else return avatarFallbackUrl.value
})

const animateDecoration = computed(() => {
  if (props.animation === 'window-focus') return isWindowFocused.value
  else if (props.animation === 'hover') return isAvatarDecorationHovered.value
  else return false
})

const avatarDecorationUrl = computed(() => {
  if (!props.avatarDecoration) return null
  return `https://cdn.discordapp.com/avatar-decoration-presets/${props.avatarDecoration}.${animateDecoration.value ? 'png' : 'webp'}`
})
</script>

<template>
  <div
    :class="
      cn(
        'relative inline-flex items-center justify-center',
        avatarDecorationUrl ? sizeConfig[size].container : sizeConfig[size].avatar,
      )
    "
    ref="avatarBox"
  >
    <img
      v-if="avatarDecorationUrl"
      :src="avatarDecorationUrl"
      :alt="alt"
      :class="sizeConfig[size].decoration"
      class="absolute inset-0 object-contain pointer-events-none select-none"
    />

    <Avatar :class="[sizeConfig[size].avatar, $attrs.class]">
      <AvatarImage :src="avatarUrl" :alt="alt" />
      <AvatarFallback>
        <img :src="avatarFallbackUrl" :alt="alt" />
      </AvatarFallback>
    </Avatar>
  </div>
</template>
