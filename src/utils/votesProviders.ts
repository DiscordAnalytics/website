import type { CustomIconName } from '@/components/CustomIcon.vue'

export interface VotesProviderListing {
  /** Per-bot page on the provider's own site, used to probe if the bot is listed there */
  botPage: (botId: string) => string
  /** Where to go list/submit the bot if it's not listed yet */
  submitPage: string
  isAvailable: (res: Response) => Promise<boolean>
}

export interface VotesProviderConnect {
  /** Per-bot page on the provider's own site where the owner clicks "connect" */
  url: (botId: string) => string
  /** Whether a webhook-secret-paste manual fallback is also offered */
  manualFallback: boolean
}

export interface VotesProviderDefinition {
  name: string
  homepage: string
  icon: CustomIconName
  /** Only present for providers with a one-click connect flow */
  connect?: VotesProviderConnect
  /** Only present for providers whose "is my bot listed" state can be probed */
  listing?: VotesProviderListing
}

const isNormalProviderApiAvailable = async (res: Response): Promise<boolean> => {
  if (res.status === 200) {
    const data = await res.json()
    if (data.status.http_code === 200) return true
  }
  return false
}

const votesProvidersData = {
  topgg: {
    name: 'Top.gg',
    homepage: 'https://top.gg',
    icon: 'topgg',
    connect: {
      url: (botId) => `https://top.gg/discord/bots/${botId}/dashboard/integrations`,
      manualFallback: true,
    },
    listing: {
      botPage: (botId) => `https://top.gg/bot/${botId}`,
      submitPage: 'https://top.gg/bot/new',
      isAvailable: isNormalProviderApiAvailable,
    },
  },
  botillon: {
    name: 'Botillon',
    homepage: 'https://botillon.fr',
    icon: 'botillon',
    connect: {
      url: (botId) => `https://botillon.fr/profil/bots/${botId}#outils`,
      manualFallback: false,
    },
    listing: {
      botPage: (botId) => `https://botillon.fr/bots/${botId}`,
      submitPage: 'https://botillon.fr/ajouter',
      isAvailable: isNormalProviderApiAvailable,
    },
  },
  discordscom: {
    name: 'Discords.com',
    homepage: 'https://discords.com',
    icon: 'discordscom',
  },
  botlistme: {
    name: 'BotList.me',
    homepage: 'https://botlist.me',
    icon: 'botlistme',
    listing: {
      botPage: (botId) => `https://api.botlist.me/api/v1/bots/${botId}`,
      submitPage: 'https://botlist.me/add',
      isAvailable: async (res) => {
        if (res.status === 200) {
          const data = await res.json()
          if (!data.contents.includes('error')) return true
        }
        return false
      },
    },
  },
  discordplace: {
    name: 'Discord.place',
    homepage: 'https://discord.place',
    icon: 'discordplace',
    listing: {
      botPage: (botId) => `https://api.discord.place/bots/${botId}`,
      submitPage: 'https://discord.place/account',
      isAvailable: isNormalProviderApiAvailable,
    },
  },
  dblist: {
    name: 'Discord Bot List',
    homepage: 'https://discordbotlist.com',
    icon: 'dblist',
    listing: {
      botPage: (botId) => `https://discordbotlist.com/bots/${botId}`,
      submitPage: 'https://discordbotlist.com/bots/add',
      isAvailable: isNormalProviderApiAvailable,
    },
  },
} as const satisfies Record<string, VotesProviderDefinition>

export type VotesProvider = keyof typeof votesProvidersData

// Widen back to `VotesProviderDefinition` (dropping the literal per-entry shapes `as const`
// produces) so every entry is known to have the same optional `connect`/`listing` fields,
// instead of TypeScript narrowing property access to the intersection of whichever fields
// happen to be present on every provider.
export const votesProviders: Record<VotesProvider, VotesProviderDefinition> = votesProvidersData
