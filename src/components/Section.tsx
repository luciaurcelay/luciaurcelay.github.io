import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  maxWidthClassName?: string
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

export default function Section({
  children,
  className = '',
  id,
  maxWidthClassName = 'max-w-6xl',
}: SectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={sectionVariants}
      className={`w-full px-6 md:px-12 lg:px-16 ${className}`}
    >
      <div className={`${maxWidthClassName} mx-auto`}>{children}</div>
    </motion.section>
  )
}
