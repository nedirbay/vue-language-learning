import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { marked } from 'marked'

dayjs.extend(relativeTime)

export function formatPrice(cents: number, currency = 'USD'): string {
  if (cents === 0) return 'Free'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100)
  } catch {
    return `$${(cents / 100).toFixed(2)}`
  }
}

export function formatNumber(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`
  return `${(n / 1_000_000).toFixed(1)}M`
}

export function formatDate(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY')
}

export function formatRelative(iso: string): string {
  return dayjs(iso).fromNow()
}

export function renderMarkdown(md: string): string {
  return marked.parse(md, { gfm: true, breaks: true }) as string
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return `${formatNumber(n)} ${n === 1 ? singular : plural ?? singular + 's'}`
}
