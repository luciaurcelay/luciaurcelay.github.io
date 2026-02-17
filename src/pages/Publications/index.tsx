import { motion } from 'framer-motion'
import Section from '../../components/Section'
import SectionTitle from '../../components/SectionTitle'
import PublicationCard from '../../components/PublicationCard'
import { publications } from '../../data/publications'

export default function Publications() {
  return (
    <div className="pb-16 md:pb-24">
      <Section className="pt-8 md:pt-12">
        <SectionTitle>Publications</SectionTitle>

        <div className="space-y-10">
          {publications.map((publication, index) => (
            <motion.div
              key={publication.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PublicationCard publication={publication} />
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  )
}
