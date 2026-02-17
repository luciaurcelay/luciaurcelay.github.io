import { motion } from 'framer-motion'
import ExternalLink from '../../components/ExternalLink'

export default function HeroSection() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-16 pt-0 md:pt-1 lg:pt-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left content */}
          <div className="lg:col-span-7 flex flex-col gap-8 lg:gap-0 lg:justify-between lg:min-h-[550px]">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl font-medium max-w-md"
            >
              ml research scientist working on protein design
            </motion.p>
            
            
            {/* Protein doodle - hidden on small screens */}
            {/*<motion.img
              src="/protein_doodle.png"
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block max-w-[0px] lg:max-w-[320px] ml-8 lg:ml-16"
            /> 
            */}

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
              style={{ fontFamily: "'Absans', sans-serif" }}
            >
              Lucia Urcelay
            </motion.h1>
          </div>

          {/* Right content */}
          <div className="lg:col-span-5 flex flex-col justify-end gap-6 lg:gap-8 pt-0 lg:pt-28">
            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-right leading-relaxed"
            >
              Researcher at the{' '}
              <ExternalLink href="https://www.aiproteindesign.com/" showArrow={false}>
                AI for Protein Design
              </ExternalLink>{' '}
              group (Ferruz lab), located in the{' '}
              <ExternalLink href="https://www.crg.eu/" showArrow={false}>
                Centre for Genomic Regulation
              </ExternalLink>
              , Barcelona. Our work explores the intersection of generative models and protein
              design
            </motion.p>

            {/* Profile image - hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="self-end hidden md:block"
            >
              <div className="w-56 h-72 md:w-56 md:h-72 lg:w-64 lg:h-80 rounded-sm overflow-hidden">
                <img
                  src="/landing_pfp.jpg"
                  alt="Lucia Urcelay Ganzabal"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
