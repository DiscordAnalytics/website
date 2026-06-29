export default function scrollTo(id: string) {
  const element = document.getElementById(id) as HTMLElement | undefined
  if (!element) return
  element.scrollIntoView({ behavior: 'smooth' })
}
