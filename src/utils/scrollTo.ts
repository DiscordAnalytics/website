import { useRouter } from 'vue-router'

export default function scrollTo(id: string) {
  const router = useRouter()

  const element = document.getElementById(id) as HTMLElement | undefined
  if (!element) return
  element.scrollIntoView({ behavior: 'smooth' })
  router.push(window.location.pathname + `#${id}`)
}
