<script setup lang="ts">
import { ChartNoAxesColumnIcon, ExternalLinkIcon, PackageIcon, PlugZapIcon } from '@lucide/vue'

import { CodeBlock } from '@/components'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui'
import * as codeExamples from '@/utils/codeExamples'
import { vReveal } from '@/utils/reveal.ts'

const steps = [
  { icon: PackageIcon, key: 'install' },
  { icon: PlugZapIcon, key: 'integrate' },
  { icon: ChartNoAxesColumnIcon, key: 'watch' },
] as const
</script>

<template>
  <section id="integration" v-bind="$attrs">
    <h2 v-reveal class="text-4xl font-black text-center mb-4">
      {{ $t('pages.home.integration.title') }}
    </h2>
    <p v-reveal="80" class="text-center text-balance text-muted-foreground max-w-2xl mx-auto mb-12">
      {{ $t('pages.home.integration.description') }}
    </p>

    <div class="max-w-300 mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
      <div class="w-full lg:w-96 shrink-0">
        <ItemGroup>
          <Item v-for="(step, index) in steps" :key="step.key" v-reveal="index * 100" class="px-0">
            <ItemMedia variant="icon">
              <component :is="step.icon" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{{ $t(`pages.home.integration.steps.${step.key}.title`) }}</ItemTitle>
              <ItemDescription>
                {{ $t(`pages.home.integration.steps.${step.key}.description`) }}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <Item
          v-reveal="300"
          variant="outline"
          as-child
          class="mt-4 transition-colors hover:bg-accent"
        >
          <a href="/docs/get-started/installation">
            <ItemContent>
              <ItemTitle>{{ $t('pages.home.integration.docs.title') }}</ItemTitle>
              <ItemDescription>
                {{ $t('pages.home.integration.docs.description') }}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ExternalLinkIcon class="size-4" />
            </ItemActions>
          </a>
        </Item>
      </div>

      <div class="w-full min-w-0">
        <CodeBlock v-reveal="120" code="npm install @discordanalytics/discordjs" lang="bash" />
        <CodeBlock
          v-reveal="220"
          :code="codeExamples.discordjsQuickstart.code"
          :added-lines="codeExamples.discordjsQuickstart.addedLines"
          lang="js"
        />
      </div>
    </div>
  </section>
</template>
