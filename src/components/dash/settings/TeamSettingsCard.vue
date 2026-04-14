<script setup lang="ts">
import SettingCard from '@/components/dash/SettingCard.vue'
import {
  CheckIcon,
  CopyIcon,
  LinkIcon,
  LockIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouteParams } from '@vueuse/router'
import { useBot, useBotTeam, useLoading } from '@/composables'
import { onMounted, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { addTeammateFormSchema } from '@/utils/formSchemas.ts'
import type { Teammate } from '@/utils/types.ts'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const botId = useRouteParams<string>('id')
const { bot } = useBot(botId)
const { team, fetch: fetchTeam, add: addTeammate, remove: removeTeammate } = useBotTeam(botId)
const { copy, isSupported: isCopySupported } = useClipboard()

const { isLoading, withLoading } = useLoading()
const addedTeammate = ref<{ sent: boolean; details: Teammate } | null>(null)

const form = useForm({
  validationSchema: toTypedSchema(addTeammateFormSchema),
})

async function onTeammateDelete(userId: string) {
  await withLoading(async () => {
    await removeTeammate(userId)
  })
}

const onSubmit = form.handleSubmit(async (values) => {
  await withLoading(async () => {
    await addTeammate(values.userId)
      .then((res) => {
        addedTeammate.value = res
      })
      .catch((err) => {
        toast.error(err.message)
      })
  })
})

function getInvitationURL(invitationId: string): string {
  return `${window.location.origin}/invitations/${invitationId}`
}

function copyInvitationURL(invitationId: string) {
  const url = getInvitationURL(invitationId)
  copy(url)
  toast.success(t('pages.dash.settings.general.team.toast.urlCopied'))
}

onMounted(async () => {
  await withLoading(async () => {
    await fetchTeam()
  })
})
</script>

<template>
  <SettingCard
    :title="$t('pages.dash.settings.general.team.title')"
    :icon="UsersIcon"
    :description="$t('pages.dash.settings.general.team.description', { username: bot!.username })"
    learn-more-link="/docs/get-started/advanced-usage/teams/"
  >
    <template #content>
      <div class="flex items-center gap-2 w-full justify-end">
        <Dialog @update:open="() => (addedTeammate = null)">
          <DialogTrigger>
            <Button :disabled="isLoading">
              <PlusIcon />
              {{ $t('pages.dash.settings.general.team.inviteButton') }}
            </Button>
          </DialogTrigger>
          <DialogContent v-if="!addedTeammate">
            <DialogHeader>
              <DialogTitle>{{ $t('pages.dash.settings.general.team.dialog.title') }}</DialogTitle>
              <DialogDescription>
                {{
                  $t('pages.dash.settings.general.team.dialog.description', {
                    username: bot!.username,
                  })
                }}
              </DialogDescription>
            </DialogHeader>

            <form id="addTeammateForm" @submit="onSubmit">
              <FieldGroup>
                <VeeField v-slot="{ field, errors }" name="userId">
                  <Field :data-invalid="!!errors.length">
                    <FieldLabel for="addTeammateInput">
                      {{ $t('pages.dash.settings.general.team.dialog.userIdLabel') }}
                    </FieldLabel>
                    <Input
                      id="addTeammateInput"
                      v-bind="field"
                      placeholder="692374264476860507"
                      autocomplete="off"
                      autofocus
                      :aria-invalid="!!errors.length"
                      :disabled="isLoading"
                    />
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((message) => ({ message }))"
                    />
                  </Field>
                </VeeField>

                <Field orientation="horizontal" class="flex items-center justify-end pt-2">
                  <Button type="submit" form="addTeammateForm" :disabled="isLoading">
                    <Spinner v-if="isLoading" />
                    {{ $t('pages.dash.settings.general.team.dialog.submitButton') }}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </DialogContent>
          <DialogContent v-else-if="addedTeammate.sent">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckIcon />
                </EmptyMedia>
                <EmptyTitle>{{ $t('pages.dash.settings.general.team.invited.title') }}</EmptyTitle>
                <EmptyDescription>
                  {{
                    $t('pages.dash.settings.general.team.invited.emailSent', {
                      username: addedTeammate.details.username,
                    })
                  }}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <DialogClose class="w-full">
                  <Button>{{ $t('pages.dash.settings.general.team.invited.close') }}</Button>
                </DialogClose>
              </EmptyContent>
            </Empty>
          </DialogContent>
          <DialogContent v-else>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckIcon />
                </EmptyMedia>
                <EmptyTitle>{{ $t('pages.dash.settings.general.team.invited.title') }}</EmptyTitle>
                <EmptyDescription>
                  {{
                    $t('pages.dash.settings.general.team.invited.emailFailed', {
                      userId: addedTeammate.details.userId,
                    })
                  }}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <InputGroup class="my-2 w-full">
                  <InputGroupInput
                    :value="getInvitationURL(addedTeammate.details.invitationId!)"
                    placeholder="https://discordanalytics.xyz/invitations/XXXXXX-XXXXXX-XXXXXX-XXXXXX"
                    :disabled="isLoading"
                    readonly
                  />
                  <InputGroupAddon align="inline-end">
                    <Spinner v-if="isLoading" />
                  </InputGroupAddon>
                  <InputGroupAddon v-if="isCopySupported" align="inline-end">
                    <InputGroupButton
                      :aria-label="$t('pages.dash.settings.general.team.invited.copyLabel')"
                      :title="$t('pages.dash.settings.general.team.invited.copyLabel')"
                      size="icon-xs"
                      @click="copyInvitationURL(addedTeammate.details.invitationId!)"
                    >
                      <CopyIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <DialogClose class="w-full">
                  <Button>{{ $t('pages.dash.settings.general.team.invited.close') }}</Button>
                </DialogClose>
              </EmptyContent>
            </Empty>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow class="hover:bg-background">
            <TableHead>{{ $t('pages.dash.settings.general.team.table.user') }}</TableHead>
            <TableHead>{{ $t('pages.dash.settings.general.team.table.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="isLoading">
          <TableRow v-for="i in 5" :key="i">
            <TableCell class="flex items-center gap-2">
              <Skeleton class="h-8 w-8 rounded-full" />
              <Skeleton class="h-6 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6 w-12" />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody v-else-if="team.length > 0">
          <TableRow v-for="teammate in team" :key="teammate.userId" class="hover:bg-background">
            <TableCell class="flex items-center gap-2">
              <DiscordAvatar
                :id="teammate.userId"
                :avatar="teammate.avatar"
                :alt="teammate.username ?? ''"
              />
              {{ teammate.username || teammate.userId }}
              <Badge v-if="teammate.pendingInvitation" variant="secondary">
                {{ $t('pages.dash.settings.general.team.table.pendingInvitation') }}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                v-if="teammate.pendingInvitation"
                variant="secondary"
                size="sm"
                class="mr-2"
                @click="copyInvitationURL(teammate.invitationId!)"
              >
                <LinkIcon />
                {{ $t('pages.dash.settings.general.team.table.copyLink') }}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                class="hover:bg-destructive/50"
                @click="onTeammateDelete(teammate.userId)"
              >
                <TrashIcon class="text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableEmpty v-else class="hover:bg-background" :colspan="2">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LockIcon />
            </EmptyMedia>
            <EmptyTitle>{{ $t('pages.dash.settings.general.team.empty.title') }}</EmptyTitle>
            <EmptyDescription>
              {{
                $t('pages.dash.settings.general.team.empty.description', {
                  username: bot!.username,
                })
              }}
            </EmptyDescription>
          </EmptyHeader>
        </TableEmpty>
      </Table>
    </template>
  </SettingCard>
</template>
