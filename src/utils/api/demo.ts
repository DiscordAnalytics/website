import { useLocalStorage } from '@vueuse/core'

export function getDemoBot(userId: string | null) {
  return {
    botId: 'demo-bot',
    username: 'Demo Bot',
    watchedSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    framework: 'discord.js',
    ownerId: 'demo-owner',
    suspended: false,
    version: '1.0.0',
    team: [userId || 'demo-user'],
    lastPush: new Date().toISOString(),
    advancedStats: true,
    goalsLimit: 5,
    customEventsLimit: 10,
    teammatesLimit: 3,
    webhooksConfig: {
      providers: {},
    },
  }
}

export function handleDemoRequest<T>(method: string, path: string, userId: string | null): T {
  if (method === 'GET') {
    if (path === '/bots/demo-bot') {
      return getDemoBot(userId) as unknown as T
    }
    if (path.startsWith('/bots/demo-bot/stats')) {
      const urlParams = new URLSearchParams(path.split('?')[1])
      const fromStr =
        urlParams.get('from') ||
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const toStr = urlParams.get('to') || new Date().toISOString().split('T')[0]
      return generateMockStats(fromStr, toStr) as unknown as T
    }
    if (path === '/bots/demo-bot/events') {
      return [
        { defaultValue: null, eventKey: 'play_song', graphName: 'Songs Played' },
        { defaultValue: null, eventKey: 'add_to_queue', graphName: 'Songs Added to Queue' },
        {
          defaultValue: null,
          eventKey: 'premium_purchase_click',
          graphName: 'Premium Purchases',
        },
      ] as unknown as T
    }
    if (path === '/bots/demo-bot/achievements') {
      return [
        {
          id: 'ach-1',
          botId: 'demo-bot',
          achievedOn: '2026-03-01T12:00:00.000Z',
          objective: { type: 'GuildCount', value: 100 },
          current: 285,
          title: 'First Milestone',
          description: 'Grow your bot to 100 guilds.',
          shared: true,
          usedBy: 1420,
        },
        {
          id: 'ach-2',
          botId: 'demo-bot',
          achievedOn: '2026-04-15T12:00:00.000Z',
          objective: { type: 'UserCount', value: 1000 },
          current: 40000,
          title: 'Popular Bot',
          description: 'Reach 1,000 total users.',
          shared: true,
          usedBy: 2150,
        },
        {
          id: 'ach-3',
          botId: 'demo-bot',
          achievedOn: '2026-05-20T12:00:00.000Z',
          objective: { type: 'InteractionAverageWeek', value: 500 },
          current: 1200,
          title: 'Active Community',
          description: 'Maintain an average of 500 weekly interactions.',
          shared: false,
          usedBy: 850,
        },
        {
          id: 'ach-4',
          botId: 'demo-bot',
          objective: { type: 'GuildCount', value: 500 },
          current: 285,
          title: 'Rising Star',
          description: 'Expand your bot to 500 guilds.',
          shared: false,
          usedBy: 420,
        },
      ] as unknown as T
    }
    if (path === '/bots/demo-bot/token') {
      return { token: 'demo-token-12345' } as unknown as T
    }
  } else if (method === 'DELETE' && path === '/bots/demo-bot') {
    useLocalStorage('sandbox_demo', false).value = false
    return {} as unknown as T
  } else {
    return {} as unknown as T
  }

  return {} as unknown as T
}

function generateMockStats(fromStr: string, toStr: string) {
  const stats = []
  const votes = []
  const from = new Date(fromStr)
  const to = new Date(toStr)

  const current = new Date(from)
  let index = 0
  while (current <= to) {
    const dateStr = current.toISOString().split('T')[0]
    const dayOfWeek = current.getUTCDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseMultiplier = isWeekend ? 1.35 : 1.0
    const seed = (Math.sin(index * 0.4) + Math.cos(index * 0.15) + 3.5) * baseMultiplier

    const guildCount = Math.floor(250 + index * 1.5 + Math.sin(index * 0.2) * 15)
    const userCount = guildCount * 140 + Math.floor(seed * 800)

    stats.push({
      id: index,
      botId: 'demo-bot',
      date: dateStr,
      guildCount,
      userCount,
      guildLocales: [
        { locale: 'en-US', number: Math.floor(guildCount * 0.55) },
        { locale: 'fr', number: Math.floor(guildCount * 0.22) },
        { locale: 'de', number: Math.floor(guildCount * 0.13) },
        { locale: 'es', number: Math.floor(guildCount * 0.1) },
      ],
      guildMembers: {
        little: Math.floor(guildCount * 0.35),
        medium: Math.floor(guildCount * 0.45),
        big: Math.floor(guildCount * 0.15),
        huge: Math.floor(guildCount * 0.05),
      },
      interactions: [
        { name: 'play', type: 2, number: Math.floor(seed * 180), commandType: 1 },
        { name: 'skip', type: 2, number: Math.floor(seed * 120), commandType: 1 },
        { name: 'queue', type: 2, number: Math.floor(seed * 90), commandType: 1 },
        { name: 'volume', type: 2, number: Math.floor(seed * 40), commandType: 1 },
        { name: 'help', type: 2, number: Math.floor(seed * 60), commandType: 1 },
        { name: 'music_control_btn', type: 3, number: Math.floor(seed * 350) },
        { name: 'playlist_select', type: 3, number: Math.floor(seed * 150) },
        { name: 'custom_playlist_modal', type: 5, number: Math.floor(seed * 70) },
      ],
      interactionsLocales: [
        { locale: 'en-US', number: Math.floor(seed * 600) },
        { locale: 'fr', number: Math.floor(seed * 250) },
        { locale: 'de', number: Math.floor(seed * 150) },
      ],
      guilds: [
        { guildId: 'g1', name: 'Official Music Hub', members: 12500, interactions: 1850, icon: '' },
        { guildId: 'g2', name: 'Gamer Clan', members: 5400, interactions: 920, icon: '' },
        { guildId: 'g3', name: 'Lo-Fi Chill Cafe', members: 3100, interactions: 610, icon: '' },
        { guildId: 'g4', name: 'Anime Lounge', members: 1800, interactions: 430, icon: '' },
      ],
      addedGuilds: Math.max(0, Math.floor(seed * 1.5) - 2),
      removedGuilds: Math.max(0, Math.floor(seed * 0.6) - 1),
      usersType: {
        admin: Math.floor(userCount * 0.04),
        moderator: Math.floor(userCount * 0.07),
        newMember: Math.floor(userCount * 0.15),
        other: Math.floor(userCount * 0.69),
        privateMessage: Math.floor(userCount * 0.05),
      },
      customEvents: {
        play_song: Math.floor(seed * 300),
        add_to_queue: Math.floor(seed * 210),
        premium_purchase_click: Math.floor(seed * 8),
      },
      userInstallCount: Math.floor(seed * 40),
    })

    votes.push({
      id: index,
      date: dateStr,
      botId: 'demo-bot',
      votes: {
        topgg: Math.floor(seed * 18),
        botlistme: Math.floor(seed * 10),
        dblist: Math.floor(seed * 14),
        discordplace: Math.floor(seed * 6),
        discordscom: Math.floor(seed * 8),
      },
    })

    current.setDate(current.getDate() + 1)
    index++
  }
  return { stats, votes }
}
