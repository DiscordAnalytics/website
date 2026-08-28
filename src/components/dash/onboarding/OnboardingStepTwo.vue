<script setup lang="ts">
import { CopyIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { CodeBlock } from '@/components'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/components/ui'
import { useBot, useLoading } from '@/composables'
import * as codeExamples from '@/utils/codeExamples'

const emit = defineEmits<{
  (e: 'submit', library: string): void
}>()

const botId = useRouteQuery<string>('botId', '')
const { copy, isSupported: isCopySupported } = useClipboard()
const { getToken } = useBot(botId)
const { t } = useI18n()
const { isLoading, withLoading } = useLoading()

const botToken = ref<string>('')
const showBotToken = ref<boolean>(false)
const botLibrary = ref<string>('discord.js')

function copyToken() {
  copy(botToken.value)
  toast.success(t('pages.dash.onboarding.stepTwo.getToken.tokenCopied'))
}

onMounted(() => {
  setTimeout(async () => {
    await withLoading(async () => {
      botToken.value = (await getToken()).token
    })
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
            :type="showBotToken ? 'text' : 'password'"
          />
          <InputGroupAddon align="inline-end">
            <Spinner v-if="isLoading" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              :aria-label="$t('pages.dash.onboarding.stepTwo.getToken.showToken')"
              :title="$t('pages.dash.onboarding.stepTwo.getToken.showToken')"
              size="icon-xs"
              @click="showBotToken = !showBotToken"
            >
              <EyeOffIcon v-if="showBotToken" />
              <EyeIcon v-else />
            </InputGroupButton>
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
              <SelectItem value="discord.js">Discord.js</SelectItem>
              <SelectItem value="oceanic">Oceanic.js</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>
                {{ $t('pages.dash.onboarding.stepTwo.integrate.groupPython') }}
              </SelectLabel>
              <SelectItem value="discord.py">Discord.py</SelectItem>
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
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescriptionNode') }}</p>
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
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescriptionNode') }}</p>
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
          <p>{{ $t('pages.dash.onboarding.stepTwo.install.startBotDescriptionPython') }}</p>
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
        <Button @click="emit('submit', botLibrary)">
          {{ $t('pages.dash.onboarding.stepTwo.next') }}
        </Button>
      </div>
    </div>
  </div>
</template>
