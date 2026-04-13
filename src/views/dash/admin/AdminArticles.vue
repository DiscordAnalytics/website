<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { Button } from '@/components/ui/button'
import { FilterIcon, NewspaperIcon, PlusIcon, SearchIcon } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useBlogArticles } from '@/composables'
import { computed, onBeforeMount, ref } from 'vue'
import { APIScope } from '@/utils/api'
import BlogArticleCard from '@/components/BlogArticleCard.vue'

const { articles, tags, fetch: fetchArticles } = useBlogArticles(APIScope.Admin)

const selectedTags = ref<string[]>([])
const searchQuery = ref<string>('')
const isLoading = ref<boolean>(false)
const filteredArticles = computed(() => {
  return articles.value
    .filter(
      (article) =>
        !selectedTags.value.length || article.tags.some((tag) => selectedTags.value.includes(tag)),
    )
    .filter((article) =>
      searchQuery.value
        .toLowerCase()
        .split(' ')
        .every(
          (word) =>
            article.title.toLowerCase().includes(word) ||
            article.description.toLowerCase().includes(word),
        ),
    )
})

function toggleTag(tag: string, checked: boolean) {
  if (checked) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value = selectedTags.value.filter((x) => x !== tag)
  }
}

onBeforeMount(async () => {
  isLoading.value = true
  if (articles.value.length === 0) await fetchArticles()
  isLoading.value = false
})
</script>

<template>
  <AdminDashLayout>
    <template #header>
      <div class="w-full flex items-center justify-end flex-nowrap gap-2">
        <InputGroup class="max-w-full md:max-w-96">
          <InputGroupInput :placeholder="$t('pages.blog.header.search')" v-model="searchQuery" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <DropdownMenu v-if="tags.length > 0">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon">
              <FilterIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>{{ $t('pages.blog.header.dropdown') }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="tag in tags"
              :key="tag"
              :model-value="selectedTags.includes(tag)"
              @update:model-value="(checked: boolean) => toggleTag(tag, checked)"
              class="cursor-pointer"
            >
              {{ tag }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <RouterLink to="/dash/admin/blog/new">
          <Button variant="outline">
            <PlusIcon />
            {{ $t('pages.dash.admin.blog.addArticle') }}
          </Button>
        </RouterLink>
      </div>
    </template>

    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-16"
    >
      <Card v-for="i in 8" :key="i" class="overflow-clip">
        <CardHeader class="p-0">
          <AspectRatio :ratio="16 / 9">
            <Skeleton class="h-full w-full rounded-none" />
          </AspectRatio>
          <div class="px-4 pt-4 pb-2 flex flex-col gap-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-5/6" />
          </div>
        </CardHeader>
        <CardContent class="px-4 flex items-center gap-2">
          <Skeleton class="h-3 w-16" />
          <Skeleton class="h-5 w-12 rounded" />
        </CardContent>
      </Card>
    </div>
    <div
      v-else-if="filteredArticles.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-16"
    >
      <BlogArticleCard
        v-for="article in filteredArticles"
        :key="article.articleId"
        :article="article"
        class="col-span-1"
      />
    </div>
    <Empty v-else>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NewspaperIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.blog.no_results.title') }}</EmptyTitle>
        <EmptyDescription>{{ $t('pages.blog.no_results.description') }}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </AdminDashLayout>
</template>
