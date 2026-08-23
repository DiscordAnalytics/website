import {
  ChartNoAxesColumnIcon,
  SlidersHorizontalIcon,
  ThumbsUpIcon,
  TrophyIcon,
  UsersIcon,
} from '@lucide/vue'
import type { Component } from 'vue'

interface FeaturePage {
  /** Key under `pages.features.pages` — kept explicit because the home cards already use these. */
  i18nKey: string
  icon: Component
}

export const featurePages: Record<string, FeaturePage> = {
  graphs: { i18nKey: 'graphs', icon: ChartNoAxesColumnIcon },
  'custom-graphs': { i18nKey: 'custom_graphs', icon: SlidersHorizontalIcon },
  votes: { i18nKey: 'votes', icon: ThumbsUpIcon },
  achievements: { i18nKey: 'achievements', icon: TrophyIcon },
  teams: { i18nKey: 'teams', icon: UsersIcon },
}
