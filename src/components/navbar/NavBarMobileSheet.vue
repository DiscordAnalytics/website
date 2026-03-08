<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { NavBarCustomizePopUp, NavBarLocaleSelector } from '@/components/navbar/index.ts'
import { useCurrentUser } from '@/composables'
import NavBarAccountDropdown from '@/components/navbar/NavBarAccountDropdown.vue'

const { userInfos } = useCurrentUser()
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <slot />
    </SheetTrigger>
    <SheetContent>
      <div class="flex flex-col justify-between h-full">
        <div>
          <Accordion type="single" collapsible class="mt-8">
            <AccordionItem value="docs" class="border-none">
              <AccordionTrigger class="p-0">
                {{ $t('components.navbar.links.documentation.trigger') }}
              </AccordionTrigger>
              <AccordionContent class="pl-2 pb-0">
                <a
                  href="/docs/get-started/bot-registration"
                  class="flex w-full items-center py-2 hover:underline"
                >
                  {{ $t('components.navbar.links.documentation.items.get_started.title') }}
                </a>
                <a href="/docs/api" class="flex w-full items-center py-2 hover:underline">
                  {{ $t('components.navbar.links.documentation.items.api.title') }}
                </a>
                <a
                  href="/docs/get-started/advanced-usage"
                  class="flex w-full items-center py-2 hover:underline"
                >
                  {{ $t('components.navbar.links.documentation.items.advanced.title') }}
                </a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <RouterLink to="/blog" class="flex w-full items-center py-2 hover:underline">
            {{ $t('components.navbar.links.blog') }}
          </RouterLink>
          <RouterLink
            to="/app-monetization-explorer"
            class="flex w-full items-center py-2 hover:underline"
          >
            {{ $t('components.navbar.links.app_monetization') }}
          </RouterLink>
          <RouterLink to="/support" class="flex w-full items-center py-2 hover:underline">
            {{ $t('components.navbar.links.support') }}
          </RouterLink>
        </div>
        <div>
          <div class="flex items-center gap-2 my-4 w-full">
            <NavBarCustomizePopUp mobile />
            <NavBarLocaleSelector mobile />
          </div>
          <RouterLink v-if="!userInfos" to="/auth">
            <Button class="w-full">
              {{ $t('components.navbar.account.login') }}
            </Button>
          </RouterLink>
          <NavBarAccountDropdown v-else mobile />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
