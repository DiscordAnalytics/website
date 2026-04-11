import type { Component, FunctionalComponent } from 'vue'
import type { Table } from '@tanstack/vue-table'

export enum InteractionType {
  Unknown,
  Ping,
  ApplicationCommand,
  MessageComponent,
  ApplicationCommandAutocomplete,
  ModalSubmit,
}

export enum ApplicationCommandType {
  ChatInputCommand = 1,
  UserCommand,
  MessageCommand,
}

export enum SKUType {
  DURABLE = 2,
  CONSUMABLE = 3,
  SUBSCRIPTION = 5,
  SUBSCRIPTION_GROUP = 6,
}

export enum BotAchievementType {
  GuildCount = 'GuildCount',
  InteractionAverageWeek = 'InteractionAverageWeek',
  FrenchPercentage = 'FrenchPercentage',
  JoinedDa = 'JoinedDa',
  UsersLocales = 'UsersLocales',
  UserCount = 'UserCount',
  BotConfigured = 'BotConfigured',
  VotesCount = 'VotesCount',
}

export enum DashboardState {
  Ready = 0,
  Loading,
  NotConfigured,
  NoStats,
  Unauthorized,
  Suspended,
}

export interface User {
  userId: string
  username: string
  avatar?: string
  avatarDecoration?: string
  suspended: boolean
  joinedAt: string
  createdAt: string
  botsLimit: number
  admin: boolean
}

export interface Bot {
  botId: string
  username: string
  avatar?: string
  watchedSince: string
  language?: string
  framework?: string
  ownerId: string
  suspended: boolean
  version?: string
  team: string[]
  lastPush?: string
  advancedStats: boolean
  goalsLimit: number
  customEventsLimit: number
  teammatesLimit: number
  webhooksConfig: {
    webhookUrl?: string
  } & {
    [provider: string]: {
      connectionId?: string
      webhookSecret?: string
    }
  }
}

export type Color = 'zinc' | 'orange' | 'red' | 'blue' | 'green'

export interface BotScanResult {
  title: string
  type: 'info' | 'warn' | 'error'
}

export interface RawStats {
  id: number
  botId: string
  date: string
  guildCount?: number
  guildLocales?: {
    locale: string
    number: number
  }[]
  guildMembers?: {
    little: number
    medium: number
    big: number
    huge: number
  }
  interactions?: {
    name: string
    type: InteractionType
    number: number
    commandType?: ApplicationCommandType
  }[]
  interactionsLocales?: {
    locale: string
    number: number
  }[]
  userCount?: number
  guilds?: {
    guildId: string
    name: string
    members: number
    interactions: number
    icon: string
  }[]
  addedGuilds?: number
  removedGuilds?: number
  usersType?: {
    admin: number
    moderator: number
    newMember: number
    other: number
    privateMessage: number
  }
  customEvents: Record<string, number>
  userInstallCount: number
}

export interface CustomEvent {
  defaultValue: number | null
  eventKey: string
  graphName: string
}

export interface RawVotes {
  id: number
  date: string
  provider: VotesProvider
  botId: string
  count: number
}

export interface ChartData {
  date: Date
  [key: string]: number | string | Date
}

export interface ChartTab {
  id: string
  label: string
  value: number
}

export interface ChartConfig {
  title: string
  description?: string
  data: (ChartData | Omit<ChartData, 'date'>)[]
  tabs: Omit<ChartTab, 'value'>[]
  component: Component
  colSpan?: number
  getValue: (data: (ChartData | Omit<ChartData, 'date'>)[], currentTab: string) => number
  isEmpty: (data: (ChartData | Omit<ChartData, 'date'>)[], currentTab: string) => boolean
  tickFormatter?: (d: number | Date) => string
}

export interface FormattedStats {
  interactions: {
    allInteractionsEvolution: ChartData[]
    mostUsedInteractions: ChartData[]
    mostUsedCommands: ChartData[]
    mostUsedComponents: ChartData[]
    mostUsedModals: ChartData[]
    commandsTypesPie: Omit<ChartData, 'date'>[]
    interactionsTypesPie: Omit<ChartData, 'date'>[]
  }
  guilds: {
    guildsEvolution: ChartData[]
    guildsLocalesEvolution: ChartData[]
    guildsLocalesPie: Omit<ChartData, 'date'>[]
    addsAndRemoves: ChartData[]
    guildsSizeDistribution: Omit<ChartData, 'date'>[]
    biggestGuildsRank: {
      date?: string
      icon?: string
      name: string
      id: string
      count: number
    }[]
    mostActiveGuildsRank: {
      icon?: string
      name: string
      id: string
      count: number
    }[]
  }
  users: {
    usersEvolution: ChartData[]
    usersLocalesEvolution: ChartData[]
    usersLocalesPie: Omit<ChartData, 'date'>[]
    activityOverTheWeek: ChartData[]
    usersTypesPie: Omit<ChartData, 'date'>[]
    userInstallEvolution: Omit<ChartData, 'date'>[]
  }
  votes: {
    allVotesEvolution: ChartData[]
    votesPie: Omit<ChartData, 'date'>[]
    topggVotesEvolution: ChartData[]
    botlistmeVotesEvolution: ChartData[]
    dblistVotesEvolution: ChartData[]
    discordplaceVotesEvolution: ChartData[]
    discordscomVotesEvolution: ChartData[]
  }
  global: {
    usersEvolution: ChartData[]
    botsEvolution: ChartData[]
    logsEvolution: ChartData[]
    frameworksPie: Omit<ChartData, 'date'>[]
    botsCountPerUserPie: Omit<ChartData, 'date'>[]
    botsActivityPie: Omit<ChartData, 'date'>[]
    teammatesPerBotPie: Omit<ChartData, 'date'>[]
  }
  customEvents: ChartData[]
}

export interface Achievement {
  id: string
  botId?: string
  achievedOn?: string
  objective: {
    type: GoalType
    value: number
  }
  current?: number
  title: string
  titleI18n?: string
  description: string
  descriptionI18n?: string
  shared?: boolean
  from?: string
  lang?: string
  usedBy: number
}

export interface BlogArticle {
  createdAt: string
  updatedAt?: string
  authorId: string
  title: string
  tags: string[]
  description: string
  isDraft: boolean
  articleId: string
  cover?: string
  author: {
    username: string
    avatar?: string
  }
  content: string
}

export interface Teammate {
  userId: string
  username?: string
  avatar?: string
  pendingInvitation: boolean
  invitationId?: string
  registered: boolean
}

export interface TeamInvitationData {
  invitation: {
    invitationId: string
    userId: string
    botId: string
    expiration: string
    accepted: boolean
  }
  botAvatar?: string
  botUsername: string
  ownerAvatar?: string
  ownerUsername: string
}

export interface AppMonetizationData {
  month: string
  name_default: string
  sku_type: SKUType
  sales_count: number
  sales_amount: number
  refund_count: number
  refund_amount: number
  sales_currencies: {
    presentment_currency: string
    sales_amount: string
  }[]
  cancellation_count: number
}

export interface StatsReport {
  botId: string
  userId: string
  frequency: 'weekly' | 'monthly'
}

export interface SearchParam {
  key: string
  type: string
}

export interface AuthTokens {
  userId: string | null
  accessToken: string | null
  accessTokenExpiration: number | null
  refreshToken: string | null
}

export interface OAuthConfig {
  clientId: string
  scopes: string[]
}

export interface OAuthSession {
  active: boolean
  current: boolean
  createdAt: string
  ipAddress?: string
  lastUsedAt: string
  sessionId: string
  userAgent?: string
}

export interface SidebarItem {
  title: string
  icon?: FunctionalComponent
  to?: string
  children?: SidebarItem[]
  tag?: string
}

export interface DataTableAction<TData> {
  title: string
  onSelect: (rowSelection: { [index: string]: boolean }, table: Table<TData>) => void
  destructive?: boolean
}

export const searchBotParams: SearchParam[] = [
  { key: 'botId', type: 'string' },
  { key: 'username', type: 'string' },
  { key: 'avatar', type: 'string' },
  { key: 'watchedSince', type: 'string' },
  { key: 'language', type: 'string' },
  { key: 'framework', type: 'string' },
  { key: 'ownerId', type: 'string' },
  { key: 'banned', type: 'boolean' },
  { key: 'version', type: 'string' },
  { key: 'team', type: 'array' },
  { key: 'lastPush', type: 'string' },
  { key: 'votesWebhookUrl', type: 'string' },
  { key: 'advancedStats', type: 'boolean' },
]
export const searchUserParams: SearchParam[] = [
  { key: 'userId', type: 'string' },
  { key: 'username', type: 'string' },
  { key: 'avatar', type: 'string' },
  { key: 'avatar_decoration', type: 'string' },
  { key: 'email', type: 'string' },
  { key: 'banned', type: 'boolean' },
  { key: 'joinedAt', type: 'string' },
  { key: 'createdAt', type: 'string' },
  { key: 'botsLimit', type: 'number' },
  { key: 'admin', type: 'boolean' },
]
export const searchLogsParams: SearchParam[] = [
  { key: 'content', type: 'string' },
  { key: 'date', type: 'string' },
  { key: 'type', type: 'string' },
]

export const AppMonetizationSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      month: { type: 'string' },
      name_default: { type: 'string' },
      sku_type: { type: 'string' },
      sales_count: { type: 'string', pattern: '^[0-9]+$' },
      sales_amount: { type: 'string', pattern: '^[0-9]+$' },
      refund_count: { type: 'string', pattern: '^[0-9]+$' },
      refund_amount: { type: 'string', pattern: '^[0-9]+$' },
      sales_currencies: { type: 'string', pattern: '^\\[\\{.*\\}\\]$' },
      cancellation_count: { type: 'string', pattern: '^[0-9]+$' },
    },
    required: [
      'month',
      'name_default',
      'sku_type',
      'sales_count',
      'sales_amount',
      'refund_count',
      'refund_amount',
      'sales_currencies',
      'cancellation_count',
    ],
  },
}

export type Anchor = {
  id: number
  text: string
  link: string
  level: number
  children: Anchor[]
}
export type VotesProvider = 'topgg' | 'dblist' | 'botlistme' | 'discordplace' | 'discordscom'
export type GoalType =
  | 'GuildCount'
  | 'InteractionAverageWeek'
  | 'FrenchPercentage'
  | 'JoinedDA'
  | 'UsersLocales'
  | 'UserCount'
  | 'BotConfigured'
  | 'VotesCount'
