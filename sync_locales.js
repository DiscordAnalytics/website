#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

const LOCALES_DIR = path.resolve('./src/locales')
const SOURCE_LANG = 'en'
const CHECK_MODE = process.argv.includes('--check')

console.log(`Detected Source Language: ${SOURCE_LANG}`)
if (CHECK_MODE) console.log('Running in CHECK mode (no files will be modified)')

let missingTotal = 0

async function getJsonFiles(dir) {
  const results = []

  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true })

    for (const entry of entries) {
      const full = path.join(current, entry.name)

      if (entry.isDirectory()) {
        await walk(full)
      } else if (entry.name.endsWith('.json')) {
        results.push(full)
      }
    }
  }

  await walk(dir)
  return results
}

function getScalarPaths(obj, prefix = []) {
  let paths = []

  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const key of Object.keys(obj)) {
      paths = paths.concat(getScalarPaths(obj[key], [...prefix, key]))
    }
  } else {
    paths.push(prefix)
  }

  return paths
}

function getPath(obj, pathArr) {
  let current = obj

  for (const p of pathArr) {
    if (current == null || !(p in current)) {
      return undefined
    }
    current = current[p]
  }

  return current
}

function deepMerge(source, target) {
  if (typeof source !== 'object' || source === null) {
    return target ?? source
  }

  const result = { ...target }

  for (const key of Object.keys(source)) {
    if (!(key in result)) {
      result[key] = source[key]
    } else {
      result[key] = deepMerge(source[key], result[key])
    }
  }

  return result
}

async function processLanguage(lang, sourceFiles) {
  if (lang === SOURCE_LANG) return

  console.log('---------------------------------------------------')
  console.log(`Checking: ${lang}`)
  console.log('---------------------------------------------------')

  for (const src of sourceFiles) {
    const relative = path.relative(path.join(LOCALES_DIR, SOURCE_LANG), src.path)

    const targetFile = path.join(LOCALES_DIR, lang, relative)
    const fileName = path.basename(src.path)

    await fs.mkdir(path.dirname(targetFile), { recursive: true })

    try {
      const targetRaw = await fs.readFile(targetFile, 'utf8')
      const tgt = JSON.parse(targetRaw)

      const missing = []

      for (const p of src.paths) {
        if (getPath(tgt, p) === undefined) {
          missing.push(p.join('.'))
        }
      }

      if (missing.length > 0) {
        missingTotal += missing.length

        console.log(`  [UPDATE] ${fileName}`)

        for (const m of missing) {
          console.log(`     + ${m}`)
        }

        if (!CHECK_MODE) {
          const merged = deepMerge(src.json, tgt)

          await fs.writeFile(targetFile, JSON.stringify(merged, null, 2) + '\n')
        }
      }
    } catch {
      console.log(`  [NEW]    ${fileName}`)

      missingTotal += src.paths.length

      if (!CHECK_MODE) {
        console.log('         (Copying entire file)')
        await fs.copyFile(src.path, targetFile)
      }
    }
  }
}

async function main() {
  const sourceDir = path.join(LOCALES_DIR, SOURCE_LANG)

  const sourceFilesPaths = await getJsonFiles(sourceDir)

  // Preload source files
  const sourceFiles = await Promise.all(
    sourceFilesPaths.map(async (file) => {
      const json = JSON.parse(await fs.readFile(file, 'utf8'))

      return {
        path: file,
        json,
        paths: getScalarPaths(json),
      }
    }),
  )

  const locales = await fs.readdir(LOCALES_DIR, { withFileTypes: true })

  const languages = locales.filter((e) => e.isDirectory()).map((e) => e.name)

  for (const lang of languages) {
    await processLanguage(lang, sourceFiles)
  }

  console.log('---------------------------------------------------')
  if (CHECK_MODE) {
    if (missingTotal > 0) {
      console.log(`❌ Missing locale keys detected: ${missingTotal}`)
      process.exit(1)
    } else {
      console.log('✅ All locale files are up to date.')
    }
  } else {
    console.log('Locale sync complete.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
