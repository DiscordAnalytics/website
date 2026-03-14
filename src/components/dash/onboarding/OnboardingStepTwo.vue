<script setup lang="ts">
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { useBot } from '@/composables'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { CopyIcon, ExternalLinkIcon, TriangleAlertIcon } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CodeBlock from '@/components/CodeBlock.vue'
import * as codeExamples from '@/utils/codeExamples'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { useRouteQuery } from '@vueuse/router'

defineEmits<{
  (e: 'submit'): void
}>()

const botId = useRouteQuery<string>('botId', '')
const { copy, isSupported: isCopySupported } = useClipboard()
const { getToken } = useBot(botId)
const { t } = useI18n()

const isLoading = ref<boolean>(false)
const botToken = ref<string>('')
const botLibrary = ref<string>('discord.js')

function copyToken() {
  copy(botToken.value)
  toast.success(t('pages.dash.onboarding.stepTwo.getToken.tokenPlaceholder'))
}

onMounted(() => {
  isLoading.value = true
  setTimeout(async () => {
    botToken.value = (await getToken()).token
    isLoading.value = false
  }, 100)
})
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-black my-4">
        {{ $t('pages.dash.onboarding.stepTwo.getToken.heading') }}
      </h1>
      <p>
        {{ $t('pages.dash.onboarding.stepTwo.getToken.description') }}
        <span class="font-semibold">
          {{ $t('pages.dash.onboarding.stepTwo.getToken.doNotShare') }}
        </span>
      </p>

      <div class="flex items-center gap-2">
        <InputGroup class="my-2 max-w-150">
          <InputGroupInput
            :value="botToken"
            :placeholder="$t('pages.dash.onboarding.stepTwo.getToken.tokenPlaceholder')"
            :disabled="isLoading"
            readonly
          />
          <InputGroupAddon align="inline-end">
            <Spinner v-if="isLoading" />
          </InputGroupAddon>
        </InputGroup>
        <Button
          v-if="isCopySupported"
          variant="outline"
          size="icon"
          :disabled="isLoading"
          @click="copyToken"
        >
          <CopyIcon />
        </Button>
      </div>
    </div>

    <div>
      <h1 class="text-2xl font-black my-4">
        {{ $t('pages.dash.onboarding.stepTwo.integrate.heading') }}
      </h1>
      <p class="flex items-center gap-2">
        {{ $t('pages.dash.onboarding.stepTwo.integrate.description') }}

        <Select v-model:model-value="botLibrary">
          <SelectTrigger class="w-70">
            <SelectValue
              :placeholder="$t('pages.dash.onboarding.stepTwo.integrate.selectLibraryPlaceholder')"
            />
          </SelectTrigger>
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          <SelectContent class="w-(--reka-select-trigger-width)">
            <SelectGroup>
              <SelectLabel>
                {{ $t('pages.dash.onboarding.stepTwo.integrate.groupJavaScript') }}
              </SelectLabel>
              <SelectItem value="discord.js"> Discord.js </SelectItem>
              <SelectItem value="oceanic"> Oceanic.js </SelectItem>
              <SelectItem value="eris"> Eris </SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>
                {{ $t('pages.dash.onboarding.stepTwo.integrate.groupPython') }}
              </SelectLabel>
              <SelectItem value="discord.py"> Discord.py </SelectItem>
            </SelectGroup>
          </SelectContent>
          <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
        </Select>
      </p>

      <Transition name="library" mode="out-in">
        <div v-if="botLibrary === 'discord.js'">
          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.npmHeading') }}
          </h2>
          <CodeBlock code="npm install @discordanalytics/discordjs" lang="bash" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.addCodeHeading') }}
          </h2>
          <CodeBlock :code="codeExamples.discordjs" lang="js" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.startBotHeading') }}
          </h2>
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescription') }}</p>
          <CodeBlock code="export NODE_ENV=production # Linux/MacOS" lang="bash" />
          <CodeBlock code="$env:NODE_ENV='production' # Windows Powershell" lang="powershell" />
          <CodeBlock code="npm run start" lang="bash" />
        </div>
        <div v-else-if="botLibrary === 'oceanic'">
          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.npmHeading') }}
          </h2>
          <CodeBlock code="npm install @discordanalytics/oceanic" lang="bash" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.addCodeHeading') }}
          </h2>
          <CodeBlock :code="codeExamples.oceanic" lang="js" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.startBotHeading') }}
          </h2>
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescription') }}</p>
          <CodeBlock code="export NODE_ENV=production # Linux/MacOS" lang="bash" />
          <CodeBlock code="$env:NODE_ENV='production' # Windows Powershell" lang="powershell" />
          <CodeBlock code="npm run start" lang="bash" />
        </div>
        <div v-else-if="botLibrary === 'eris'">
          <Alert class="mt-4" variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>{{ $t('pages.dash.onboarding.stepTwo.erisWarning.title') }}</AlertTitle>
            <AlertDescription>
              {{ $t('pages.dash.onboarding.stepTwo.erisWarning.description') }}
            </AlertDescription>
          </Alert>

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.npmHeading') }}
          </h2>
          <CodeBlock code="npm install @discordanalytics/eris" lang="bash" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.addCodeHeading') }}
          </h2>
          <CodeBlock :code="codeExamples.oceanic" lang="js" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.startBotHeading') }}
          </h2>
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescription') }}</p>
          <CodeBlock code="export NODE_ENV=production # Linux/MacOS" lang="bash" />
          <CodeBlock code="$env:NODE_ENV='production' # Windows Powershell" lang="powershell" />
          <CodeBlock code="npm run start" lang="bash" />
        </div>
        <div v-else-if="botLibrary === 'discord.py'">
          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.pypiHeading') }}
          </h2>
          <CodeBlock code="pip install discordanalytics" lang="bash" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.addCodeHeading') }}
          </h2>
          <CodeBlock :code="codeExamples.discordpy" lang="py" />

          <h2 class="text-lg font-semibold my-4">
            {{ $t('pages.dash.onboarding.stepTwo.install.startBotHeading') }}
          </h2>
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescription') }}</p>
          <CodeBlock code="export NODE_ENV=production # Linux/MacOS" lang="bash" />
          <CodeBlock code="$env:NODE_ENV='production' # Windows Powershell" lang="powershell" />
          <CodeBlock code="python main.py" lang="bash" />
        </div>
      </Transition>

      <Item variant="outline" as-child class="mt-4">
        <a href="/docs/get-started/installation" target="_blank">
          <ItemContent>
            <ItemTitle>{{ $t('pages.dash.onboarding.stepTwo.moreExamples.title') }}</ItemTitle>
            <ItemDescription>
              {{ $t('pages.dash.onboarding.stepTwo.moreExamples.description') }}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon class="size-4" />
          </ItemActions>
        </a>
      </Item>

      <div class="flex justify-end mt-8">
        <Button @click="$emit('submit')">{{ $t('pages.dash.onboarding.stepTwo.next') }}</Button>
      </div>
    </div>
  </div>
</template>
