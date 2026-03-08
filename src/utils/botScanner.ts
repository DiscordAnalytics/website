import type { Bot, BotScanResult } from '@/utils/types'
import { oneMonthAgo, timeAgo } from './dateTime.ts'

export async function fetchLatestVersion(url: string, versionKey: string): Promise<string> {
  const res = await fetch(url, { cache: 'force-cache' })
  const data = await res.json()

  const version = versionKey.split('.').reduce((acc, part) => acc && acc[part], data)
  return versionKey === 'tag_name' ? version.split('v')[1] : version
}

export function compareVersions(versionA: string, versionB: string): boolean {
  const a = versionA.split('.').map(Number)
  const b = versionB.split('.').map(Number)

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const currA = a[i] || 0
    const currB = b[i] || 0
    if (currA > currB) return true
    if (currA < currB) return false
  }

  return true
}

export const frameworkChecks = [
  {
    frameworks: ['discord.js'],
    fetchUrl: 'https://registry.npmjs.org/@discordanalytics/discordjs',
    versionKey: 'dist-tags.latest',
    link: 'https://www.npmjs.com/package/@discordanalytics/discordjs/v/latest',
  },
  {
    frameworks: ['eris'],
    fetchUrl: 'https://registry.npmjs.org/@discordanalytics/eris',
    versionKey: 'dist-tags.latest',
    link: 'https://www.npmjs.com/package/@discordanalytics/eris/v/latest',
  },
  {
    frameworks: ['oceanic'],
    fetchUrl: 'https://registry.npmjs.org/@discordanalytics/oceanic',
    versionKey: 'dist-tags.latest',
    link: 'https://www.npmjs.com/package/@discordanalytics/oceanic/v/latest',
  },
  {
    frameworks: ['jda', 'discord4j', 'javacord'],
    fetchUrl: 'https://api.github.com/repos/DiscordAnalytics/java-package/releases/latest',
    versionKey: 'tag_name',
    link: 'https://github.com/DiscordAnalytics/java-package/packages/1839795',
  },
  {
    frameworks: ['discord.py'],
    fetchUrl: 'https://pypi.org/pypi/discordanalytics/json',
    versionKey: 'info.version',
    link: 'https://pypi.org/project/discordanalytics',
  },
]

export default async function scanBot(bot: Bot): Promise<BotScanResult> {
  if (!bot.framework || !bot.version)
    return {
      title: 'Bot is not configured',
      type: 'error',
    }

  if (bot.suspended)
    return {
      title: 'Bot is suspended',
      type: 'error',
    }

  for (const check of frameworkChecks) {
    if (check.frameworks.includes(bot.framework)) {
      const latestVersion = await fetchLatestVersion(check.fetchUrl, check.versionKey)
      if (!compareVersions(bot.version as string, latestVersion))
        return {
          title: 'Package outdated',
          type: 'warn',
        }
    }
  }

  const lastPushDate = new Date(bot.lastPush as string)

  if (!bot.lastPush || lastPushDate < oneMonthAgo)
    return {
      title: 'No stats received',
      type: 'error',
    }

  return {
    title: `Last stats push: ${timeAgo(bot.lastPush as string)}`,
    type: 'info',
  }
}

export function getScanTypeColor(type: BotScanResult['type']): string {
  switch (type) {
    case 'info':
      return 'bg-green-400'
    case 'warn':
      return 'bg-orange-400'
    default:
      return 'bg-red-400'
  }
}
