<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@/components/ui'
import { vReveal } from '@/utils/reveal.ts'
</script>

<template>
  <section id="faq" class="flex flex-col items-center w-full xl:px-64 2xl:px-96 gap-6">
    <h2 v-reveal class="text-4xl font-bold text-center">
      {{ $t('pages.home.faq.title') }}
    </h2>
    <Accordion v-reveal="100" type="single" collapsible class="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger class="text-start">
          {{ $t('pages.home.faq.questions.1.question') }}
        </AccordionTrigger>
        <AccordionContent>{{ $t('pages.home.faq.questions.1.answer') }}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger class="text-start">
          {{ $t('pages.home.faq.questions.2.question') }}
        </AccordionTrigger>
        <AccordionContent>
          {{ $t('pages.home.faq.questions.2.answer') }}
          <a href="/docs/get-started/installation" target="_blank">
            <Button variant="link" class="px-0.5">
              {{ $t('pages.home.faq.questions.2.link') }}
            </Button>
          </a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger class="text-start">
          {{ $t('pages.home.faq.questions.3.question') }}
        </AccordionTrigger>
        <AccordionContent>
          {{ $t('pages.home.faq.questions.3.answer.1') }}
          <a href="/support" target="_blank">
            <Button variant="link" class="px-0.5">
              {{ $t('pages.home.faq.questions.3.answer.2') }}
            </Button>
          </a>
          {{ $t('pages.home.faq.questions.3.answer.3') }}
          <a href="mailto:contact@discordanalytics.xyz" target="_blank">
            <Button variant="link" class="px-0.5">
              {{ $t('pages.home.faq.questions.3.answer.4') }}
            </Button>
          </a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger class="text-start">
          {{ $t('pages.home.faq.questions.4.question') }}
        </AccordionTrigger>
        <AccordionContent>{{ $t('pages.home.faq.questions.4.answer') }}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger class="text-start">
          {{ $t('pages.home.faq.questions.5.question') }}
        </AccordionTrigger>
        <AccordionContent>
          {{ $t('pages.home.faq.questions.5.answer') }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
