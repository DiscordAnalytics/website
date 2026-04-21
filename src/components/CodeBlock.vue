<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { type BundledLanguage, createHighlighter } from 'shiki'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    code: string
    lang?: BundledLanguage
  }>(),
  { lang: 'bash' },
)

const highlighted = ref<string>('')

onMounted(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [props.lang],
  })

  const render = () => {
    highlighted.value = highlighter.codeToHtml(props.code, {
      lang: props.lang,
      themes: { light: 'github-light', dark: 'github-dark' },
    })
  }

  render()
  watch(() => [props.code, props.lang], render)
})
</script>

<template>
  <div class="relative rounded my-2 bg-muted dark:bg-[#24292e]">
    <Button
      variant="outline"
      size="icon-lg"
      class="bg-transparent shadow-none hover:bg-background sticky top-4 right-4 float-right mt-4 mr-4"
    >
      <CopyIcon />
    </Button>
    <div v-html="highlighted" class="overflow-auto text-sm [&>pre]:px-8 [&>pre]:py-6" />
  </div>
</template>
