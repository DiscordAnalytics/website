<script setup lang="ts">
import {
  BookOpenIcon,
  CodeIcon,
  DatabaseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  GlobeIcon,
  SettingsIcon,
  TerminalIcon,
} from '@lucide/vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { MarketingCTA, MarketingHeader, PageLayout, ThemedImg } from '@/components'
import {
  Badge,
  Button,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { useSeo } from '@/composables'
import { vReveal } from '@/utils/reveal.ts'

const { t } = useI18n()

const largerThanMd = useBreakpoints(breakpointsTailwind).greater('md')

const rows = ['setup', 'updates', 'data', 'limits', 'cost'] as const

const services = [
  { key: '1', icon: GlobeIcon },
  { key: '2', icon: CodeIcon },
  { key: '3', icon: DatabaseIcon },
]

const resources = [
  { key: 'install', icon: BookOpenIcon, href: '/docs/self-hosting' },
  { key: 'source', icon: ExternalLinkIcon, href: '/github' },
]

const steps = [
  { step: 1, key: '1', icon: DownloadIcon },
  { step: 2, key: '2', icon: SettingsIcon },
  { step: 3, key: '3', icon: TerminalIcon },
]

useSeo({
  title: () => t('pages.selfHosting.seo.title'),
  description: () => t('pages.selfHosting.seo.description'),
})
</script>

<template>
  <PageLayout>
    <MarketingHeader
      class="pt-16 md:pt-32 pb-12"
      :badge="$t('pages.selfHosting.badge')"
      :title="$t('pages.selfHosting.title')"
      :description="$t('pages.selfHosting.description')"
    >
      <a href="/docs/self-hosting">
        <Button class="transition-transform hover:-translate-y-0.5">
          {{ $t('pages.selfHosting.cta.primary') }}
        </Button>
      </a>
      <RouterLink to="/dash">
        <Button variant="secondary" class="transition-transform hover:-translate-y-0.5">
          {{ $t('pages.selfHosting.cta.secondary') }}
        </Button>
      </RouterLink>
    </MarketingHeader>

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-black text-center mb-4">
        {{ $t('pages.selfHosting.compare.title') }}
      </h2>
      <p
        v-reveal="80"
        class="text-center text-balance text-muted-foreground max-w-2xl mx-auto mb-12"
      >
        {{ $t('pages.selfHosting.compare.description') }}
      </p>

      <div v-reveal="120" class="max-w-4xl mx-auto w-full rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-32 md:w-44" />
              <TableHead class="h-auto py-4 px-4">
                <p class="text-base font-semibold text-foreground">
                  {{ $t('pages.selfHosting.compare.cloud.title') }}
                </p>
                <p class="text-xs font-normal text-muted-foreground">
                  {{ $t('pages.selfHosting.compare.cloud.description') }}
                </p>
              </TableHead>
              <TableHead class="h-auto py-4 px-4">
                <p class="text-base font-semibold text-foreground">
                  {{ $t('pages.selfHosting.compare.self_hosted.title') }}
                </p>
                <p class="text-xs font-normal text-muted-foreground">
                  {{ $t('pages.selfHosting.compare.self_hosted.description') }}
                </p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in rows" :key="row" class="hover:bg-transparent">
              <TableCell class="p-4 font-medium">
                {{ $t(`pages.selfHosting.compare.rows.${row}.label`) }}
              </TableCell>
              <TableCell class="p-4 text-sm md:text-base text-muted-foreground">
                {{ $t(`pages.selfHosting.compare.rows.${row}.cloud`) }}
              </TableCell>
              <TableCell class="p-4 text-sm md:text-base text-muted-foreground">
                {{ $t(`pages.selfHosting.compare.rows.${row}.self_hosted`) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-black text-center mb-4">
        {{ $t('pages.selfHosting.stack.title') }}
      </h2>
      <p
        v-reveal="80"
        class="text-center text-balance text-muted-foreground max-w-2xl mx-auto mb-12"
      >
        {{ $t('pages.selfHosting.stack.description') }}
      </p>

      <div class="max-w-3xl mx-auto w-full flex flex-col gap-10">
        <div v-reveal="80" class="flex flex-wrap items-center justify-center gap-3">
          <Badge
            v-for="service in services"
            :key="service.key"
            variant="outline"
            class="gap-1.5 px-3 py-1.5 text-sm"
          >
            <component :is="service.icon" class="size-3.5" />
            {{ $t(`pages.selfHosting.stack.services.${service.key}.title`) }}
          </Badge>
        </div>

        <img
          v-reveal="160"
          src="https://r2.discordanalytics.xyz/images/self-hosting/terminal.webp"
          :alt="$t('pages.selfHosting.stack.terminal_alt')"
          class="w-full rounded-lg"
        />

        <Stepper
          v-reveal="260"
          :orientation="largerThanMd ? 'horizontal' : 'vertical'"
          :default-value="steps.length + 1"
          class="flex w-full items-start gap-2 mx-auto flex-col md:flex-row"
        >
          <StepperItem
            v-for="step in steps"
            :key="step.key"
            :step="step.step"
            class="relative flex w-full md:flex-col items-start md:items-center md:justify-center"
          >
            <StepperTrigger>
              <StepperIndicator class="bg-muted">
                <component :is="step.icon" class="w-4 h-4" />
              </StepperIndicator>
            </StepperTrigger>
            <StepperSeparator
              v-if="step.step !== steps.length"
              :class="
                largerThanMd
                  ? 'absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary'
                  : 'absolute left-4.5 top-9.5 block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary'
              "
            />
            <div class="flex flex-col md:items-center md:text-center">
              <StepperTitle>
                {{ $t(`pages.selfHosting.stack.steps.${step.key}.title`) }}
              </StepperTitle>
              <StepperDescription>
                {{ $t(`pages.selfHosting.stack.steps.${step.key}.description`) }}
              </StepperDescription>
            </div>
          </StepperItem>
        </Stepper>

        <div v-reveal="380" class="flex flex-wrap items-center justify-center gap-3">
          <a v-for="resource in resources" :key="resource.key" :href="resource.href">
            <Button variant="outline" class="gap-2">
              <component :is="resource.icon" class="size-4" />
              {{ $t(`pages.selfHosting.stack.resources.${resource.key}.title`) }}
            </Button>
          </a>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-black text-center mb-8 text-balance">
        {{ $t('pages.selfHosting.dashboard_tagline') }}
      </h2>

      <div
        v-reveal="120"
        class="relative max-w-4xl mx-auto rounded-t-lg border-t border-l border-r border-primary overflow-clip max-h-96"
      >
        <ThemedImg
          dark-img="https://r2.discordanalytics.xyz/images/home/header_image_dark.webp"
          light-img="https://r2.discordanalytics.xyz/images/home/header_image_light.webp"
          :alt="$t('pages.selfHosting.dashboard_alt')"
          class="w-full"
        />
        <span class="absolute bottom-0 w-full h-48 bg-linear-to-t from-background to-transparent" />
      </div>
    </section>

    <MarketingCTA class="py-16 md:py-32" />
  </PageLayout>
</template>
