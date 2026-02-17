import { motion, Variants } from 'framer-motion'

interface SectionTitleProps {
  children: string
  as?: 'h1' | 'h2' | 'h3'
}

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function SectionTitle({ children, as = 'h2' }: SectionTitleProps) {
  const Tag = as

  return (
    <motion.div variants={titleVariants}>
      <Tag className="text-3xl md:text-4xl font-normal tracking-tight mb-8 md:mb-12">
        {children}
      </Tag>
    </motion.div>
  )
}
