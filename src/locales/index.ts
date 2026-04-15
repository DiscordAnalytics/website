export const maintainedLocales = ['en', 'fr']

// Use import.meta.glob to automatically import all JSON translation files
const modules = import.meta.glob('../**/*.json', { eager: true })

export type Translations = Record<string, any>

function setDeep(obj: Translations, keys: string[], value: unknown): void {
  const last = keys[keys.length - 1]!
  const parents = keys.slice(0, -1)

  let cursor = obj
  for (const key of parents) {
    if (!cursor[key]) cursor[key] = {}
    cursor = cursor[key]
  }

  cursor[last] = value
}

function buildLocaleTree(locale: string) {
  const tree: Translations = {}
  const localeSegment = `/${locale}/`

  for (const path in modules) {
    if (!path.includes(localeSegment)) continue

    // Strip everything up to and including '/<locale>/'
    const relative = path.slice(path.indexOf(localeSegment) + localeSegment.length)
    const keys = relative.replace(/\.json$/, '').split('/')

    const mod = modules[path] as any
    setDeep(tree, keys, mod.default ?? mod)
  }

  return tree
}

export const english = buildLocaleTree('en')
export const french = buildLocaleTree('fr')
