<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { NavBar } from '@/components/navbar'
import type { SidebarItem } from '@/utils/types.ts'

defineProps<{
  items: SidebarItem[]
}>()
</script>

<template>
  <main class="h-screen max-h-screen">
    <NavBar class="max-w-425 mx-auto px-4" />
    <div class="border-t">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader v-if="$slots.header">
            <slot name="header" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup v-for="group in $props.items" :key="group.title">
              <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem v-for="item in group.children" :key="item.title">
                    <SidebarMenuButton as-child>
                      <RouterLink v-if="item.to" :to="item.to">
                        <component v-if="item.icon" :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <Badge v-if="item.tag" class="rounded-full hover:bg-primary">
                          {{ item.tag }}
                        </Badge>
                      </RouterLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset class="p-4 max-h-[calc(100vh-6.25rem)] overflow-y-scroll pb-16">
          <slot name="inset" />
        </SidebarInset>
      </SidebarProvider>
    </div>
  </main>
</template>
