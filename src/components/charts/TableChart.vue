<script setup lang="ts">
import { ChartContainer, EmptyChart } from '@/components/charts/index.ts'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { FormattedStats } from '@/utils/types.ts'

defineProps<{
  title: string
  isLoading: boolean
  data: FormattedStats['guilds']['biggestGuildsRank']
}>()
</script>

<template>
  <ChartContainer
    :title="$props.title"
    description=" "
    :tabs="[]"
    :data="[]"
    :is-loading="$props.isLoading"
  >
    <Table v-if="$props.isLoading">
      <TableHeader>
        <slot name="header" />
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in 5" :key="i">
          <TableCell class="flex items-center gap-2">
            <Skeleton class="h-8 w-8 rounded-full" />
            <Skeleton class="h-6 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton class="h-6 w-12" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Table v-else-if="$props.data.length > 0">
      <TableHeader>
        <slot name="header" />
      </TableHeader>
      <TableBody>
        <TableRow v-for="guild in $props.data.slice(0, 10)" :key="guild.id">
          <TableCell class="flex items-center gap-2">
            <DiscordAvatar :id="guild.id" :avatar="guild.icon" :alt="guild.name" is-guild-icon />
            {{ guild.name }}
          </TableCell>
          <TableCell> {{ guild.count.toLocaleString() }} </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <EmptyChart v-else />
  </ChartContainer>
</template>
