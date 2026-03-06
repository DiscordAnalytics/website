<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ThemedImg from '@/components/ThemedImg.vue'
</script>

<template>
  <footer class="">
    <div
      class="bg-primary px-10 py-6 rounded-lg flex gap-4 items-center animate-floating w-fit md:m-auto my-8 mx-4 flex-col md:flex-row"
    >
      <div class="flex flex-col">
        <h1 class="text-primary-foreground font-bold text-lg">
          {{ $t('components.footer.banner.title') }}
        </h1>
        <p class="text-primary-foreground">
          {{ $t('components.footer.banner.description') }}
        </p>
      </div>
      <RouterLink to="/support" target="_blank">
        <Button variant="secondary" class="w-full md:w-auto">
          {{ $t('components.footer.banner.button') }}
        </Button>
      </RouterLink>
    </div>
    <div class="py-10 px-4">
      <div class="m-auto max-w-6xl">
        <div class="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-2 w-fit">
            <ThemedImg
              dark-img="/brand/long_logo_light.webp"
              light-img="/brand/long_logo_dark.webp"
              alt="Discord Analytics"
              class="w-52"
            />
          </div>
          <div class="flex items-start w-fit justify-center gap-12 flex-wrap">
            <div class="flex flex-col">
              <h3 class="font-semibold">
                {{ $t('components.footer.columns.product.title') }}
              </h3>
              <Button variant="link" href="/#learn-more" class="px-0 justify-start">
                {{ $t('components.footer.columns.product.items.features') }}
              </Button>
              <Button variant="link" href="/community/achievements" class="px-0 justify-start">
                {{ $t('components.footer.columns.product.items.achievements') }}
              </Button>
              <Button variant="link" href="/docs" class="px-0 justify-start">
                {{ $t('components.footer.columns.product.items.docs') }}
              </Button>
              <Button
                variant="link"
                href="/docs/get-started/installation"
                class="px-0 justify-start"
              >
                {{ $t('components.footer.columns.product.items.integrate') }}
              </Button>
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold">
                {{ $t('components.footer.columns.company.title') }}
              </h3>
              <Button variant="link" href="/blog" class="px-0 justify-start">
                {{ $t('components.footer.columns.company.items.blog') }}
              </Button>
              <Button variant="link" href="/status" class="px-0 justify-start">
                {{ $t('components.footer.columns.company.items.status') }}
              </Button>
              <Button variant="link" href="/github" class="px-0 justify-start">
                {{ $t('components.footer.columns.company.items.source_code') }}
              </Button>
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold">
                {{ $t('components.footer.columns.contact.title') }}
              </h3>
              <Button
                variant="link"
                href="mailto:contact@discordanalytics.xyz"
                class="px-0 justify-start"
              >
                {{ $t('components.footer.columns.contact.items.mail') }}
              </Button>
              <Button variant="link" href="/support" class="px-0 justify-start">
                {{ $t('components.footer.columns.contact.items.discord') }}
              </Button>
            </div>
            <div class="flex flex-col">
              <h3 class="font-semibold">
                {{ $t('components.footer.columns.legals.title') }}
              </h3>
              <Button variant="link" href="/docs/legals/terms" class="px-0 justify-start">
                {{ $t('components.footer.columns.legals.items.terms') }}
              </Button>
              <Button variant="link" href="/docs/legals/privacy-policy" class="px-0 justify-start">
                {{ $t('components.footer.columns.legals.items.privacy') }}
              </Button>
            </div>
          </div>
        </div>
        <Separator class="my-4" />
        <p class="text-sm text-muted-foreground text-center">
          {{ $t('components.footer.credits.date', { currentYear: new Date().getUTCFullYear() }) }}
        </p>
        <p class="text-sm text-muted-foreground text-center">
          {{ $t('components.footer.credits.trademark') }}
        </p>
      </div>
    </div>
  </footer>
</template>
