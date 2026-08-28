import type { Directive } from 'vue'

let observer: IntersectionObserver | undefined

const getObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        const el = entry.target as HTMLElement
        el.dataset.reveal = 'shown'
        observer?.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  ))

/** Fades an element up once it scrolls into view. The binding value is a delay in milliseconds. */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)

    el.dataset.reveal = 'hidden'
    getObserver().observe(el)
  },
  unmounted(el) {
    getObserver().unobserve(el)
  },
}
