import { motion } from 'framer-motion'
import Section from '../../components/Section'
import SectionTitle from '../../components/SectionTitle'
import { newsItems } from '../../data/news'

export default function LatestNews() {
  return (
    <Section>
      <SectionTitle>Latest</SectionTitle>

      <div className="space-y-4">
        {newsItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="grid grid-cols-12 gap-4 items-start"
          >
            <div className="col-span-12 sm:col-span-9 lg:col-span-10">
              <p className="text-sm font-medium leading-relaxed">{item.text}</p>
            </div>
            <div className="col-span-12 sm:col-span-3 lg:col-span-2 text-right">
              <time className="text-sm text-primary/60">{item.date}</time>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
