const BASE = 'https://r2.discordanalytics.xyz/images'

const pair = (path: string) => ({
  dark: `${BASE}/${path}_dark.png`,
  light: `${BASE}/${path}_light.png`,
})

export const FEATURE_IMAGES = {
  interactionsPage: pair('features/interactions_page'),
  rangeSelector: pair('features/range_selector'),
  guildsRankings: pair('features/guilds_rankings'),
  customEventDialog: pair('features/custom_event_dialog'),
  reportEmail: pair('features/report_email'),
  customGraphs: pair('home/custom_graphs'),
  achievements: pair('home/achievements'),
}
