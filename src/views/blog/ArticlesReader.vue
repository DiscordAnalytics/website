<script setup lang="ts">
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'
import type { Anchor, BlogArticle } from '@/utils/types.ts'
import PageLayout from '@/components/layouts/PageLayout.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useBlogArticles } from '@/composables'
import { useRoute } from 'vue-router'
import ThemedImg from '@/components/ThemedImg.vue'
import { df, dfWithHour } from '@/utils/dateTime.ts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import VueMarkdown from 'vue-markdown-render'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import MarkdownItAnchor from 'markdown-it-anchor'
import TableOfContent from '@/components/TableOfContent.vue'

const { getArticle } = useBlogArticles()
const route = useRoute()

const article = ref<BlogArticle | null>(null)
const articleId = computed(() => route.params.articleId as string)
const articleEl = useTemplateRef('articleEl')
const anchors = computed<Anchor[]>(() => {
  if (!articleEl.value) return []
  return Array.from(
    articleEl.value.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'),
  ).map((el, index) => ({
    id: index,
    text: el.textContent ?? '',
    link: el.id,
    level: parseInt(el.tagName[1] ?? '0'),
    children: [],
  }))
})

onBeforeMount(async () => {
  article.value = await getArticle(articleId.value)
})
</script>

<template>
  <PageLayout>
    <main class="grid grid-cols-2 lg:grid-cols-4 my-16">
      <span class="hidden lg:block lg:col-span-1" />
      <article
        ref="articleEl"
        v-if="article"
        class="col-span-2 prose lg:prose-xl mx-auto max-w-full md:max-w-auto"
      >
        <AspectRatio :ratio="16 / 5" class="not-prose">
          <img
            v-if="article.cover"
            :src="article.cover"
            alt="Article Cover"
            class="h-full w-full object-cover rounded"
          />
          <ThemedImg
            v-else
            dark-img="/brand/long_logo_light.webp"
            light-img="/brand/long_logo_dark.webp"
            alt="Discord Analytics"
            class="h-full w-full rounded"
          />
        </AspectRatio>

        <h1 class="text-5xl font-extrabold my-5">{{ article.title }}</h1>

        <div class="flex items-center gap-3 not-prose">
          <DiscordAvatar
            :id="article.authorId"
            :avatar="article.author.avatar"
            :alt="article.author.username"
          />
          <div class="flex flex-col gap-1.5">
            <p class="text-lg">{{ article.author.username }}</p>
            <TooltipProvider v-if="article.updatedAt">
              <Tooltip>
                <TooltipTrigger as-child>
                  <p class="text-base text-muted-foreground">
                    {{ df.format(new Date(article.createdAt)) }} {{ $t('pages.blog.updated') }}
                  </p>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  :align-offset="-5"
                  :arrow-padding="1"
                  avoid-collisions
                  :collision-boundary="null"
                  :collision-padding="5"
                  hide-when-detached
                  side="bottom"
                  :sticky="undefined"
                  position-strategy="absolute"
                  update-position-strategy="optimized"
                >
                  {{ $t('pages.blog.updated_on') }}
                  {{ dfWithHour.format(new Date(article.updatedAt)) }}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p v-else class="text-base text-muted">
              {{ df.format(new Date(article.createdAt)) }}
            </p>
          </div>
        </div>

        <VueMarkdown :source="article.content" :plugins="[MarkdownItAnchor]" />
      </article>
      <article v-else class="col-span-2">
        <AspectRatio :ratio="16 / 5">
          <Skeleton class="h-full w-full" />
        </AspectRatio>

        <div class="flex flex-col gap-3 my-5">
          <Skeleton class="h-9 w-full" />
          <Skeleton class="h-9 w-2/3" />
        </div>

        <div class="flex items-center gap-3 mb-5">
          <Skeleton class="h-9 w-9 rounded-full shrink-0" />
          <div class="flex flex-col gap-1.5">
            <Skeleton class="h-3.5 w-28" />
            <Skeleton class="h-3 w-20" />
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div v-for="i in 8" class="flex flex-col gap-2" :key="i">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-4/5" />
          </div>
        </div>
      </article>
      <div class="hidden lg:block lg:col-span-1 sticky top-4 p-6 pl-12 h-fit">
        <h3 class="font-semibold mt-4 mb-2 opacity-75">
          {{ $t('pages.blog.table_of_contents') }}
        </h3>
        <TableOfContent :anchors="anchors" />
      </div>
    </main>
  </PageLayout>
</template>
