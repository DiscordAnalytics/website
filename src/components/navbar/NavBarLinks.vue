<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuListItem,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { BookOpenIcon } from 'lucide-vue-next'
</script>

<template>
  <NavigationMenu class="flex">
    <NavigationMenuList class="flex-wrap">
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          {{ $t('components.navbar.links.documentation.trigger') }}
        </NavigationMenuTrigger>
        <NavigationMenuContent class="z-50">
          <ul class="grid gap-3 p-6 md:w-fit lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li class="row-span-3">
              <NavigationMenuLink as-child>
                <a
                  class="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-primary/50 to-muted p-6 no-underline outline-hidden focus:shadow-md"
                  href="/docs"
                >
                  <BookOpenIcon class="w-6 h-6" />
                  <div class="mb-2 mt-4 text-lg font-medium">
                    {{ $t('components.navbar.links.documentation.items.docs.title') }}
                  </div>
                  <p class="text-sm leading-tight text-muted-foreground">
                    {{ $t('components.navbar.links.documentation.items.docs.description') }}
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            <NavigationMenuListItem
              to="/docs/get-started/bot-registration"
              :title="$t('components.navbar.links.documentation.items.get_started.title')"
            >
              {{ $t('components.navbar.links.documentation.items.get_started.description') }}
            </NavigationMenuListItem>
            <NavigationMenuListItem
              to="/docs/api"
              :title="$t('components.navbar.links.documentation.items.api.title')"
            >
              {{ $t('components.navbar.links.documentation.items.api.description') }}
            </NavigationMenuListItem>
            <NavigationMenuListItem
              to="/docs/get-started/advanced-usage"
              :title="$t('components.navbar.links.documentation.items.advanced.title')"
            >
              {{ $t('components.navbar.links.documentation.items.advanced.description') }}
            </NavigationMenuListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/blog" :class="navigationMenuTriggerStyle()">
          {{ $t('components.navbar.links.blog') }}
        </RouterLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/app-monetization-explorer" :class="navigationMenuTriggerStyle()">
          {{ $t('components.navbar.links.app_monetization') }}
        </RouterLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/support" :class="navigationMenuTriggerStyle()">
          {{ $t('components.navbar.links.support') }}
        </RouterLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
