export interface AppConfig {
  apiBaseUrl: string
}

declare global {
  interface Window {
    CONFIG: AppConfig
  }
}
