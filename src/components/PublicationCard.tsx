import type { ReactNode } from 'react'
import ExternalLink from './ExternalLink'
import { Publication } from '../data/publications'

interface PublicationCardProps {
  publication: Publication
}

// Highlight the author's own name within the authors list
const AUTHOR_NAME = /Lucia Urcelay(?:[\s-]Ganzabal)?/g

function highlightAuthor(authors: string) {
  const parts = authors.split(AUTHOR_NAME)
  const matches = authors.match(AUTHOR_NAME) ?? []

  return parts.flatMap((part, index) => {
    const nodes: ReactNode[] = [part]
    if (index < matches.length) {
      nodes.push(
        <strong key={index} className="font-semibold text-primary">
          {matches[index]}
        </strong>
      )
    }
    return nodes
  })
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article className="group">
      {/* Separator */}
      <div className="w-full h-px bg-primary/15 mb-4" />

      <div className="grid grid-cols-12 gap-4">
        {/* Year */}
        <div className="col-span-12 sm:col-span-2 lg:col-span-1">
          <time className="text-base text-primary/70">{publication.year}</time>
        </div>

        {/* Content */}
        <div className="col-span-12 sm:col-span-10 lg:col-span-11 space-y-0.5">
          <h3 className="text-lg font-medium leading-snug group-hover:opacity-80 transition-opacity">
            {publication.title}
          </h3>

          <p className="font-serif text-sm text-primary-light leading-relaxed">{highlightAuthor(publication.authors)}</p>

          <p className="font-serif text-sm text-primary-light italic">{publication.venue}</p>

          <div className="pt-1">
            <ExternalLink href={publication.paperUrl} className="text-sm">
              Paper
            </ExternalLink>
          </div>
        </div>
      </div>
    </article>
  )
}
