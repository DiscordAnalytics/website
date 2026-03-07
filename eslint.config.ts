import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,

  eslintPluginPrettierRecommended,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  ...vueI18n.configs.recommended,

  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@intlify/vue-i18n/no-raw-text': 'error',
      '@intlify/vue-i18n/no-missing-keys': 'off',
      '@intlify/vue-i18n/no-unused-keys': 'off',
      '@intlify/vue-i18n/key-format-style': 'off',
    },
    settings: {
      'vue-i18n': {
        localeDir: './src/locales/{en,fr}/**/*.json',
        messageSyntaxVersion: '^11.0.0',
      },
    },
  },
)
