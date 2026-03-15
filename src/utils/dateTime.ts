import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'

export function timeAgo(dateString: string): string {
  const now = new Date()
  const past = new Date(dateString)

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  if (seconds < 60) {
    return `${seconds}s ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days}d ago`
  }

  const weeks = Math.floor(days / 7)
  if (weeks < 4) {
    return `${weeks}w ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`
  }

  const years = Math.floor(days / 365)
  return `${years}y ago`
}

export function dateToUTCDateTime(date: DateValue): string {
  const dateTime = date.toDate(getLocalTimeZone())
  dateTime.setHours(new Date().getHours())
  dateTime.setMinutes(new Date().getMinutes())
  dateTime.setSeconds(new Date().getSeconds())

  return dateTime.toISOString()
}

export function UTCDateToLocalDateTime(date: string): Date | undefined {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  const isoUtc = `${date}T${hh}:${mm}:${ss}Z`
  const d = new Date(isoUtc)
  if (isNaN(d.getTime())) {
    return undefined
  }
  return d
}

export const df = new DateFormatter(navigator.language, {
  dateStyle: 'medium',
})

export const dfWithHour = new DateFormatter(navigator.language, {
  hourCycle: 'h24',
  dateStyle: 'medium',
  timeStyle: 'medium',
})

export const dfWeekDay = new DateFormatter(navigator.language, {
  weekday: 'long',
})

export const oneMonthAgo = new Date(new Date().setDate(new Date().getDate() - 30))
export const oneMonthInSec = 60 * 60 * 24 * 30
