<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MoonIcon, PaletteIcon, SunIcon } from 'lucide-vue-next'
import { useStore } from '@/stores'
import { ref } from 'vue'
import { useColorMode, useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { isChristmas } from '@/components/navbar/index.ts'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils.ts'

const { setTheme } = useStore()
const i18n = useI18n()
const mode = useColorMode()

const carrotClick = ref<number>(0)
const isCarroted = useLocalStorage('isCarroted', 'false')
const isSnowEnabled = useLocalStorage('snowEnabled', 'true')

const colorSelectorClasses = 'rounded-full h-4 w-4 cursor-pointer'

function handleCarrotClick() {
  setTheme('orange')
  ++carrotClick.value
  if (carrotClick.value > 3) {
    if (isCarroted.value === 'false') {
      isCarroted.value = 'true'
      toast({
        title: i18n.t('components.navbar.carroted'),
      })
      carrotClick.value = 0
    } else {
      toast({
        title: i18n.t('components.navbar.uncarroted'),
      })
      isCarroted.value = 'false'
      carrotClick.value = 0
    }
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="ghost" size="icon">
        <PaletteIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <h1 class="text-2xl font-bold my-4">
        {{ $t('components.navbar.customize.title') }}
      </h1>
      <Separator />
      <h2 class="text-lg font-semibold mt-2">
        {{ $t('components.navbar.customize.color') }}
      </h2>
      <div class="flex items-center gap-4 p-4">
        <span
          :class="
            cn(colorSelectorClasses, 'theme-zinc:border-2 theme-zinc:border-foreground bg-zinc-600')
          "
          @click="setTheme('zinc')"
        />
        <span
          :class="
            cn(
              colorSelectorClasses,
              'theme-orange:border-2 theme-orange:border-foreground bg-orange-600',
            )
          "
          @click="handleCarrotClick"
        />
        <span
          :class="
            cn(colorSelectorClasses, 'theme-red:border-2 theme-red:border-foreground bg-red-600')
          "
          @click="setTheme('red')"
        />
        <span
          :class="
            cn(colorSelectorClasses, 'theme-blue:border-2 theme-blue:border-foreground bg-blue-600')
          "
          @click="setTheme('blue')"
        />
        <span
          :class="
            cn(
              colorSelectorClasses,
              'theme-green:border-2 theme-green:border-foreground bg-green-600',
            )
          "
          @click="setTheme('green')"
        />
      </div>
      <Separator />
      <h2 class="text-lg font-semibold mt-2">
        {{ $t('components.navbar.customize.theme.title') }}
      </h2>
      <div class="flex items-center gap-4 p-4">
        <Button
          variant="outline"
          class="h-8 light:border-2 light:border-foreground"
          @click="mode = 'light'"
        >
          <SunIcon class="mr-2" />
          {{ $t('components.navbar.customize.theme.light') }}
        </Button>
        <Button
          variant="outline"
          class="h-8 dark:border-2 dark:border-foreground"
          @click="mode = 'dark'"
        >
          <MoonIcon class="mr-2" />
          {{ $t('components.navbar.customize.theme.dark') }}
        </Button>
      </div>
      <div v-if="isChristmas" class="flex items-center justify-between gap-2">
        {{ $t('components.navbar.customize.enableSnow') }}
        <Switch
          :default-value="isSnowEnabled === 'true'"
          @update:model-value="(value: boolean) => (isSnowEnabled = String(value))"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>
