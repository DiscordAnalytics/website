import { useHead, useSeoMeta } from '@unhead/vue'
import { type MaybeRefOrGetter, computed, toValue } from 'vue'
import { useRoute } from 'vue-router'

const SITE_NAME = 'Discord Analytics'
const DEFAULT_IMAGE = 'https://r2.discordanalytics.xyz/images/banners/cyan_polygons.png'

interface SeoOptions {
  title: MaybeRefOrGetter<string | undefined>
  description: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | undefined>
  noindex?: MaybeRefOrGetter<boolean | undefined>
}

export default function useSeo(options: SeoOptions) {
  const route = useRoute()

  const title = computed(() => {
    const value = toValue(options.title)
    return value ? `${value} | ${SITE_NAME}` : SITE_NAME
  })
  const description = computed(() => toValue(options.description))
  const image = computed(() => toValue(options.image) || DEFAULT_IMAGE)
  const url = computed(() =>
    typeof window === 'undefined' ? route.path : `${window.location.origin}${route.path}`,
  )

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots: computed(() => (toValue(options.noindex) ? 'noindex, nofollow' : undefined)),
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}
