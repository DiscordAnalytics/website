<script setup lang="ts">
import { ExternalLinkIcon, HeartIcon, ReceiptTextIcon, ServerIcon } from '@lucide/vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { MarketingCTA, MarketingHeader, PageLayout } from '@/components'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui'
import { useContributors, useLoading, useSeo } from '@/composables'
import { featurePages } from '@/utils/featurePages.ts'
import { vReveal } from '@/utils/reveal.ts'

const { t } = useI18n()

const { coders, backers, fetchContributors } = useContributors()
const { isLoading: isLoadingContributors, withLoading } = useLoading()
onMounted(() => withLoading(fetchContributors))

// TODO: confirm against the backend defaults before shipping — see the PR description.
const limits = [
  { key: 'bots', value: 3 },
  { key: 'achievements', value: 30 },
  { key: 'custom_events', value: 15 },
  { key: 'teammates', value: 5 },
]

const funding = [
  {
    key: 'contribute',
    icon: HeartIcon,
    href: 'https://opencollective.com/discordanalytics#category-CONTRIBUTE',
  },
  {
    key: 'ledger',
    icon: ReceiptTextIcon,
    href: 'https://opencollective.com/discordanalytics/transactions',
  },
]

useSeo({
  title: () => t('pages.pricing.seo.title'),
  description: () => t('pages.pricing.seo.description'),
})
</script>

<template>
  <PageLayout>
    <MarketingHeader
      class="pt-16 md:pt-32 pb-12"
      :badge="$t('pages.pricing.badge')"
      :title="$t('pages.pricing.title')"
      :description="$t('pages.pricing.description')"
    >
      <RouterLink to="/dash">
        <Button class="transition-transform hover:-translate-y-0.5">
          {{ $t('pages.pricing.cta.primary') }}
        </Button>
      </RouterLink>
      <RouterLink to="/#learn-more">
        <Button variant="secondary" class="transition-transform hover:-translate-y-0.5">
          {{ $t('pages.pricing.cta.secondary') }}
        </Button>
      </RouterLink>
    </MarketingHeader>

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-black text-center mb-4">
        {{ $t('pages.pricing.included.title') }}
      </h2>
      <p
        v-reveal="80"
        class="text-center text-balance text-muted-foreground max-w-2xl mx-auto mb-12"
      >
        {{ $t('pages.pricing.included.description') }}
      </p>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto w-full">
        <Item
          v-for="(feature, slug, index) in featurePages"
          :key="slug"
          v-reveal="(index % 3) * 100"
          variant="outline"
          as-child
          class="transition-colors hover:bg-accent"
        >
          <RouterLink :to="`/features/${slug}`">
            <ItemMedia variant="icon">
              <component :is="feature.icon" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                {{ $t(`pages.features.pages.${feature.i18nKey}.title`) }}
              </ItemTitle>
              <ItemDescription>
                {{ $t(`pages.features.pages.${feature.i18nKey}.card_description`) }}
              </ItemDescription>
            </ItemContent>
          </RouterLink>
        </Item>
      </div>
    </section>

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-black text-center mb-4">
        {{ $t('pages.pricing.limits.title') }}
      </h2>
      <p
        v-reveal="80"
        class="text-center text-balance text-muted-foreground max-w-2xl mx-auto mb-12"
      >
        {{ $t('pages.pricing.limits.description') }}
      </p>

      <div v-reveal="160" class="max-w-3xl mx-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ $t('pages.pricing.limits.table.resource') }}</TableHead>
              <TableHead class="text-end">
                {{ $t('pages.pricing.limits.table.included') }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="limit in limits" :key="limit.key">
              <TableCell>
                <p class="font-medium">
                  {{ $t(`pages.pricing.limits.rows.${limit.key}.label`) }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ $t(`pages.pricing.limits.rows.${limit.key}.scope`) }}
                </p>
              </TableCell>
              <TableCell class="text-end font-mono">{{ limit.value }}</TableCell>
            </TableRow>
          </TableBody>
          <TableCaption class="text-balance">
            {{ $t('pages.pricing.limits.raise.1') }}
            <RouterLink to="/support">
              <Button variant="link" class="px-0.5">
                {{ $t('pages.pricing.limits.raise.2') }}
              </Button>
            </RouterLink>
            {{ $t('pages.pricing.limits.raise.3') }}
          </TableCaption>
        </Table>
      </div>
    </section>

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-black text-center mb-4">
        {{ $t('pages.pricing.funding.title') }}
      </h2>
      <p
        v-reveal="80"
        class="text-center text-balance text-muted-foreground max-w-2xl mx-auto mb-12"
      >
        {{ $t('pages.pricing.funding.description') }}
      </p>

      <TooltipProvider>
        <div v-reveal="140" class="max-w-3xl mx-auto w-full space-y-8 mb-12">
          <div v-if="isLoadingContributors || coders.length">
            <p class="text-sm font-medium text-muted-foreground mb-4 text-center md:text-start">
              {{ $t('pages.pricing.funding.contributors.code') }}
            </p>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <template v-if="isLoadingContributors">
                <Skeleton v-for="n in 6" :key="n" class="size-10 rounded-full" />
              </template>
              <template v-else>
                <Tooltip v-for="person in coders" :key="person.href">
                  <TooltipTrigger as-child>
                    <a :href="person.href" target="_blank">
                      <Avatar class="transition-transform hover:-translate-y-0.5">
                        <AvatarImage :src="person.avatar" :alt="person.name" />
                        <AvatarFallback>{{ person.name.slice(0, 2) }}</AvatarFallback>
                      </Avatar>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p class="font-medium">{{ person.name }}</p>
                    <p class="text-primary-foreground/70">{{ person.detail }}</p>
                  </TooltipContent>
                </Tooltip>
              </template>
            </div>
          </div>

          <div v-if="isLoadingContributors || backers.length">
            <p class="text-sm font-medium text-muted-foreground mb-4 text-center md:text-start">
              {{ $t('pages.pricing.funding.contributors.donors') }}
            </p>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <template v-if="isLoadingContributors">
                <Skeleton v-for="n in 6" :key="n" class="size-10 rounded-full" />
              </template>
              <template v-else>
                <Tooltip v-for="person in backers" :key="person.href">
                  <TooltipTrigger as-child>
                    <a :href="person.href" target="_blank">
                      <Avatar class="transition-transform hover:-translate-y-0.5">
                        <AvatarImage :src="person.avatar" :alt="person.name" />
                        <AvatarFallback>{{ person.name.slice(0, 2) }}</AvatarFallback>
                      </Avatar>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p class="font-medium">{{ person.name }}</p>
                    <p class="text-primary-foreground/70">{{ person.detail }}</p>
                  </TooltipContent>
                </Tooltip>
              </template>
            </div>
          </div>
        </div>
      </TooltipProvider>

      <ItemGroup class="max-w-3xl mx-auto w-full gap-3">
        <Item
          v-for="(entry, index) in funding"
          :key="entry.key"
          v-reveal="index * 100"
          variant="outline"
          as-child
          class="transition-colors hover:bg-accent"
        >
          <a :href="entry.href" target="_blank">
            <ItemMedia variant="icon">
              <component :is="entry.icon" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{{ $t(`pages.pricing.funding.${entry.key}.title`) }}</ItemTitle>
              <ItemDescription>
                {{ $t(`pages.pricing.funding.${entry.key}.description`) }}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ExternalLinkIcon class="size-4" />
            </ItemActions>
          </a>
        </Item>

        <Item v-reveal="200" variant="outline" as-child class="transition-colors hover:bg-accent">
          <RouterLink to="/self-hosting">
            <ItemMedia variant="icon">
              <ServerIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{{ $t('pages.pricing.funding.self_hosting.title') }}</ItemTitle>
              <ItemDescription>
                {{ $t('pages.pricing.funding.self_hosting.description') }}
              </ItemDescription>
            </ItemContent>
          </RouterLink>
        </Item>
      </ItemGroup>
    </section>

    <section class="flex flex-col items-center w-full xl:px-64 2xl:px-96 gap-6 py-16 md:py-32">
      <h2 v-reveal class="text-4xl font-bold text-center">
        {{ $t('pages.pricing.faq.title') }}
      </h2>
      <Accordion v-reveal="100" type="single" collapsible class="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger class="text-start">
            {{ $t('pages.pricing.faq.questions.1.question') }}
          </AccordionTrigger>
          <AccordionContent>{{ $t('pages.pricing.faq.questions.1.answer') }}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger class="text-start">
            {{ $t('pages.pricing.faq.questions.2.question') }}
          </AccordionTrigger>
          <AccordionContent>
            {{ $t('pages.pricing.faq.questions.2.answer.1') }}
            <RouterLink to="/self-hosting">
              <Button variant="link" class="px-0.5">
                {{ $t('pages.pricing.faq.questions.2.answer.2') }}
              </Button>
            </RouterLink>
            {{ $t('pages.pricing.faq.questions.2.answer.3') }}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger class="text-start">
            {{ $t('pages.pricing.faq.questions.3.question') }}
          </AccordionTrigger>
          <AccordionContent>
            {{ $t('pages.pricing.faq.questions.3.answer.1') }}
            <a href="/docs/legals/privacy-policy">
              <Button variant="link" class="px-0.5">
                {{ $t('pages.pricing.faq.questions.3.answer.2') }}
              </Button>
            </a>
            {{ $t('pages.pricing.faq.questions.3.answer.3') }}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger class="text-start">
            {{ $t('pages.pricing.faq.questions.4.question') }}
          </AccordionTrigger>
          <AccordionContent>{{ $t('pages.pricing.faq.questions.4.answer') }}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <MarketingCTA class="py-16 md:py-32" />
  </PageLayout>
</template>
