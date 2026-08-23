<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { MarketingCTA, MarketingShowcase, MarketingSplit, PageLayout } from '@/components'
import { Button } from '@/components/ui'
import { useSeo } from '@/composables'
import { FEATURE_IMAGES } from '@/utils/featureImages.ts'
import { vReveal } from '@/utils/reveal.ts'

const { t } = useI18n()
const prefix = 'pages.features.pages.custom_graphs'

useSeo({
  title: () => t(`${prefix}.seo.title`),
  description: () => t(`${prefix}.seo.description`),
})
</script>

<template>
  <PageLayout>
    <header
      class="pt-16 md:pt-32 pb-16 md:pb-32 max-w-300 mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
    >
      <div class="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-6">
        <h1 v-reveal class="text-5xl md:text-6xl font-black text-center lg:text-left text-balance">
          {{ $t(`${prefix}.title`) }}
        </h1>
        <p v-reveal="80" class="text-center lg:text-left text-balance">
          {{ $t(`${prefix}.description`) }}
        </p>
        <RouterLink v-reveal="160" to="/dash">
          <Button class="transition-transform hover:-translate-y-0.5">
            {{ $t('pages.features.cta.primary') }}
          </Button>
        </RouterLink>
      </div>

      <MarketingShowcase
        :clip="false"
        class="lg:w-1/2 lg:max-w-full max-w-sm"
        :dark-img="FEATURE_IMAGES.customGraphs.dark"
        :light-img="FEATURE_IMAGES.customGraphs.light"
        :alt="$t(`${prefix}.image_alt`)"
      />
    </header>

    <MarketingSplit
      reverse
      class="pb-16 md:pb-32"
      :title="$t(`${prefix}.form.title`)"
      :description="$t(`${prefix}.form.description`)"
      :dark-img="FEATURE_IMAGES.customEventDialog.dark"
      :light-img="FEATURE_IMAGES.customEventDialog.light"
      :alt="$t(`${prefix}.form.title`)"
    />

    <MarketingCTA class="pb-16 md:pb-32" />
  </PageLayout>
</template>
