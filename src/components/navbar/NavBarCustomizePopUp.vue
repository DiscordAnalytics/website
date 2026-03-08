<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MonitorIcon, MoonIcon, PaletteIcon, SunIcon } from 'lucide-vue-next'
import { useStore } from '@/stores'
import { ref } from 'vue'
import { createReusableTemplate, useColorMode, useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import type { Color } from '@/utils/types.ts'
import { cn } from '@/lib/utils.ts'
import { ButtonGroup } from '@/components/ui/button-group'
import { storeToRefs } from 'pinia'
import { Switch } from '@/components/ui/switch'
import { isChristmas } from '@/components/navbar/index.ts'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'

defineProps<{
  mobile?: boolean
}>()

const store = useStore()
const { theme: currentTheme } = storeToRefs(store)
const i18n = useI18n()
const mode = useColorMode({ emitAuto: true })

const carrotClick = ref<number>(0)
const isCarroted = useLocalStorage('isCarroted', false)
const isSnowEnabled = useLocalStorage('snowEnabled', true)
const [DefineContent, Content] = createReusableTemplate()

const themes = [
  { name: 'zinc', class: 'bg-zinc-600' },
  { name: 'orange', class: 'bg-orange-600' },
  { name: 'red', class: 'bg-red-600' },
  { name: 'blue', class: 'bg-blue-600' },
  { name: 'green', class: 'bg-green-600' },
] as { name: Color; class: string }[]

function handleCarrotClick() {
  store.setTheme('orange')
  ++carrotClick.value
  if (carrotClick.value > 3) {
    if (!isCarroted.value) {
      isCarroted.value = true
      toast(i18n.t('components.navbar.carroted'))
      carrotClick.value = 0
    } else {
      toast(i18n.t('components.navbar.uncarroted'))
      isCarroted.value = false
      carrotClick.value = 0
    }
  }
}
</script>

<template>
  <DefineContent v-slot="{ className }">
    <div :class="cn('grid gap-4', className)">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">
          {{ $t('components.navbar.customize.title') }}
        </h4>
        <p class="text-sm text-muted-foreground">
          {{ $t('components.navbar.customize.description') }}
        </p>
      </div>
      <div class="grid gap-2">
        <div class="flex justify-between items-center">
          <p class="text-sm w-fit">{{ $t('components.navbar.customize.color') }}</p>
          <ButtonGroup>
            <Button
              v-for="t in themes"
              :key="t.name"
              variant="outline"
              size="icon"
              :class="cn('h-9 flex-1 p-0', currentTheme === t.name && 'bg-accent')"
              @click="t.name === 'orange' ? handleCarrotClick() : store.setTheme(t.name)"
            >
              <span :class="cn('h-4 w-4 rounded-full', t.class)" aria-hidden="true" />
            </Button>
          </ButtonGroup>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-sm w-fit">{{ $t('components.navbar.customize.theme.title') }}</p>
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              :class="{ 'bg-accent text-accent-foreground': mode === 'light' }"
              class="flex-1 p-0"
              @click="mode = 'light'"
            >
              <SunIcon class="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              :class="{ 'bg-accent text-accent-foreground': mode === 'dark' }"
              class="flex-1 p-0"
              @click="mode = 'dark'"
            >
              <MoonIcon class="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              :class="{ 'bg-accent text-accent-foreground': mode === 'auto' }"
              class="h-9"
              @click="mode = 'auto'"
            >
              <MonitorIcon class="h-4 w-4" />{{ $t('components.navbar.customize.theme.system') }}
            </Button>
          </ButtonGroup>
        </div>
        <div v-if="isChristmas" class="flex justify-between items-center">
          <p class="text-sm w-fit">{{ $t('components.navbar.customize.enableSnow') }}</p>
          <Switch
            :default-value="isSnowEnabled"
            @update:model-value="(value: boolean) => (isSnowEnabled = value)"
          />
        </div>
      </div>
    </div>
  </DefineContent>

  <Drawer v-if="$props.mobile">
    <DrawerTrigger>
      <Button variant="outline" size="icon">
        <PaletteIcon />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <Content class="p-4 pb-8" />
    </DrawerContent>
  </Drawer>
  <Popover v-else>
    <PopoverTrigger>
      <Button variant="ghost" size="icon">
        <PaletteIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Content />
    </PopoverContent>
  </Popover>
</template>
