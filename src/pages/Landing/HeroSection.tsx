import { motion } from 'framer-motion'
import ExternalLink from '../../components/ExternalLink'

export default function HeroSection() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-16 pt-4 md:pt-8 lg:pt-10">
      <div className="max-w-5xl mx-auto flow-root">
        {/* Profile image — floated so the text wraps around it */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="float-left mr-5 sm:mr-8 mb-4 sm:mb-5"
        >
          <div className="w-40 h-52 sm:w-52 sm:h-64 lg:w-56 lg:h-72 rounded-sm overflow-hidden">
            <img
              src="/landing_pfp.jpg"
              alt="Lucia Urcelay Ganzabal"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-[1.05]"
        >
          Lucia Urcelay
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 text-base md:text-lg font-medium text-primary-light"
        >
          ml research scientist working on protein design
        </motion.p>

        {/* Combined bio + current work, wrapping around the photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 space-y-4 font-serif text-base md:text-lg leading-relaxed"
        >
          <p>
            Researcher at the{' '}
            <ExternalLink href="https://www.aiproteindesign.com/" showArrow={false}>
              AI for Protein Design
            </ExternalLink>{' '}
            group, led by{' '}
            <ExternalLink
              href="https://www.crg.eu/en/programmes-groups/ferruz-lab"
              showArrow={false}
            >
              Noelia Ferruz
            </ExternalLink>
            , at the{' '}
            <ExternalLink href="https://www.crg.eu/" showArrow={false}>
              Centre for Genomic Regulation
            </ExternalLink>
            , Barcelona. Our work explores the intersection of generative models and protein
            design.
          </p>
          <p>
             I'm primarily interested in {' '}
            <strong>structure-based generative models</strong>, flow matching and diffusion,
            alongside <strong>protein language models</strong>. I am also drawn 
            to their applications to <strong>drug discovery</strong>, with a focus on{' '}
            <strong>antibody and nanobody design</strong> for <strong>immunotherapy</strong> and{' '}
            <strong>oncology</strong>. Current work focuses on using <strong>evolutionary patterns</strong> in proteins
            and encoding them as design principles for{' '}
            <strong>de novo protein generation</strong>.
          </p>
          <p className="text-primary-light">
            I'm always open to new collaborations, feel free to{' '}
            <a
              href="#contact"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity duration-200"
            >
              get in touch
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  )
}
