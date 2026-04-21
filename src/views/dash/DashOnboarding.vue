<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { Check, Clock, Code, IdCard } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { addBotSchema } from '@/utils/formSchemas.ts'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAddBot, useAnalytics, useCurrentUser, useLoading } from '@/composables'
import {
  OnboardingStepFour,
  OnboardingStepOne,
  OnboardingStepThree,
  OnboardingStepTwo,
} from '@/components/dash/onboarding'
import { useRouteQuery } from '@vueuse/router'
import { toast } from 'vue-sonner'
import fireworksParticlesOptions from '@/utils/particles/fireworks.ts'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { cn } from '@/lib/utils.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
const { userInfos } = useCurrentUser()
const breakpoints = useBreakpoints(breakpointsTailwind)
const { isLoading, withLoading } = useLoading()

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
</script>

<template>
  <PageLayout :footer="false">
    <Card v-if="userInfos" class="max-w-275 mx-auto w-full overflow-clip my-8">
      <CardHeader>
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
    </Card>
  </PageLayout>

  <vue-particles
    v-if="currentStep === 4"
    id="tsparticles"
    :options="fireworksParticlesOptions"
    class="z-60 fixed h-screen w-screen"
  />
</template>
