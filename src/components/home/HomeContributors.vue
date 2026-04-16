<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ServerIcon } from 'lucide-vue-next'
</script>

<template>
  <section class="max-w-300 mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
    <div>
      <h2 class="text-4xl font-bold mb-8">
        {{ $t('pages.home.community.title') }}
      </h2>
      <p class="text-balance mb-4">
        {{ $t('pages.home.community.description') }}
      </p>
      <div class="flex items-center gap-2">
        <a href="https://opencollective.com/discordanalytics#category-CONTRIBUTE" target="_blank">
          <Button>
            {{ $t('pages.home.community.cta.primary') }}
          </Button>
        </a>
        <a href="https://opencollective.com/discordanalytics/transactions" target="_blank">
          <Button variant="secondary">
            {{ $t('pages.home.community.cta.secondary') }}
          </Button>
        </a>
      </div>
    </div>
    <div class="hidden md:block relative w-full h-120">
      <Card class="w-72">
        <CardHeader>
          <div class="flex items-center gap-2">
            <Avatar size="base">
              <AvatarImage src="https://r2.discordanalytics.xyz/images/home/jam_avatar.png" />
            </Avatar>
            <div>
              <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
              <p class="font-semibold text-lg">Jam</p>
              <p class="text-green-500">+20€</p>
              <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card class="w-72 absolute left-52 top-36">
        <CardHeader>
          <div class="flex items-center gap-2">
            <Avatar size="base">
              <ServerIcon />
            </Avatar>
            <div>
              <p class="font-semibold text-lg">
                {{ $t('pages.home.community.transactions.vps') }}
              </p>
              <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
              <p class="text-red-500">-1.99€</p>
              <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card class="w-72 absolute left-4 top-72">
        <CardHeader>
          <div class="flex items-center gap-2">
            <Avatar size="base">
              <AvatarImage src="https://r2.discordanalytics.xyz/images/home/bebedi_avatar.webp" />
            </Avatar>
            <div>
              <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
              <p class="font-semibold text-lg">Bebedi</p>
              <p class="text-green-500">+10€</p>
              <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  </section>
</template>
