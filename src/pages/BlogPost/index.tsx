import { useEffect, lazy, Suspense, ComponentType, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBlogPost } from '../../data/blogPosts'
import { renderMarkdown, formatDate } from '../../utils/markdown'

const MolstarViewerComplex = lazy(() => import('../../components/MolstarViewerComplex'))
const DistributionMorph = lazy(() => import('../../components/flow-matching/DistributionMorph'))
const VelocityField = lazy(() => import('../../components/flow-matching/VelocityField'))
const ConditionalPaths = lazy(() => import('../../components/flow-matching/ConditionalPaths'))
const MarginalAveraging = lazy(() => import('../../components/flow-matching/MarginalAveraging'))
const InferenceTrace = lazy(() => import('../../components/flow-matching/InferenceTrace'))
const ReflowDemo = lazy(() => import('../../components/flow-matching/ReflowDemo'))

type Slot = {
  Component: ComponentType
  wrapperClass: string
  wrapperStyle?: React.CSSProperties
}

const SLOTS: Record<string, Slot> = {
  'molstar-complex-placeholder': {
    Component: MolstarViewerComplex,
    wrapperClass: 'w-full rounded-sm overflow-hidden bg-surface my-10',
    wrapperStyle: { height: '520px' },
  },
  'fm-distribution-morph': {
    Component: DistributionMorph,
    wrapperClass: 'my-10',
  },
  'fm-velocity-field': {
    Component: VelocityField,
    wrapperClass: 'my-10',
  },
  'fm-conditional-paths': {
    Component: ConditionalPaths,
    wrapperClass: 'my-10',
  },
  'fm-marginal-averaging': {
    Component: MarginalAveraging,
    wrapperClass: 'my-10',
  },
  'fm-inference-trace': {
    Component: InferenceTrace,
    wrapperClass: 'my-10',
  },
  'fm-reflow-demo': {
    Component: ReflowDemo,
    wrapperClass: 'my-10',
  },
}

const PLACEHOLDER_RE = /<div id="([^"]+)"[^>]*><\/div>/g

type Part =
  | { kind: 'html'; value: string }
  | { kind: 'slot'; slotId: string }

function splitContent(html: string): Part[] {
  const parts: Part[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  PLACEHOLDER_RE.lastIndex = 0
  while ((match = PLACEHOLDER_RE.exec(html)) !== null) {
    const id = match[1]
    if (!(id in SLOTS)) continue
    if (match.index > lastIndex) {
      parts.push({ kind: 'html', value: html.slice(lastIndex, match.index) })
    }
    parts.push({ kind: 'slot', slotId: id })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < html.length) {
    parts.push({ kind: 'html', value: html.slice(lastIndex) })
  }
  return parts
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getBlogPost(slug) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <p className="text-xl text-primary/50 mb-6">Post not found</p>
        <Link to="/blog" className="link-underline text-lg">
          Back to blog
        </Link>
      </div>
    )
  }

  const htmlContent = renderMarkdown(post.content)
  const parts = splitContent(htmlContent)

  return (
    <div className="pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 md:px-12 lg:px-16 pt-4 md:pt-8"
      >
        <article className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-primary/40 hover:text-primary/70 transition-colors duration-200 mb-8"
          >
            ← Back to blog
          </Link>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-primary/50 mb-10 md:mb-14">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <div className="separator mb-10 md:mb-14" />

          {parts.map((part, i) => {
            if (part.kind === 'html') {
              return (
                <div
                  key={i}
                  className="blog-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: part.value }}
                />
              )
            }
            const slot = SLOTS[part.slotId]
            const { Component } = slot
            return (
              <Fragment key={i}>
                <div className={slot.wrapperClass} style={slot.wrapperStyle}>
                  <Suspense
                    fallback={
                      <div
                        className="h-full w-full animate-pulse bg-neutral-100 rounded-sm"
                        style={{ minHeight: 320 }}
                        aria-hidden
                      />
                    }
                  >
                    <Component />
                  </Suspense>
                </div>
              </Fragment>
            )
          })}
        </article>
      </motion.div>
    </div>
  )
}
