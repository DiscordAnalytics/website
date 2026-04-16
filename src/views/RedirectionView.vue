<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/layouts/PageLayout.vue'

const router = useRouter()
const route = useRoute()

const links: { path: string; redirect: string }[] = [
  {
    path: '/support',
    redirect: 'https://discord.gg/yQYh9x6R8H',
  },
  {
    path: '/status',
    redirect: 'https://status.discordanalytics.xyz',
  },
  {
    path: '/github',
    redirect: 'https://github.com/DiscordAnalytics',
  },
]

onMounted(() => {
  if (links.find((x) => x.path === route.path))
    window.open(links.find((x) => x.path === route.path)!.redirect, '_self')
  else router.push({ name: 'NotFound' })
})
</script>

<template>
  <PageLayout>
    <div class="flex flex-col items-center my-64">
      <h1 class="text-6xl font-bold my-6 transition-all">
        {{ $t('pages.redirection.title') }}
      </h1>
      <p class="text-xs">
        {{ $t('pages.redirection.description') }}
      </p>
    </div>
  </PageLayout>
</template>
