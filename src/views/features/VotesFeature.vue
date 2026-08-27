<script setup lang="ts">
import { BellIcon, ChartLineIcon, ExternalLinkIcon, SendIcon, ThumbsUpIcon } from '@lucide/vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { CustomIcon, MarketingCTA, MarketingHeader, PageLayout } from '@/components'
import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui'
import { useSeo } from '@/composables'
import { vReveal } from '@/utils/reveal.ts'
import type { VotesProvider } from '@/utils/types'

const { t } = useI18n()
const prefix = 'pages.features.pages.votes'

useSeo({
  title: () => t(`${prefix}.seo.title`),
  description: () => t(`${prefix}.seo.description`),
})

const largerThanMd = useBreakpoints(breakpointsTailwind).greater('md')

const steps = [
  { step: 1, icon: ThumbsUpIcon },
  { step: 2, icon: SendIcon },
  { step: 3, icon: ChartLineIcon },
  { step: 4, icon: BellIcon },
]

const providers: { id: VotesProvider; name: string; url: string }[] = [
  { id: 'topgg', name: 'Top.gg', url: 'https://top.gg' },
  { id: 'dblist', name: 'Discord Bot List', url: 'https://discordbotlist.com' },
  { id: 'botlistme', name: 'BotList.me', url: 'https://botlist.me' },
  { id: 'discordplace', name: 'Discord.place', url: 'https://discord.place' },
  { id: 'discordscom', name: 'Discords.com', url: 'https://discords.com' },
]
</script>

<template>
  <PageLayout>
    <MarketingHeader
      class="pt-16 md:pt-32 pb-12"
      :title="$t(`${prefix}.title`)"
      :description="$t(`${prefix}.description`)"
    >
      <RouterLink to="/dash">
        <Button class="transition-transform hover:-translate-y-0.5">
          {{ $t('pages.features.cta.primary') }}
        </Button>
      </RouterLink>
    </MarketingHeader>

    <section class="py-16 md:py-32 max-w-300 mx-auto w-full">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance">
        {{ $t(`${prefix}.providers.title`) }}
      </h2>
      <p
        v-reveal="80"
        class="mt-4 text-center text-balance text-muted-foreground max-w-2xl mx-auto"
      >
        {{ $t(`${prefix}.providers.description`) }}
      </p>

      <ItemGroup class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item
          v-for="(provider, index) in providers"
          :key="provider.id"
          v-reveal="(index % 3) * 100"
          as="a"
          :href="provider.url"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
        >
          <ItemMedia variant="icon">
            <CustomIcon :icon="provider.id" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{{ provider.name }}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon class="size-4 text-muted-foreground" />
          </ItemActions>
        </Item>
      </ItemGroup>
    </section>

    <section class="pb-16 md:pb-32 max-w-300 mx-auto w-full">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance">
        {{ $t(`${prefix}.journey.title`) }}
      </h2>
      <p
        v-reveal="80"
        class="mt-4 text-center text-balance text-muted-foreground max-w-2xl mx-auto"
      >
        {{ $t(`${prefix}.journey.description`) }}
      </p>

      <Stepper
        v-reveal="160"
        :orientation="largerThanMd ? 'horizontal' : 'vertical'"
        :default-value="steps.length + 1"
        class="mt-12 flex w-full items-start gap-2 mx-auto flex-col md:flex-row"
      >
        <StepperItem
          v-for="step in steps"
          :key="step.step"
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
            <StepperTitle>{{ $t(`${prefix}.journey.steps.${step.step}.title`) }}</StepperTitle>
            <StepperDescription>
              {{ $t(`${prefix}.journey.steps.${step.step}.description`) }}
            </StepperDescription>
          </div>
        </StepperItem>
      </Stepper>
    </section>

    <MarketingCTA class="pb-16 md:pb-32" />
  </PageLayout>
</template>
