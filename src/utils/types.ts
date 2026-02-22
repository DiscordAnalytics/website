
export enum InteractionType {
  Unknown,
  Ping,
  ApplicationCommand,
  MessageComponent,
  ApplicationCommandAutocomplete,
  ModalSubmit
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
  SUBSCRIPTION_GROUP = 6
}

export enum BotAchievementType {
  GuildCount = "GuildCount",
  InteractionAverageWeek = "InteractionAverageWeek",
  FrenchPercentage = "FrenchPercentage",
  JoinedDa = "JoinedDa",
  UsersLocales = "UsersLocales",
  UserCount = "UserCount",
  BotConfigured = "BotConfigured",
  VotesCount = "VotesCount",
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
  userId: string,
  username: string,
  avatar?: string,
  avatar_decoration?: string,
  email: string,
  banned: boolean,
  joinedAt: string,
  createdAt: string,
  botsLimit: number,
  admin: boolean
}

export interface Bot {
  botId: string,
  username: string,
  avatar?: string,
  watchedSince: string,
  language?: string,
  framework?: string,
  ownerId: string,
  token: string,
  banned: boolean,
  version: string,
  team: Teammate[],
  lastPush?: string,
  votesWebhookUrl: string,
  advancedStats: boolean
}

export type Color =
  | 'zinc'
  | 'orange'
  | 'red'
  | 'blue'
  | 'green';

export interface BotScanResult {
  title: string,
  message: string,
  link?: string,
  type: "info" | "warn" | "error",
  botId: string
}

export interface RawStats {
  id: number;
  botId: string;
  date: string;
  guildCount?: number;
  guildLocales?: {
    locale: string;
    number: number;
  }[];
  guildMembers?: {
    little: number;
    medium: number;
    big: number;
    huge: number;
  };
  interactions?: {
    name: string;
    type: InteractionType;
    number: number;
    command_type?: ApplicationCommandType;
  }[];
  interactionsLocales?: {
    locale: string;
    number: number;
  }[];
  userCount?: number;
  guilds?: {
    guildId: string;
    name: string;
    members: number;
    interactions: number;
    icon: string;
  }[];
  addedGuilds?: number;
  removedGuilds?: number;
  users_type?: {
    admin: number;
    moderator: number;
    new_member: number;
    other: number;
    private_message: number;
  };
  custom_events: Record<string, number>;
  user_install_count: number;
}

export interface CustomEvent {
  bot_id: string;
  event_key: string;
  graph_name: string;
}

export interface RawVotes {
  id: number;
  date: string;
  provider: VotesProvider;
  botId: string;
  count: number;
}

export interface GlobalRawStats {
  id: number;
  date: string;
  botCount: number;
  userCount: number;
  logsEntryCount: number;
}

export interface FormattedStats {
  interactions: {
    allInteractionsEvolution: ChartData[],
    mostUsedInteractions: ChartData[],
    mostUsedCommands: ChartData[],
    mostUsedComponents: ChartData[],
    mostUsedModals: ChartData[],
    commandsTypesPie: Omit<ChartData, "date">[]
  },
  guilds: {
    guildsEvolution: ChartData[],
    guildsLocalesEvolution: ChartData[],
    guildsLocalesPie: Omit<ChartData, "date">[],
    addsAndRemoves: ChartData[],
    guildsSizeDistribution: Omit<ChartData, "date">[],
    biggestGuildsRank: {
      date: string;
      icon?: string;
      name: string;
      id: string;
      count: number;
    }[],
    mostActiveGuildsRank: {
      icon?: string;
      name: string;
      id: string;
      count: number;
    }[],
  },
  users: {
    usersEvolution: ChartData[],
    usersLocalesEvolution: ChartData[],
    usersLocalesPie: Omit<ChartData, "date">[],
    activityOverTheWeek: ChartData[],
    usersTypesPie: Omit<ChartData, "date">[],
    userInstallEvolution: Omit<ChartData, "date">[],
  },
  votes: {
    allVotesEvolution: ChartData[],
    votesPie: Omit<ChartData, "date">[],
    topggVotesEvolution: ChartData[],
    botlistmeVotesEvolution: ChartData[],
    dblistVotesEvolution: ChartData[],
    discordplaceVotesEvolution: ChartData[],
    discordscomVotesEvolution: ChartData[],
  },
  global: {
    usersEvolution: ChartData[],
    botsEvolution: ChartData[],
    logsEvolution: ChartData[],
    frameworksPie: Omit<ChartData, "date">[],
    botsCountPerUserPie: Omit<ChartData, "date">[],
    botsActivityPie: Omit<ChartData, "date">[],
    teammatesPerBotPie: Omit<ChartData, "date">[],
  },
  customEvents: ChartData[],
}


export interface Achievement {
  id: string;
  bot_id: string;
  editable: boolean;
  achieved_on?: string;
  objective: {
    type: GoalType;
    value: number;
  };
  current: number;
  title: string;
  title_i18n?: string;
  description: string;
  description_i18n?: string;
  shared?: boolean;
  from?: string;
  lang?: string;
  used_by: number;
}

export interface LogData {
  type: string;
  date: Date;
  content: string;
}

export interface RawLogsData {
  name: string;
  content: string;
  path: string;
}

export interface BlogArticle {
  createdAt: string;
  updatedAt?: string;
  authorId: string;
  title: string;
  tags: string[];
  description: string;
  isDraft: boolean;
  articleId: string;
  cover?: string;
  author: {
    username: string;
    avatar?: string;
  };
  content: string;
}

export interface Teammate {
  userId: string;
  username?: string;
  avatar?: string;
  pendingInvitation: boolean;
  invitationId?: string;
  registered: boolean;
}

export interface TeamInvitationData {
  invitation: {
    invitation_id: string;
    user_id: string;
    bot_id: string;
    expiration: Date;
    accepted: boolean;
  };
  bot_avatar?: string;
  bot_username: string;
  owner_avatar?: string;
  owner_username: string;
}

export interface AppMonetizationData {
  month: string;
  name_default: string;
  sku_type: SKUType;
  sales_count: number;
  sales_amount: number;
  refund_count: number;
  refund_amount: number;
  sales_currencies: {
    presentment_currency: string;
    sales_amount: string;
  }[];
  cancellation_count: number;
}

export interface StatsReport {
  bot_id: string;
  user_id: string;
  frequency: "weekly" | "monthly"
}

export interface SearchParam {
  key: string;
  type: string;
}

export const searchBotParams: SearchParam[] = [
  { key: "botId", type: "string" },
  { key: "username", type: "string" },
  { key: "avatar", type: "string" },
  { key: "watchedSince", type: "string" },
  { key: "language", type: "string" },
  { key: "framework", type: "string" },
  { key: "ownerId", type: "string" },
  { key: "banned", type: "boolean" },
  { key: "version", type: "string" },
  { key: "team", type: "array" },
  { key: "lastPush", type: "string" },
  { key: "votesWebhookUrl", type: "string" },
  { key: "advancedStats", type: "boolean" }
];
export const searchUserParams: SearchParam[] = [
  { key: "userId", type: "string" },
  { key: "username", type: "string" },
  { key: "avatar", type: "string" },
  { key: "avatar_decoration", type: "string" },
  { key: "email", type: "string" },
  { key: "banned", type: "boolean" },
  { key: "joinedAt", type: "string" },
  { key: "createdAt", type: "string" },
  { key: "botsLimit", type: "number" },
  { key: "admin", type: "boolean" }
];
export const searchLogsParams: SearchParam[] = [
  { key: "content", type: "string" },
  { key: "date", type: "string" },
  { key: "type", type: "string" }
];

export const AppMonetizationSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      month: { type: "string" },
      name_default: { type: "string" },
      sku_type: { type: "string" },
      sales_count: { type: "string", pattern: "^[0-9]+$" },
      sales_amount: { type: "string", pattern: "^[0-9]+$" },
      refund_count: { type: "string", pattern: "^[0-9]+$" },
      refund_amount: { type: "string", pattern: "^[0-9]+$" },
      sales_currencies: { type: "string", pattern: "^\\[\\{.*\\}\\]$" },
      cancellation_count: { type: "string", pattern: "^[0-9]+$" }
    },
    required: [
      "month",
      "name_default",
      "sku_type",
      "sales_count",
      "sales_amount",
      "refund_count",
      "refund_amount",
      "sales_currencies",
      "cancellation_count"
    ]
  }
};

export type Anchor = {
  id: number
  text: string
  link: string
  level: number
  children: Anchor[]
}
export type VotesProvider = "topgg" | "dblist" | "botlistme" | "discordplace" | "discordscom"
export type ChartData = { date: string, [key: string]: number | string }
export type GoalType = "GuildCount" | "InteractionAverageWeek" | "FrenchPercentage" | "JoinedDA" | "UsersLocales" | "UserCount" | "BotConfigured" | "VotesCount"
