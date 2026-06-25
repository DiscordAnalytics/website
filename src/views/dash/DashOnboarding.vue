<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { Check, Clock, Code, IdCard, Sparkles, Bot as BotIcon, ArrowLeft } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { addBotSchema } from '@/utils/formSchemas.ts'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAddBot, useAnalytics, useCurrentUser, useLoading, useFeatureFlag } from '@/composables'
import {
  OnboardingStepFour,
  OnboardingStepOne,
  OnboardingStepThree,
  OnboardingStepTwo,
} from '@/components/dash/onboarding'
import { useRouteQuery } from '@vueuse/router'
import { toast } from 'vue-sonner'
import fireworksParticlesOptions from '@/utils/particles/fireworks.ts'
import { breakpointsTailwind, useBreakpoints, useLocalStorage } from '@vueuse/core'
import { cn } from '@/lib/utils.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const { handleSubmit } = useForm({
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
const breakpoints = useBreakpoints(breakpointsTailwind)
const { isLoading, withLoading } = useLoading()

const onboardingVersion = useFeatureFlag('onboarding-version')
const selectedFlow = ref<'choose' | 'connect'>('choose')
const eventCaptured = ref(false)

onMounted(() => {
  console.log(onboardingVersion.value, ownedBots.value, selectedFlow.value)
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

const largerThanMd = breakpoints.greater('md')
const currentStep = ref(route.query.botId ? 2 : 1)

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

const onSubmit = handleSubmit(async (values) => {
  await withLoading(async () => {
    await addBot(values.botId)
      .then(() => {
        currentStep.value = 2
        botId.value = values.botId
        capture('onboarding_bot_added', { bot_id: values.botId })
      })
      .catch((err) => {
        toast.error(err.message)
      })
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
          <Stepper
            :model-value="currentStep"
            :orientation="largerThanMd ? 'horizontal' : 'vertical'"
            :class="cn('flex w-fit md:w-10/12 items-start gap-2 mx-auto flex-col md:flex-row')"
          >
            <StepperItem
              v-for="item in steps"
              :key="item.step"
              :step="item.step"
              class="relative flex w-full md:flex-col items-start md:items-center md:justify-center"
            >
              <StepperTrigger>
                <StepperIndicator v-slot="{ step }" class="bg-muted">
                  <template v-if="item.icon">
                    <component :is="item.icon" class="w-4 h-4" />
                  </template>
                  <span v-else>{{ step }}</span>
                </StepperIndicator>
              </StepperTrigger>
              <StepperSeparator
                v-if="item.step !== steps[steps.length - 1]?.step"
                :class="
                  largerThanMd
                    ? 'absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary'
                    : 'absolute left-4.5 top-9.5 block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary'
                "
              />
              <div class="flex flex-col md:items-center">
                <StepperTitle>
                  {{ item.title }}
                </StepperTitle>
                <StepperDescription>
                  {{ item.description }}
                </StepperDescription>
              </div>
            </StepperItem>
          </Stepper>
        </CardHeader>
        <CardContent class="mt-4">
          <Transition name="slide-right" mode="out-in">
            <OnboardingStepOne v-if="currentStep === 1" :loading="isLoading" @submit="onSubmit" />
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
