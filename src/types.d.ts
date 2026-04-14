export interface AppConfig {
  apiBaseUrl: string
  posthogProjectToken: string
  posthogApiHost: string
}

declare global {
  interface Window {
    CONFIG: AppConfig
  }
}
