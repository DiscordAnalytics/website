<script setup lang="ts">
import { ArrowLeft, Check, Clock, Code, IdCard } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useLocalStorage } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import {
  OnboardingStepFour,
  OnboardingStepOne,
  OnboardingStepThree,
  OnboardingStepTwo,
  PageLayout,
} from '@/components'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrack,
  StepperTrigger,
} from '@/components/ui'
import { useAddBot, useAnalytics, useCurrentUser, useFeatureFlag, useLoading } from '@/composables'
import { APIError } from '@/utils/api'
import { addBotSchema } from '@/utils/formSchemas.ts'
import fireworksParticlesOptions from '@/utils/particles/fireworks.ts'

const { t } = useI18n()
const router = useRouter()

const { handleSubmit, setFieldError, errors } = useForm({
  validationSchema: toTypedSchema(addBotSchema),
  initialValues: {
    botId: '',
    acceptTos: false,
  },
})
const route = useRoute()
const botId = useRouteQuery<string | null>('botId')
const { add: addBot } = useAddBot()
const { capture } = useAnalytics()
const { userInfos, ownedBots, fetch: fetchCurrentUser } = useCurrentUser()
const { isLoading, withLoading } = useLoading()

const onboardingVersion = useFeatureFlag('onboarding-version')
const selectedFlow = ref<'choose' | 'connect'>('choose')
const eventCaptured = ref(false)
const addBotFailed = ref(false)
const showFailureHelp = computed(() => addBotFailed.value && !!errors.value.botId)

onMounted(() => {
  if (onboardingVersion.value) {
    if (
      onboardingVersion.value === 'test' &&
      (!ownedBots.value || ownedBots.value.length === 0) &&
      selectedFlow.value !== 'connect'
    ) {
      selectedFlow.value = 'choose'
    } else {
      selectedFlow.value = 'connect'
    }
  }

  setTimeout(() => {
    if (!eventCaptured.value) {
      capture('onboarding_viewed', { version: onboardingVersion.value || 'control' })
      eventCaptured.value = true
    }
  }, 1000)
})

const currentStep = ref(route.query.botId ? 2 : 1)
const stepTransition = ref('slide-right')
watch(currentStep, (newStep, oldStep) => {
  stepTransition.value = newStep > oldStep ? 'slide-right' : 'slide-left'
})

const steps = [
  {
    step: 1,
    title: t('pages.dash.onboarding.steps.botInformations.title'),
    description: t('pages.dash.onboarding.steps.botInformations.description'),
    icon: IdCard,
  },
  {
    step: 2,
    title: t('pages.dash.onboarding.steps.configure.title'),
    description: t('pages.dash.onboarding.steps.configure.description'),
    icon: Code,
  },
  {
    step: 3,
    title: t('pages.dash.onboarding.steps.collectStats.title'),
    description: t('pages.dash.onboarding.steps.collectStats.description'),
    icon: Clock,
  },
  {
    step: 4,
    title: t('pages.dash.onboarding.steps.finished.title'),
    description: t('pages.dash.onboarding.steps.finished.description'),
    icon: Check,
  },
]

function onStepTwoSubmit(library: string) {
  capture('onboarding_library_selected', { library })
  currentStep.value = 3
}

function onStepThreeSubmit() {
  capture('onboarding_completed', { bot_id: botId.value })
  currentStep.value = 4
}

/**
 * Turn a failed `addBot` into an analytics reason plus a message we can show under the field.
 * The `not_a_bot` / `already_added` matches lean on the API's wording, so a copy change on the
 * backend degrades them to `api_error` rather than dropping the event.
 */
function classifyAddBotError(err: unknown) {
  if (!(err instanceof APIError)) {
    return { reason: 'network', message: t('pages.dash.onboarding.stepOne.errors.network') }
  }

  const detail = err.detail || ''
  const normalized = detail.toLowerCase()

  let reason = 'api_error'
  if (normalized.includes('bot account') || normalized.includes('not a bot')) reason = 'not_a_bot'
  else if (err.status === 409 || normalized.includes('already')) reason = 'already_added'

  return {
    reason,
    status: err.status,
    message: detail || t('pages.dash.onboarding.stepOne.errors.unknown'),
  }
}

const onSubmit = handleSubmit(async (values) => {
  // The single most common onboarding failure: pasting your own account ID instead of the bot's.
  // Catch it here so the user gets a message that names the mistake, with no round-trip.
  if (userInfos.value && values.botId === userInfos.value.userId) {
    addBotFailed.value = true
    setFieldError('botId', t('pages.dash.onboarding.stepOne.errors.ownId'))
    capture('onboarding_bot_add_failed', { reason: 'own_user_id', bot_id: values.botId })
    return
  }

  await withLoading(async () => {
    try {
      await addBot(values.botId)
      addBotFailed.value = false
      currentStep.value = 2
      botId.value = values.botId
      capture('onboarding_bot_added', { bot_id: values.botId })
    } catch (err) {
      const { reason, status, message } = classifyAddBotError(err)
      addBotFailed.value = true
      setFieldError('botId', message)
      // Transport failures have nothing to do with what's in the field, so they stay a toast.
      if (reason === 'network') toast.error(message)
      capture('onboarding_bot_add_failed', { reason, status, bot_id: values.botId })
    }
  })
})

function startSandbox() {
  useLocalStorage('sandbox_demo', false).value = true
  capture('onboarding_sandbox_started')
  capture('onboarding_completed', { bot_id: 'demo-bot' })

  fetchCurrentUser().then(() => {
    toast.success('Welcome to Sandbox Demo!')
    router.push('/dash/bots/demo-bot')
  })
}
</script>

<template>
  <PageLayout :footer="false">
    <Card v-if="userInfos" class="max-w-275 mx-auto w-full overflow-clip my-8">
      <template v-if="selectedFlow === 'choose'">
        <CardContent class="py-12">
          <div class="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <h1 class="text-4xl font-extrabold mb-4">
              {{ $t('pages.dash.onboarding.newOnboarding.title') }}
            </h1>
            <p class="text-muted-foreground text-lg mb-8 max-w-lg">
              {{ $t('pages.dash.onboarding.newOnboarding.description') }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
              <Card class="flex flex-col justify-between cursor-pointer" @click="startSandbox">
                <CardHeader>
                  <CardTitle class="text-xl">
                    {{ $t('pages.dash.onboarding.newOnboarding.demoCardTitle') }}
                  </CardTitle>
                  <CardDescription class="text-left">
                    {{ $t('pages.dash.onboarding.newOnboarding.demoCardDesc') }}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button class="w-full" variant="outline">
                    {{ $t('pages.dash.onboarding.newOnboarding.demoCardButton') }}
                  </Button>
                </CardFooter>
              </Card>

              <Card
                class="flex flex-col justify-between cursor-pointer"
                @click="selectedFlow = 'connect'"
              >
                <CardHeader>
                  <CardTitle class="text-xl">
                    {{ $t('pages.dash.onboarding.newOnboarding.connectCardTitle') }}
                  </CardTitle>
                  <CardDescription class="text-left">
                    {{ $t('pages.dash.onboarding.newOnboarding.connectCardDesc') }}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button class="w-full">
                    {{ $t('pages.dash.onboarding.newOnboarding.connectCardButton') }}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
      </template>

      <template v-else>
        <CardHeader>
          <Button
            v-if="currentStep === 1 && onboardingVersion === 'test'"
            variant="ghost"
            size="sm"
            class="mb-4 self-start flex items-center"
            @click="selectedFlow = 'choose'"
          >
            <ArrowLeft class="mr-2 h-4 w-4" />
            {{ $t('pages.dash.onboarding.stepThree.getBack') }}
          </Button>
          <Stepper :model-value="currentStep" class="mx-auto md:w-10/12">
            <StepperTrack>
              <StepperItem
                v-for="item in steps"
                v-slot="{ state }"
                :key="item.step"
                :step="item.step"
              >
                <StepperSeparator />
                <StepperTrigger>
                  <StepperIndicator>
                    <Check v-if="state === 'completed'" />
                    <component :is="item.icon" v-else-if="item.icon" />
                    <span v-else>{{ item.step }}</span>
                  </StepperIndicator>
                </StepperTrigger>
                <StepperTitle>
                  {{ item.title }}
                </StepperTitle>
                <StepperDescription>
                  {{ item.description }}
                </StepperDescription>
              </StepperItem>
            </StepperTrack>
          </Stepper>
        </CardHeader>
        <CardContent class="mt-4">
          <Transition :name="stepTransition" mode="out-in">
            <OnboardingStepOne
              v-if="currentStep === 1"
              :loading="isLoading"
              :failed="showFailureHelp"
              @submit="onSubmit"
            />
            <OnboardingStepTwo v-else-if="currentStep === 2" @submit="onStepTwoSubmit" />
            <OnboardingStepThree
              v-else-if="currentStep === 3"
              @submit="onStepThreeSubmit"
              @exit="currentStep = 2"
            />
            <OnboardingStepFour v-else-if="currentStep === 4" />
          </Transition>
        </CardContent>
      </template>
    </Card>
  </PageLayout>

  <vue-particles
    v-if="currentStep === 4"
    id="tsparticles"
    :options="fireworksParticlesOptions"
    class="z-60 fixed h-screen w-screen"
  />
</template>
