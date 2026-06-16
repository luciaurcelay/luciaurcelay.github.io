import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../../data/blogPosts'
import { formatDate } from '../../utils/markdown'

export default function Blog() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-16 md:pb-24">
      <section className="w-full px-6 md:px-12 lg:px-16 pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-2xl md:text-3xl font-normal tracking-tight mb-12 md:mb-16"
          >
            Blog
          </motion.h1>

          <div className="flex flex-col gap-0 max-w-2xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <Link to={`/blog/${post.slug}`} className="group block py-4 border-b border-primary/10 first:border-t">
                  <article className="flex gap-5 items-start">
                    <div className="flex-1 space-y-1 min-w-0">
                      <h2 className="text-lg font-medium tracking-tight group-hover:opacity-70 transition-opacity duration-200 leading-snug">
                        {post.title}
                      </h2>

                      <p className="font-serif text-sm text-primary-light leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-primary/50 pt-1">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
