import { useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBlogPost } from '../../data/blogPosts'
import { renderMarkdown, formatDate } from '../../utils/markdown'

const MolstarViewerComplex = lazy(() => import('../../components/MolstarViewerComplex'))

const MOLSTAR_PLACEHOLDER = '<div id="molstar-complex-placeholder"></div>'

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

  return (
    <div className="pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 md:px-12 lg:px-16 pt-4 md:pt-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="aspect-[2/1] w-full overflow-hidden rounded-sm">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full px-6 md:px-12 lg:px-16 mt-10 md:mt-14"
      >
        <article className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-primary/40 hover:text-primary/70 transition-colors duration-200 mb-8"
          >
            ← Back to blog
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-primary/50 mb-10 md:mb-14">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <div className="separator mb-10 md:mb-14" />

          {htmlContent.includes(MOLSTAR_PLACEHOLDER) ? (() => {
            const [before, after] = htmlContent.split(MOLSTAR_PLACEHOLDER)
            return (
              <>
                <div className="blog-content prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: before }} />
                <div className="w-full rounded-sm overflow-hidden bg-neutral-50 my-10" style={{ height: '520px' }}>
                  <Suspense fallback={<div className="h-full w-full animate-pulse bg-neutral-100" aria-hidden />}>
                    <MolstarViewerComplex />
                  </Suspense>
                </div>
                <div className="blog-content prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: after }} />
              </>
            )
          })() : (
            <div className="blog-content prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </article>
      </motion.div>
    </div>
  )
}
