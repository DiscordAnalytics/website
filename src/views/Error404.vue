<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import PageLayout from '@/components/layouts/PageLayout.vue'
import { useConfig } from '@/composables'

const { apiBaseUrl } = useConfig()

const userCount = ref<number>(1)
const showRickroll = ref(false)
const panicColor = ref('inherit')

const THRESHOLDS = [
  { min: 2, effect: 'bigger' },
  { min: 3, effect: 'pulse' },
  { min: 5, effect: 'bounce' },
  { min: 8, effect: 'slow-spin' },
  { min: 10, effect: 'spin' },
  { min: 12, effect: 'wobble' },
  { min: 15, effect: 'shake' },
  { min: 20, effect: 'violent-shake' },
  { min: 25, effect: 'glitch' },
  { min: 30, effect: 'color-panic' },
  { min: 50, effect: 'rickroll' },
] as const

type Effect = (typeof THRESHOLDS)[number]['effect']

const activeEffects = computed<Set<Effect>>(() => {
  return new Set(THRESHOLDS.filter((t) => userCount.value >= t.min).map((t) => t.effect))
})

const has = (effect: Effect) => activeEffects.value.has(effect)

function randomHex() {
  return (
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
  )
}

const composedStyle = computed(() => {
  const animations: string[] = []

  if (has('pulse')) animations.push('pulse 2s cubic-bezier(0.4,0,0.6,1) infinite')
  if (has('bounce')) animations.push('bounce 1s infinite')
  if (has('slow-spin')) animations.push('spin-slow 3s linear infinite')
  if (has('spin')) animations.push('spin-fast 0.5s linear infinite')
  if (has('wobble')) animations.push('wobble 0.8s ease-in-out infinite')
  if (has('shake')) animations.push('shake 0.4s ease-in-out infinite')
  if (has('violent-shake')) animations.push('violent-shake 0.2s ease-in-out infinite')
  if (has('glitch')) animations.push('glitch 0.6s steps(1) infinite')

  return {
    animation: animations.join(', ') || undefined,
    animationComposition: animations.length > 1 ? 'add' : undefined,
    color: panicColor.value,
    filter: has('glitch') ? 'drop-shadow(2px 0 0 red) drop-shadow(-2px 0 0 cyan)' : undefined,
  }
})

let ws: WebSocket | null = null
let panicInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  ws = new WebSocket(`${apiBaseUrl}/websocket/lost`)
  ws.onmessage = (message: MessageEvent) => {
    const res = JSON.parse(message.data) as { count: number } | undefined
    if (res) userCount.value = res.count
  }
})

onUnmounted(() => {
  ws?.close()
  if (panicInterval) clearInterval(panicInterval)
})

watch(
  () => has('color-panic'),
  (active) => {
    if (active) {
      panicInterval = setInterval(() => {
        panicColor.value = randomHex()
      }, 120)
    } else {
      if (panicInterval) clearInterval(panicInterval)
      panicColor.value = 'inherit'
    }
  },
  { immediate: true },
)
watch(
  () => has('rickroll'),
  (active) => {
    showRickroll.value = active
  },
)
</script>

<template>
  <PageLayout>
    <Teleport to="body">
      <iframe
        v-if="showRickroll"
        src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&rel=0"
        allow="autoplay; fullscreen"
        frameborder="0"
        class="fixed w-screen h-screen -z-1 pointer-events-none top-0 left-0"
        @load="
          (e) => {
            const frame = e.target as HTMLIFrameElement
            frame.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
              '*',
            )
            frame.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
              '*',
            )
          }
        "
      />
    </Teleport>

    <div class="flex flex-col items-center my-64 [body,#app]:bg-transparent">
      <h1
        :class="
          cn(
            'font-bold my-6 transition-[font-size] duration-500',
            has('bigger') ? 'text-[10rem]' : 'text-8xl',
          )
        "
        :style="composedStyle"
      >
        {{ $t('pages.error404.title') }}
      </h1>

      <p class="my-2">
        {{ $t('pages.error404.description') }}
      </p>

      <p class="text-xs">
        <template v-if="userCount === 1">
          {{ $t('pages.error404.lost.solo') }}
        </template>
        <template v-else>
          {{ $t('pages.error404.lost.multiple', { count: userCount }) }}
        </template>
      </p>
    </div>
  </PageLayout>
</template>
