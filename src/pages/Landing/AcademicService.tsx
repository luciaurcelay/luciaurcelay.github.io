import { motion } from 'framer-motion'
import Section from '../../components/Section'
import SectionTitle from '../../components/SectionTitle'
import { reviewItems, supervisionItems } from '../../data/academicService'

interface ServiceEntryProps {
  primary: string
  secondary: string
  year: string
  index: number
}

function ServiceEntry({ primary, secondary, year, index }: ServiceEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="w-full h-px bg-primary/15 mb-3" />

      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-9 space-y-0.5">
          <h4 className="text-base font-medium leading-snug">{primary}</h4>
          <p className="font-serif text-sm text-primary-light leading-relaxed">{secondary}</p>
        </div>
        <div className="col-span-3 text-right">
          <time className="text-sm text-primary/60">{year}</time>
        </div>
      </div>
    </motion.div>
  )
}

export default function AcademicService() {
  return (
    <Section maxWidthClassName="max-w-5xl">
      <SectionTitle>Academic service</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-primary/60 mb-5">Peer review</h3>

          <div className="space-y-5">
            {reviewItems.map((item, index) => (
              <ServiceEntry
                key={`${item.venue}-${item.year}`}
                primary={item.venue}
                secondary={item.role}
                year={item.year}
                index={index}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-primary/60 mb-5">
            MSc thesis supervision
          </h3>

          <div className="space-y-5">
            {supervisionItems.map((item, index) => (
              <ServiceEntry
                key={`${item.student}-${item.year}`}
                primary={item.student}
                secondary={`${item.degree}, ${item.institution}`}
                year={item.year}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
