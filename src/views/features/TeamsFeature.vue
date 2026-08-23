<script setup lang="ts">
import { ChartLineIcon, CheckIcon, LogInIcon, MailIcon, UserPlusIcon, XIcon } from '@lucide/vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { MarketingCTA, MarketingHeader, PageLayout } from '@/components'
import {
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
const prefix = 'pages.features.pages.teams'

useSeo({
  title: () => t(`${prefix}.seo.title`),
  description: () => t(`${prefix}.seo.description`),
})

const largerThanMd = useBreakpoints(breakpointsTailwind).greater('md')

const steps = [
  { step: 1, icon: UserPlusIcon },
  { step: 2, icon: MailIcon },
  { step: 3, icon: LogInIcon },
  { step: 4, icon: ChartLineIcon },
]

const capabilities = [
  { key: 'stats', teammate: true },
  { key: 'achievements', teammate: true },
  { key: 'reports', teammate: true },
  { key: 'settings', teammate: false },
  { key: 'team', teammate: false },
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
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance mb-12">
        {{ $t(`${prefix}.invite.title`) }}
      </h2>

      <Stepper
        v-reveal="120"
        :orientation="largerThanMd ? 'horizontal' : 'vertical'"
        :default-value="steps.length + 1"
        class="flex w-full items-start gap-2 mx-auto flex-col md:flex-row"
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
            <StepperTitle>{{ $t(`${prefix}.invite.steps.${step.step}.title`) }}</StepperTitle>
            <StepperDescription>
              {{ $t(`${prefix}.invite.steps.${step.step}.description`) }}
            </StepperDescription>
          </div>
        </StepperItem>
      </Stepper>
    </section>

    <section class="pb-16 md:pb-32 max-w-300 mx-auto w-full">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance">
        {{ $t(`${prefix}.access.title`) }}
      </h2>
      <p
        v-reveal="80"
        class="mt-4 text-center text-balance text-muted-foreground max-w-2xl mx-auto"
      >
        {{ $t(`${prefix}.access.description`) }}
      </p>

      <div v-reveal="160" class="mt-12 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ $t(`${prefix}.access.table.capability`) }}</TableHead>
              <TableHead class="text-center">{{ $t(`${prefix}.access.table.teammate`) }}</TableHead>
              <TableHead class="text-center">{{ $t(`${prefix}.access.table.owner`) }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="capability in capabilities" :key="capability.key">
              <TableCell>{{ $t(`${prefix}.access.rows.${capability.key}`) }}</TableCell>
              <TableCell class="text-center">
                <CheckIcon v-if="capability.teammate" class="size-4 mx-auto text-primary" />
                <XIcon v-else class="size-4 mx-auto text-muted-foreground" />
              </TableCell>
              <TableCell class="text-center">
                <CheckIcon class="size-4 mx-auto text-primary" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>

    <section class="pb-16 md:pb-32 max-w-3xl mx-auto w-full text-center">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-balance">
        {{ $t(`${prefix}.scope.title`) }}
      </h2>
      <p v-reveal="80" class="mt-4 text-balance text-muted-foreground">
        {{ $t(`${prefix}.scope.description`) }}
      </p>
    </section>

    <MarketingCTA class="pb-16 md:pb-32" />
  </PageLayout>
</template>
