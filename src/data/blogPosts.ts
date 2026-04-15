import peptidesContent from '../content/blog/peptides.md?raw'
import nipahContent from '../content/blog/nipah.md?raw'
import flowMatchingContent from '../content/blog/flow-matching.md?raw'
import {
  generateExcerpt,
  calculateReadingTime,
  extractTitle,
  extractDate,
} from '../utils/markdown'

export interface BlogPost {
  slug: string
  title: string
  date: string
  coverImage: string
  content: string
  excerpt: string
  readingTime: number
}

function createBlogPost(
  slug: string,
  rawContent: string,
  coverImage: string,
  overrides?: Partial<BlogPost>
): BlogPost {
  return {
    slug,
    title: extractTitle(rawContent),
    date: extractDate(rawContent),
    coverImage,
    content: rawContent,
    excerpt: generateExcerpt(rawContent),
    readingTime: calculateReadingTime(rawContent),
    ...overrides,
  }
}

export const blogPosts: BlogPost[] = [
  createBlogPost('flow-matching', flowMatchingContent, '/flow-matching.png'),
  createBlogPost('nipah', nipahContent, '/nipah-image.png'),
  createBlogPost('peptides', peptidesContent, '/peptides.jpeg'),
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}
