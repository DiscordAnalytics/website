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
import { AlertTriangleIcon, Check, Clock, Code, IdCard } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { addBotSchema } from '@/utils/formSchemas.ts'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAddBot, useCurrentUser } from '@/composables'
import {
  OnboardingStepFour,
  OnboardingStepOne,
  OnboardingStepThree,
  OnboardingStepTwo,
} from '@/components/dash/onboarding'
import { useRouteQuery } from '@vueuse/router'
import { toast } from 'vue-sonner'
import fireworksParticlesOptions from '@/utils/particles/fireworks.ts'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
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
const { userInfos, ownedBots } = useCurrentUser()
const breakpoints = useBreakpoints(breakpointsTailwind)

const largerThanMd = breakpoints.greater('md')
const isLoading = ref<boolean>(false)
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

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  await addBot(values.botId)
    .then(() => {
      currentStep.value = 2
      botId.value = values.botId
    })
    .catch((err) => {
      toast.error(err.message)
    })
  isLoading.value = false
})
</script>

<template>
  <PageLayout :footer="false">
    <Card
      v-if="userInfos && userInfos.botsLimit > ownedBots.length"
      class="max-w-275 mx-auto w-full overflow-clip my-8"
    >
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
          <OnboardingStepTwo v-else-if="currentStep === 2" @submit="currentStep = 3" />
          <OnboardingStepThree
            v-else-if="currentStep === 3"
            @submit="currentStep = 4"
            @exit="currentStep = 2"
          />
          <OnboardingStepFour v-else-if="currentStep === 4" />
        </Transition>
      </CardContent>
    </Card>
    <Empty v-else-if="userInfos" class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.dash.onboarding.botLimitReached.title') }}</EmptyTitle>
        <EmptyDescription>
          {{ $t('pages.dash.onboarding.botLimitReached.description') }}
        </EmptyDescription>
        <EmptyContent>
          <RouterLink to="/support">
            <Button> {{ $t('pages.dash.onboarding.botLimitReached.joinSupport') }} </Button>
          </RouterLink>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  </PageLayout>

  <vue-particles
    v-if="currentStep === 4"
    id="tsparticles"
    :options="fireworksParticlesOptions"
    class="z-60 fixed h-screen w-screen"
  />
</template>
