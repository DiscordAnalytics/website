import {
  type Achievement,
  type ChartData,
  type FormattedStats,
  InteractionType,
  type RawStats,
  type RawVotes,
  type VotesProvider,
} from '@/utils/types.ts'
import type { DateRange } from 'reka-ui'

type Granularity = 'hour' | 'day'

/** Returns 'hour' if the range is 7 days or less, 'day' otherwise. */
export function getRangeGranularity(dateRange: DateRange): Granularity {
  if (!dateRange.start || !dateRange.end) return 'day'
  const diff = dateRange.end.toDate('UTC').getTime() - dateRange.start.toDate('UTC').getTime()
  return diff <= 7 * 24 * 60 * 60 * 1000 ? 'hour' : 'day'
}

/** Truncates a date to midnight UTC (day bucket). */
const truncateToDate = (raw: string | Date): Date => {
  const d = new Date(raw)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

const toBucket = (raw: string | Date, granularity: Granularity): Date =>
  granularity === 'hour' ? new Date(raw) : truncateToDate(raw)

const isSameBucket = (a: Date, b: Date): boolean => a.getTime() === b.getTime()

/**
 * Generates all buckets (day or hour) between the start and end of a DateRange, inclusive.
 * Missing raw data entries will be filled with zeros against these buckets.
 */
function generateBuckets(dateRange: DateRange): Date[] {
  if (!dateRange.start || !dateRange.end) return []
  const granularity = getRangeGranularity(dateRange)
  const end = truncateToDate(dateRange.end.toDate('UTC'))
  const current = truncateToDate(dateRange.start.toDate('UTC'))

  const stepMs = granularity === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const endTime = granularity === 'hour' ? dateRange.end.toDate('UTC').getTime() : end.getTime()

  const bucketCount = Math.floor((endTime - current.getTime()) / stepMs) + 1

  return Array.from({ length: bucketCount }, (_, i) => new Date(current.getTime() + i * stepMs))
}

export function calculateInteractions(
  rawStats: RawStats[],
  dateRange: DateRange,
): FormattedStats['interactions'] {
  const granularity = getRangeGranularity(dateRange)
  const chartsData: FormattedStats['interactions'] = {
    allInteractionsEvolution: [],
    mostUsedInteractions: [],
    mostUsedCommands: [],
    mostUsedComponents: [],
    mostUsedModals: [],
    commandsTypesPie: [
      { name: 'Chat Input Commands', count: 0 },
      { name: 'User Commands', count: 0 },
      { name: 'Message Commands', count: 0 },
    ],
    interactionsTypesPie: [
      { name: 'Application Command', count: 0 },
      { name: 'Message Component', count: 0 },
      { name: 'Modal Submit', count: 0 },
    ],
  }

  const allInteractionsMap = new Map<string, { number: number; type: number }>()

  for (const stats of rawStats) {
    for (const interaction of stats.interactions || []) {
      const interactionName = interaction.name.replace(/\d{17,19}/g, 'id')
      const key = `${interaction.type}-${interactionName}`
      const existingInteraction = allInteractionsMap.get(key)

      if (existingInteraction) existingInteraction.number += interaction.number
      else allInteractionsMap.set(key, { number: interaction.number, type: interaction.type })

      if (interaction.commandType) {
        const pieEntry = chartsData.commandsTypesPie[interaction.commandType - 1]
        if (pieEntry) (pieEntry.count as number) += interaction.number
      }

      switch (interaction.type) {
        case InteractionType.ApplicationCommand:
          ;(chartsData.interactionsTypesPie[0]!.count as number) += interaction.number
          break
        case InteractionType.MessageComponent:
          ;(chartsData.interactionsTypesPie[1]!.count as number) += interaction.number
          break
        case InteractionType.ModalSubmit:
          ;(chartsData.interactionsTypesPie[2]!.count as number) += interaction.number
      }
    }
  }

  const allInteractions = Array.from(allInteractionsMap.entries())
    .map(([key, value]) => ({
      name: key.split('-').slice(1).join('-'),
      number: value.number,
      type: value.type,
    }))
    .sort((a, b) => b.number - a.number)

  const top3Interactions = allInteractions.slice(0, 3)
  const top3ByType = (type: number) => allInteractions.filter((x) => x.type === type).slice(0, 3)

  const top5Commands = top3ByType(2)
  const top5Components = top3ByType(3)
  const top5Modals = top3ByType(5)

  const ensureZeroEntries = (data: ChartData[], top5List: { name: string }[]) => {
    for (const entry of data) {
      for (const { name } of top5List) {
        if (!(name in entry)) entry[name] = 0
      }
    }
  }

  const addCount = (entry: ChartData, keys: string[], interactionName: string, count: number) => {
    if (keys.includes(interactionName))
      entry[interactionName] = ((entry[interactionName] as number) || 0) + count
  }

  for (const date of generateBuckets(dateRange)) {
    let totalInteractionsCount = 0
    const dailyStats = rawStats.find((stats) =>
      isSameBucket(toBucket(stats.date, granularity), date),
    )
    const dailyInteractions = dailyStats ? dailyStats.interactions || [] : []

    const dailyData: {
      mostUsedInteractions: ChartData
      mostUsedCommands: ChartData
      mostUsedComponents: ChartData
      mostUsedModals: ChartData
    } = {
      mostUsedInteractions: { date },
      mostUsedCommands: { date },
      mostUsedComponents: { date },
      mostUsedModals: { date },
    }

    for (const interaction of dailyInteractions) {
      const interactionName = interaction.name.replace(/\d{17,19}/g, 'id')

      addCount(
        dailyData.mostUsedInteractions,
        top3Interactions.map((x) => x.name),
        interactionName,
        interaction.number,
      )
      addCount(
        dailyData.mostUsedCommands,
        top5Commands.map((x) => x.name),
        interactionName,
        interaction.number,
      )
      addCount(
        dailyData.mostUsedComponents,
        top5Components.map((x) => x.name),
        interactionName,
        interaction.number,
      )
      addCount(
        dailyData.mostUsedModals,
        top5Modals.map((x) => x.name),
        interactionName,
        interaction.number,
      )

      totalInteractionsCount += interaction.number
    }

    chartsData.mostUsedInteractions.push(dailyData.mostUsedInteractions)
    chartsData.mostUsedCommands.push(dailyData.mostUsedCommands)
    chartsData.mostUsedComponents.push(dailyData.mostUsedComponents)
    chartsData.mostUsedModals.push(dailyData.mostUsedModals)

    chartsData.allInteractionsEvolution.push({
      date,
      Interactions: totalInteractionsCount,
    })
  }

  ensureZeroEntries(chartsData.mostUsedInteractions, top3Interactions)
  ensureZeroEntries(chartsData.mostUsedCommands, top5Commands)
  ensureZeroEntries(chartsData.mostUsedComponents, top5Components)
  ensureZeroEntries(chartsData.mostUsedModals, top5Modals)

  return chartsData
}

export function calculateGuilds(
  rawStats: RawStats[],
  dateRange: DateRange,
): FormattedStats['guilds'] {
  const granularity = getRangeGranularity(dateRange)
  const chartsData: FormattedStats['guilds'] = {
    guildsEvolution: [],
    guildsLocalesEvolution: [],
    guildsLocalesPie: [],
    addsAndRemoves: [],
    guildsSizeDistribution: [
      { name: 'Less than 100', count: 0 },
      { name: 'Between 100 and 500', count: 0 },
      { name: 'Between 500 and 1500', count: 0 },
      { name: 'More than 1500', count: 0 },
    ],
    biggestGuildsRank: [],
    mostActiveGuildsRank: [],
  }

  const allGuildLocales = new Map<string, number>()

  rawStats.forEach((stats) => {
    stats.guildLocales?.forEach((locale) => {
      allGuildLocales.set(locale.locale, (allGuildLocales.get(locale.locale) || 0) + locale.number)
    })
  })

  const sortedLocales = [...allGuildLocales.entries()].sort((a, b) => b[1] - a[1])

  rawStats.forEach((stats, index) => {
    const isLast = index === rawStats.length - 1

    if (isLast && stats.guildMembers) {
      const little = { name: 'Less than 100', count: stats.guildMembers.little }
      const medium = { name: 'Between 100 and 500', count: stats.guildMembers.medium }
      const big = { name: 'Between 500 and 1500', count: stats.guildMembers.big }
      const huge = { name: 'More than 1500', count: stats.guildMembers.huge }
      chartsData.guildsSizeDistribution = [little, medium, big, huge]
    }

    if (isLast) {
      stats.guildLocales?.forEach((locale) => {
        const existingLocaleData = chartsData.guildsLocalesPie.find((x) => x.name === locale.locale)
        if (existingLocaleData) (existingLocaleData.count as number) += locale.number
        else chartsData.guildsLocalesPie.push({ name: locale.locale, count: locale.number })
      })
    }

    stats.guilds?.forEach((guild) => {
      const date = toBucket(stats.date, granularity)
      const existingBiggestGuild = chartsData.biggestGuildsRank.find((x) => x.id === guild.guildId)
      if (!existingBiggestGuild || date > new Date(existingBiggestGuild.date!)) {
        chartsData.biggestGuildsRank = chartsData.biggestGuildsRank.filter(
          (x) => x.id !== guild.guildId,
        )
        chartsData.biggestGuildsRank.push({
          date: date.toISOString().slice(0, 10),
          icon: guild.icon,
          name: guild.name,
          id: guild.guildId,
          count: guild.members,
        })
      }

      const existingActiveGuild = chartsData.mostActiveGuildsRank.find(
        (x) => x.id === guild.guildId,
      )
      if (existingActiveGuild) existingActiveGuild.count += guild.interactions
      else
        chartsData.mostActiveGuildsRank.push({
          icon: guild.icon,
          name: guild.name,
          id: guild.guildId,
          count: guild.interactions,
        })
    })
  })

  const top3Locales = sortedLocales.slice(0, 3).map(([loc]) => loc)

  for (const date of generateBuckets(dateRange)) {
    const stats = rawStats.find((s) => isSameBucket(toBucket(s.date, granularity), date))

    chartsData.guildsEvolution.push({ date, Guilds: stats?.guildCount ?? 0 })
    chartsData.addsAndRemoves.push({
      date,
      Additions: stats?.addedGuilds ?? 0,
      Removals: stats?.removedGuilds ?? 0,
    })

    const localeEntry: ChartData = { date }
    for (const loc of top3Locales) {
      const localeData = stats?.guildLocales?.find((l) => l.locale === loc)
      localeEntry[loc] = localeData?.number ?? 0
    }
    if (top3Locales.length > 0) chartsData.guildsLocalesEvolution.push(localeEntry)
  }

  chartsData.mostActiveGuildsRank.sort((a, b) => b.count - a.count)
  chartsData.biggestGuildsRank.sort((a, b) => b.count - a.count)
  chartsData.guildsLocalesPie = chartsData.guildsLocalesPie.slice(0, 5)

  return chartsData
}

export function calculateUsers(
  rawStats: RawStats[],
  dateRange: DateRange,
): FormattedStats['users'] {
  const granularity = getRangeGranularity(dateRange)
  const chartsData: FormattedStats['users'] = {
    usersEvolution: [],
    usersLocalesEvolution: [],
    usersLocalesPie: [],
    activityOverTheWeek: [
      { date: new Date('1970-01-04'), Interactions: 0 }, // Sunday
      { date: new Date('1970-01-05'), Interactions: 0 }, // Monday
      { date: new Date('1970-01-06'), Interactions: 0 }, // Tuesday
      { date: new Date('1970-01-07'), Interactions: 0 }, // Wednesday
      { date: new Date('1970-01-08'), Interactions: 0 }, // Thursday
      { date: new Date('1970-01-09'), Interactions: 0 }, // Friday
      { date: new Date('1970-01-10'), Interactions: 0 }, // Saturday
    ],
    usersTypesPie: [
      { name: 'Server Administrator', count: 0 },
      { name: 'Server Moderator', count: 0 },
      { name: 'New Member', count: 0 },
      { name: 'Member', count: 0 },
      { name: 'DM User', count: 0 },
    ],
    userInstallEvolution: [],
  }

  const allLocales = new Map<string, number>()

  rawStats.forEach((stats) => {
    stats.interactionsLocales?.forEach((locale) => {
      allLocales.set(locale.locale, (allLocales.get(locale.locale) || 0) + locale.number)
    })
  })

  const sortedLocales = [...allLocales.entries()].sort((a, b) => b[1] - a[1])

  rawStats.forEach((stats, index) => {
    const day = new Date(stats.date).getDay()
    const isLast = index === rawStats.length - 1

    const totalInteractions =
      stats.interactions?.reduce((sum, interaction) => sum + interaction.number, 0) ?? 0
    // day is always 0–6 (derived from getDay()), array always has 7 entries
    chartsData.activityOverTheWeek[day]!['Interactions'] =
      (chartsData.activityOverTheWeek[day]!['Interactions'] as number) + totalInteractions

    if (isLast) {
      stats.interactionsLocales?.forEach((locale) => {
        const existingLocaleData = chartsData.usersLocalesPie.find((x) => x.name === locale.locale)
        if (existingLocaleData) (existingLocaleData.count as number) += locale.number
        else chartsData.usersLocalesPie.push({ name: locale.locale, count: locale.number })
      })

      if (stats.usersType) {
        chartsData.usersTypesPie = [
          { name: 'Server Administrator', count: stats.usersType.admin },
          { name: 'Server Moderator', count: stats.usersType.moderator },
          { name: 'New Member', count: stats.usersType.newMember },
          { name: 'Member', count: stats.usersType.other },
          { name: 'DM User', count: stats.usersType.privateMessage },
        ]
      }
    }
  })

  const top3Locales = sortedLocales.slice(0, 3).map(([loc]) => loc)

  for (const date of generateBuckets(dateRange)) {
    const stats = rawStats.find((s) => isSameBucket(toBucket(s.date, granularity), date))

    chartsData.usersEvolution.push({ date, Users: stats?.userCount ?? 0 })
    chartsData.userInstallEvolution.push({ date, Installations: stats?.userInstallCount ?? 0 })

    const localeEntry: ChartData = { date }
    for (const loc of top3Locales) {
      const localeData = stats?.interactionsLocales?.find((l) => l.locale === loc)
      localeEntry[loc] = localeData?.number ?? 0
    }
    if (top3Locales.length > 0) chartsData.usersLocalesEvolution.push(localeEntry)
  }

  return chartsData
}

export function calculateVotes(
  rawVotes: RawVotes[],
  dateRange: DateRange,
): FormattedStats['votes'] {
  const granularity = getRangeGranularity(dateRange)
  const chartsData: FormattedStats['votes'] = {
    allVotesEvolution: [],
    votesPie: [],
    topggVotesEvolution: [],
    botlistmeVotesEvolution: [],
    dblistVotesEvolution: [],
    discordplaceVotesEvolution: [],
    discordscomVotesEvolution: [],
  }

  // Aggregate votes by bucket and provider
  const votesMap = new Map<Date, { total: number; byProvider: Map<string, number> }>()
  const pieMap = new Map<string, number>()

  rawVotes.forEach((votes) => {
    const date = toBucket(votes.date, granularity)
    const providerName = selectVotesProvider(votes.provider)

    if (!votesMap.has(date)) votesMap.set(date, { total: 0, byProvider: new Map() })
    const entry = votesMap.get(date)!
    entry.total += votes.count
    if (providerName) {
      entry.byProvider.set(providerName, (entry.byProvider.get(providerName) ?? 0) + votes.count)
      pieMap.set(providerName, (pieMap.get(providerName) ?? 0) + votes.count)
    }
  })

  chartsData.votesPie = Array.from(pieMap.entries()).map(([name, total]) => ({ name, total }))

  for (const date of generateBuckets(dateRange)) {
    const entry = votesMap.get(date)

    chartsData.allVotesEvolution.push({ date, Votes: entry?.total ?? 0 })
    chartsData.topggVotesEvolution.push({ date, Votes: entry?.byProvider.get('Top.gg') ?? 0 })
    chartsData.botlistmeVotesEvolution.push({
      date,
      Votes: entry?.byProvider.get('BotList.me') ?? 0,
    })
    chartsData.dblistVotesEvolution.push({
      date,
      Votes: entry?.byProvider.get('Discord Bot List') ?? 0,
    })
    chartsData.discordplaceVotesEvolution.push({
      date,
      Votes: entry?.byProvider.get('Discord Place') ?? 0,
    })
    chartsData.discordscomVotesEvolution.push({
      date,
      Votes: entry?.byProvider.get('Discords.com') ?? 0,
    })
  }

  return chartsData
}

export function formatCustomEventsStats(
  rawStats: RawStats[],
  dateRange: DateRange,
): FormattedStats['customEvents'] {
  const granularity = getRangeGranularity(dateRange)
  const statsMap = new Map<number, ChartData>()
  const allEventNames = new Set<string>()

  for (const stats of rawStats) {
    const date = toBucket(stats.date, granularity)

    if (!stats.customEvents) continue

    for (const [eventName, eventCount] of Object.entries(stats.customEvents)) {
      allEventNames.add(eventName)
      const existingEntry = statsMap.get(date.getTime())
      if (existingEntry)
        (existingEntry[eventName] as number) =
          ((existingEntry[eventName] as number) || 0) + eventCount
      else statsMap.set(date.getTime(), { date, [eventName]: eventCount })
    }
  }

  const result: ChartData[] = []
  for (const date of generateBuckets(dateRange)) {
    const existing = statsMap.get(date.getTime())
    const entry: ChartData = existing ?? { date }
    for (const eventName of allEventNames) {
      if (!(eventName in entry)) entry[eventName] = 0
    }
    result.push(entry)
  }

  return result
}

/**
 * Calculates the percentage of the goal's current value compared to the objective.
 *
 * @param {Goal} goal - The goal to calculate the percentage of.
 * @returns {number} Returns the percentage of the goal's current value compared to the objective.
 */
export function goal2Percent(goal: Achievement): number {
  if (goal.objective.type === 'JoinedDA') {
    const difference = Date.now() - new Date(goal.current!).getTime()
    return Math.min(Math.round((difference / goal.objective.value) * 100), 100)
  }

  const percent = Math.round(((goal.current! as number) / goal.objective.value) * 100)
  return Math.min(Number.isNaN(percent) ? 0 : percent, 100)
}

const votesProviderMap: Record<VotesProvider, string> = {
  topgg: 'Top.gg',
  botlistme: 'BotList.me',
  dblist: 'Discord Bot List',
  discordplace: 'Discord Place',
  discordscom: 'Discords.com',
}

export function selectVotesProvider(entry: VotesProvider): string | undefined {
  return votesProviderMap[entry]
}
