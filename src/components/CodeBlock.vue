<script setup lang="ts">
import { CheckIcon, CopyIcon } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import DOMPurify from 'dompurify'
import { type BundledLanguage, createHighlighter } from 'shiki'
import { onMounted, ref, watch } from 'vue'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    code: string
    lang?: BundledLanguage
    /** 1-based line numbers. */
    addedLines?: number[]
  }>(),
  { lang: 'bash', addedLines: () => [] },
)

const highlighted = ref<string>('')

const { copy, copied, isSupported: isCopySupported } = useClipboard({ copiedDuring: 2000 })

onMounted(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [props.lang],
  })

  const render = () => {
    const rawHtml = highlighter.codeToHtml(props.code, {
      lang: props.lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        {
          name: 'added-lines',
          line(node, line) {
            if (props.addedLines.includes(line)) this.addClassToHast(node, 'line-added')
          },
        },
      ],
    })

    highlighted.value = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['pre', 'code', 'span'],
      ALLOWED_ATTR: ['class', 'style', 'tabindex'],
    })
  }

  render()
  watch(() => [props.code, props.lang, props.addedLines], render)
})
</script>

<template>
  <div class="relative my-2 overflow-hidden rounded-lg border bg-muted">
    <Button
      v-if="isCopySupported"
      variant="ghost"
      size="icon-sm"
      class="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
      :title="copied ? $t('components.codeBlock.copied') : $t('components.codeBlock.copy')"
      :aria-label="copied ? $t('components.codeBlock.copied') : $t('components.codeBlock.copy')"
      @click="copy(props.code)"
    >
      <CheckIcon v-if="copied" />
      <CopyIcon v-else />
    </Button>
    <div
      v-html="highlighted"
      :class="
        cn(
          'overflow-auto text-sm [&>pre]:py-4 [&_.line]:px-4',
          props.addedLines.length > 0 && '[&_.line]:pl-9',
        )
      "
    />
  </div>
</template>

<style scoped>
@reference '../assets/index.css';

:deep(.line-added) {
  @apply relative inline-block w-full bg-green-500/15;

  --diff-marker: var(--color-green-700, oklch(52.7% 0.154 150.069));
}

:deep(.line-added:is(.dark *)) {
  --diff-marker: var(--color-green-400, oklch(79.2% 0.209 151.711));
}

:deep(.line-added)::before {
  content: '+';
  color: var(--diff-marker);
  @apply absolute left-3 font-semibold;
}
</style>
