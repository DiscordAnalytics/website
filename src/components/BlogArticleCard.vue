<script setup lang="ts">
import { timeAgo } from '@/utils/dateTime.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ThemedImg from '@/components/ThemedImg.vue'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { BlogArticle } from '@/utils/types.ts'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  article: Omit<BlogArticle, 'content'>
}>()

const route = useRoute()

const articleUrl = computed(() =>
  route.path.includes('/admin')
    ? `/dash/admin/blog/${props.article.articleId}`
    : `/blog/${props.article.articleId}`,
)
</script>

<template>
  <RouterLink :to="articleUrl">
    <Card class="overflow-clip h-full hover:brightness-80 transition">
      <CardHeader class="p-0">
        <AspectRatio :ratio="16 / 9" class="bg-muted">
          <img
            v-if="article.cover"
            :src="article.cover"
            alt="Article Cover"
            class="h-full w-full object-cover"
          />
          <ThemedImg
            v-else
            dark-img="/brand/long_logo_dark.webp"
            light-img="/brand/long_logo_light.webp"
            alt="Discord Analytics"
            class="h-full w-full"
          />
        </AspectRatio>
        <CardTitle class="px-4 pt-4">
          {{ article.title }}
          <Badge v-if="article.isDraft" class="ml-2">{{ $t('pages.dash.admin.blog.draft') }}</Badge>
        </CardTitle>
        <CardDescription class="px-4 pb-2">{{ article.description }}</CardDescription>
      </CardHeader>
      <CardContent class="px-4 flex items-center gap-2 flex-wrap-reverse">
        <p class="text-xs text-muted-foreground">
          {{ timeAgo(article.createdAt) }}
        </p>
        <div class="flex items-center gap-2 flex-wrap">
          <Badge v-for="tag in article.tags" variant="secondary" :key="tag">
            {{ tag }}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </RouterLink>
</template>
