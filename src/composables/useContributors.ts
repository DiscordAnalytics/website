import { ref } from 'vue'

export interface Contributor {
  name: string
  href: string
  avatar: string
  detail: string
}

const GITHUB_ORG = 'DiscordAnalytics'
const OPEN_COLLECTIVE_SLUG = 'discordanalytics'

interface GitHubContributor {
  login: string
  type: string
  avatar_url: string
  html_url: string
  contributions: number
}

interface OpenCollectiveMember {
  role: string
  totalDonations: { value: number; currency: string }
  account: {
    name: string
    slug: string
    imageUrl: string
    isIncognito: boolean
  }
}

export default function useContributors() {
  const coders = ref<Contributor[]>([])
  const backers = ref<Contributor[]>([])

  async function fetchCoders() {
    const repos: { name: string }[] = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100`,
    ).then((res) => (res.ok ? res.json() : []))

    const contributorsByRepo = await Promise.all(
      repos.map((repo) =>
        fetch(
          `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/contributors?per_page=100`,
        ).then<GitHubContributor[]>((res) => (res.ok ? res.json() : [])),
      ),
    )

    const byLogin = new Map<string, Contributor & { contributions: number }>()
    for (const contributor of contributorsByRepo.flat()) {
      if (contributor.type === 'Bot') continue

      const existing = byLogin.get(contributor.login)
      if (existing) {
        existing.contributions += contributor.contributions
      } else {
        byLogin.set(contributor.login, {
          name: contributor.login,
          href: contributor.html_url,
          avatar: contributor.avatar_url,
          detail: '',
          contributions: contributor.contributions,
        })
      }
    }

    coders.value = [...byLogin.values()]
      .sort((a, b) => b.contributions - a.contributions)
      .map((coder) => ({
        ...coder,
        detail: `${coder.contributions} commit${coder.contributions === 1 ? '' : 's'}`,
      }))
  }

  async function fetchBackers() {
    const { data } = await fetch('https://api.opencollective.com/graphql/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query {
          collective(slug: "${OPEN_COLLECTIVE_SLUG}") {
            members(role: [BACKER, CONTRIBUTOR], limit: 100) {
              nodes { role totalDonations { value currency } account { name slug imageUrl isIncognito } }
            }
          }
        }`,
      }),
    }).then((res) => res.json())

    const nodes: OpenCollectiveMember[] = data?.collective?.members?.nodes ?? []

    const bySlug = new Map<string, Contributor & { amount: number; currency: string }>()
    for (const { totalDonations, account } of nodes) {
      if (account.isIncognito) continue

      const existing = bySlug.get(account.slug)
      if (existing) {
        existing.amount += totalDonations.value
      } else {
        bySlug.set(account.slug, {
          name: account.name,
          href: `https://opencollective.com/${account.slug}`,
          avatar: account.imageUrl,
          detail: '',
          amount: totalDonations.value,
          currency: totalDonations.currency,
        })
      }
    }

    backers.value = [...bySlug.values()].map((backer) => ({
      ...backer,
      detail: new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: backer.currency,
      }).format(backer.amount),
    }))
  }

  async function fetchContributors() {
    await Promise.allSettled([fetchCoders(), fetchBackers()])
  }

  return { coders, backers, fetchContributors }
}
