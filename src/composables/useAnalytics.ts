import posthog from 'posthog-js'

export default function useAnalytics() {
  function capture(event: string, properties?: Record<string, unknown>) {
    posthog.capture(event, properties)
  }

  function identify(userId: string, properties?: Record<string, unknown>) {
    posthog.identify(userId, properties)
  }

  return { capture, identify }
}
