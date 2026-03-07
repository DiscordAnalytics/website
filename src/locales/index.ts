export const maintainedLocales = ['en', 'fr']

// Use import.meta.glob to automatically import all JSON translation files
const modules = import.meta.glob('../**/*.json', { eager: true })

type Translations = Record<string, any>

// Helper to transform paths to nested objects
function buildLocaleTree(locale: string) {
  const tree: Translations = { components: {}, pages: {} }

  for (const path in modules) {
    if (!path.includes(`/${locale}/`)) continue

    // Example: '../en/pages/auth.json' -> ['pages', 'auth']
    const [, , type, nameWithExt] = path.split('/')
    const name = nameWithExt!.replace('.json', '')

    if (!tree[type!]) tree[type!] = {}
    tree[type!][name] = (modules[path] as any).default
  }

  return tree
}

export const english = buildLocaleTree('en')
export const french = buildLocaleTree('fr')
