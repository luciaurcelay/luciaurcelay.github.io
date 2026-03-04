import { marked } from 'marked'

export function extractDate(markdown: string): string {
  const firstLine = markdown.split('\n')[0]?.trim() || ''
  const dateMatch = firstLine.match(/^date:\s*(.+)$/)
  if (dateMatch) {
    const parts = dateMatch[1].trim().split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
  return new Date().toISOString().split('T')[0]
}

export function extractTitle(markdown: string): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : 'Untitled'
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function generateExcerpt(markdown: string, maxLength = 200): string {
  const lines = markdown.split('\n')
  let paragraphText = ''
  let pastFirstHeading = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('date:')) continue
    if (trimmed.startsWith('#')) {
      pastFirstHeading = true
      continue
    }
    if (pastFirstHeading && trimmed.length > 50) {
      paragraphText = trimmed
      break
    }
  }

  const plainText = paragraphText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\(https?:\/\/[^)]+\)/g, '')
    .trim()

  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

function preprocessMarkdown(content: string): string {
  let lines = content.split('\n')

  if (lines[0]?.trim().startsWith('date:')) {
    lines = lines.slice(1)
  }

  const titleIndex = lines.findIndex(line => line.trim().startsWith('# '))
  if (titleIndex !== -1) {
    lines.splice(titleIndex, 1)
  }

  let processed = lines.join('\n')

  // Normalize tab-indented bullets to standard markdown
  processed = processed.replace(/\t•\t/g, '- ')

  // Normalize tab-indented numbers to standard markdown
  processed = processed.replace(/\t(\d+)\.\t/g, '$1. ')

  // Auto-link bare URLs in parentheses that aren't already part of markdown links
  processed = processed.replace(/(?<!\])\((https?:\/\/[^\s)]+)\)/g, (_, url: string) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '')
      return ` ([${hostname}](${url}))`
    } catch {
      return ` ([link](${url}))`
    }
  })

  return processed
}

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    heading({ text, depth }: { text: string; depth: number }) {
      const slug = text
        .replace(/<[^>]*>/g, '')
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/(^-|-$)/g, '')
      return `<h${depth} id="${slug}">${text}</h${depth}>\n`
    },
  },
})

export function renderMarkdown(content: string): string {
  const processed = preprocessMarkdown(content)
  return marked.parse(processed) as string
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
