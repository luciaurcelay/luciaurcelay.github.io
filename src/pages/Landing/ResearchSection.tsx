import { motion } from 'framer-motion'
import MolstarViewer from '../../components/MolstarViewer'

export default function ResearchSection() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Protein visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="aspect-[4/3] w-full rounded-sm overflow-hidden bg-neutral-50">
              <MolstarViewer />
            </div>
          </motion.div>

          {/* Research description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 lg:pt-28"
          >
            <p className="text-lg md:text-xl leading-relaxed">
              Current work focuses on uncovering <strong>evolutionary patterns</strong> in proteins and using them
              as design principles for <strong>de novo protein generation</strong>.  I am particularly 
              interested in  <strong>diffusion</strong> and <strong>flow-based</strong> models, as well 
              as their applications in <strong>drug discovery</strong>, 
              especially in <strong>immunotherapy</strong> and <strong>oncology</strong>.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
