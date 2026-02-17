import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Section from '../../components/Section'
import SectionTitle from '../../components/SectionTitle'
import PublicationCard from '../../components/PublicationCard'
import { publications } from '../../data/publications'

export default function PublicationsPreview() {
  // Show only the first 2 publications on landing
  const previewPublications = publications.slice(0, 2)

  return (
    <Section>
      <SectionTitle>Selected publications</SectionTitle>

      <div className="space-y-8">
        {previewPublications.map((publication, index) => (
          <motion.div
            key={publication.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PublicationCard publication={publication} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-10"
      >
        <Link
          to="/publications"
          className="inline-flex items-center gap-2 text-lg hover:opacity-70 transition-opacity duration-200"
        >
          View all publications
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </Section>
  )
}
