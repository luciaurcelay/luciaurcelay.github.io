import { ReactNode } from 'react'

type Props = {
  caption?: string
  controls?: ReactNode
  children: ReactNode
}

export default function Frame({ caption, controls, children }: Props) {
  return (
    <figure className="w-full rounded-sm border border-primary/10 bg-surface-muted/40 p-4 md:p-5">
      <div className="w-full">{children}</div>
      {controls}
      {caption && (
        <figcaption className="mt-3 text-xs text-primary/55 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
