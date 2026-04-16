<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useBlogArticles, useLoading } from '@/composables'
import { onBeforeMount, ref } from 'vue'
import { useRouteParams } from '@vueuse/router'
import ThemedImg from '@/components/ThemedImg.vue'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { adminBlogEditorFormSchema } from '@/utils/formSchemas.ts'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Card, CardContent } from '@/components/ui/card'
import VueMarkdown from 'vue-markdown-render'
import type { BlogArticle } from '@/utils/types.ts'
import { SaveIcon, SendIcon, TrashIcon } from 'lucide-vue-next'
import { APIScope } from '@/utils/api'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const articleId = useRouteParams<string>('tag')
const {
  getArticle,
  update: updateArticle,
  publish: publishArticle,
  remove: deleteArticle,
} = useBlogArticles(APIScope.Admin)

const form = useForm({
  validationSchema: toTypedSchema(adminBlogEditorFormSchema),
})

const { isLoading, withLoading } = useLoading()
const article = ref<BlogArticle | null>(null)

const onSave = form.handleSubmit(async (values) => {
  await withLoading(async () => {
    await updateArticle(articleId.value, values)
      .then((res) => {
        article.value = res
        form.setValues({
          ...res,
        })
        toast.success(t('pages.dash.admin.blog.toast.updated'))
      })
      .catch((err) => toast.error(err.message))
  })
})

async function onPublish() {
  await withLoading(async () => {
    await publishArticle(articleId.value)
      .then(() => {
        article.value!.isDraft = false
        toast.success(t('pages.dash.admin.blog.toast.published'))
      })
      .catch((err) => toast.error(err.message))
  })
}

async function onDelete() {
  await withLoading(async () => {
    await deleteArticle(articleId.value)
      .then(() => {
        toast.success(t('pages.dash.admin.blog.toast.deleted'))
        router.push('/dash/admin/blog')
      })
      .catch((err) => toast.error(err.message))
  })
}

onBeforeMount(async () => {
  if (articleId.value !== 'new') {
    await withLoading(async () => {
      article.value = await getArticle(articleId.value)
      form.setValues({
        ...article.value,
      })
    })
  }
})
</script>

<template>
  <AdminDashLayout>
    <form id="blogEditorForm" class="grid grid-cols-3 gap-4" @submit="onSave">
      <FieldGroup class="col-span-1">
        <VeeField v-slot="{ field, errors }" name="cover">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="coverInput">
              {{ $t('pages.dash.admin.blog.fields.cover.label') }}
            </FieldLabel>
            <Input
              id="coverInput"
              v-bind="field"
              placeholder="https://bucket.s3.eu-north-1.amazonaws.com/banner.png"
              autocomplete="off"
              :aria-invalid="!!errors.length"
              :disabled="isLoading"
            />
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>

        <AspectRatio :ratio="16 / 9" class="bg-muted rounded-md">
          <img
            v-if="form.values.cover"
            :src="form.values.cover"
            :alt="$t('pages.dash.admin.blog.cover.alt')"
            class="h-full w-full object-cover"
          />
          <ThemedImg
            v-else
            dark-img="https://r2.discordanalytics.xyz/images/brand/long_logo_dark.webp"
            light-img="https://r2.discordanalytics.xyz/images/brand/long_logo_light.webp"
            alt="Discord Analytics"
            class="h-full w-full"
          />
        </AspectRatio>

        <VeeField v-slot="{ field, errors }" name="title">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="titleInput">
              {{ $t('pages.dash.admin.blog.fields.title.label') }}
            </FieldLabel>
            <Input
              id="titleInput"
              v-bind="field"
              :placeholder="$t('pages.dash.admin.blog.fields.title.placeholder')"
              autocomplete="off"
              autofocus
              :aria-invalid="!!errors.length"
              :disabled="isLoading"
            />
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>
      </FieldGroup>

      <FieldGroup class="col-span-2">
        <VeeField v-slot="{ field, errors }" name="description" class="h-full">
          <Field :data-invalid="!!errors.length" class="h-full">
            <FieldLabel for="descriptionInput">
              {{ $t('pages.dash.admin.blog.fields.description.label') }}
            </FieldLabel>
            <Textarea
              id="descriptionInput"
              v-bind="field"
              :aria-invalid="!!errors.length"
              :placeholder="$t('pages.dash.admin.blog.fields.description.placeholder')"
              class="resize-none h-full"
            />
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="tags">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="tagsInput">
              {{ $t('pages.dash.admin.blog.fields.tags.label') }}
            </FieldLabel>
            <TagsInput
              id="tagsInput"
              :model-value="field.value"
              @update:model-value="field.onChange"
            >
              <TagsInputItem v-for="tag in field.value" :key="tag" :value="tag">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>
              <TagsInputInput :placeholder="$t('pages.dash.admin.blog.fields.tags.placeholder')" />
            </TagsInput>

            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>
      </FieldGroup>

      <FieldGroup class="col-span-3 h-full">
        <VeeField v-slot="{ field, errors }" name="content" class="h-full">
          <Field :data-invalid="!!errors.length" class="h-full">
            <FieldLabel for="contentInput">
              {{ $t('pages.dash.admin.blog.fields.content.label') }}
            </FieldLabel>
            <ResizablePanelGroup direction="horizontal" class="flex items-stretch">
              <ResizablePanel>
                <Textarea
                  id="contentInput"
                  v-bind="field"
                  :aria-invalid="!!errors.length"
                  :placeholder="$t('pages.dash.admin.blog.fields.content.placeholder')"
                  class="resize-none h-full rounded-l rounded-r-none overflow-auto"
                />
              </ResizablePanel>
              <ResizableHandle with-handle />
              <ResizablePanel>
                <Card class="h-full rounded-r rounded-l-none">
                  <CardContent class="pt-6 prose lg:prose-xl dark:prose-invert">
                    <VueMarkdown :source="form.values.content ?? ''" />
                  </CardContent>
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>
      </FieldGroup>

      <FieldGroup class="col-span-3">
        <div class="flex flex-row items-center justify-end gap-2">
          <Button variant="destructive" :disabled="isLoading" class="w-fit" @click="onDelete">
            <Spinner v-if="isLoading" />
            <TrashIcon v-else />
            {{ $t('pages.dash.admin.blog.actions.delete') }}
          </Button>
          <Button variant="outline" :disabled="isLoading || !article?.isDraft" @click="onPublish">
            <Spinner v-if="isLoading" />
            <SendIcon v-else />
            {{ $t('pages.dash.admin.blog.actions.publish') }}
          </Button>
          <Button type="submit" form="blogEditorForm" :disabled="isLoading">
            <Spinner v-if="isLoading" />
            <SaveIcon v-else />
            {{ $t('pages.dash.admin.blog.actions.save') }}
          </Button>
        </div>
      </FieldGroup>
    </form>
  </AdminDashLayout>
</template>
