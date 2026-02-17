import { motion } from 'framer-motion'
import ExternalLink from '../../components/ExternalLink'

export default function About() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-16 md:pb-24">
      {/* Intro section */}
      <section className="w-full px-6 md:px-12 lg:px-16 pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Profile image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="aspect-[1.4/1] w-full rounded-sm overflow-hidden">
                <img
                  src="/about_pfp.jpg"
                  alt="Lucia Urcelay Ganzabal"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Intro content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 space-y-8"
            >
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-center lg:text-left">
                Lucia
              </h1>

              <p className="text-lg md:text-xl leading-relaxed">
                I&apos;m a <strong>Machine Learning Scientist</strong> working at the Centre for Genomic 
                Regulation. I hold a bachelor&apos;s degree in Biomedical Engineering as well as a master&apos;s degree
                in Artificial Intelligence. When I&apos;m not working you can find me doing yoga and painting!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience section */}
      <section className="w-full px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* What I do now */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <h2 className="text-2xl font-medium">What I do now</h2>

              <div className="text-lg md:text-xl leading-relaxed space-y-5">
                <p>
                  Current research focuses on uncovering evolutionary patterns in proteins and
                  using them as design principles for <strong>de novo protein generation</strong>. At Ferruz Lab
                  we are
                  developing and training a range of generative models to explore and create novel
                  protein sequences and structures.
                </p>
              </div>

              {/* Team photo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="pt-4"
              >
                <div className="w-full rounded-sm overflow-hidden">
                  <img
                    src="/team.jpeg"
                    alt="Ferruz Lab team at CRG"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </motion.article>

            {/* What I used to do */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5"
            >
              <h2 className="text-2xl font-medium">What I used to do</h2>

              <div className="text-lg md:text-xl leading-relaxed space-y-5">
                <p>
                  Prior to joining CRG, I was a postgraduate intern in <strong>Novartis Institute of
                  Biomedical Research</strong> (Basel, Switzerland). My work was focused on
                  <strong> scRNAseq foundation models</strong> to identify and prioritize novel therapeutic targets
                  in <strong>oncology</strong>, contributing to drug discovery. I performed in silico perturbation of single-cell expression
                  profiles, simulating therapeutic effects. I also fine-tuned and evaluated
                  these models to enhance their performance for specific oncology data.
                </p>

                <p>
                  Before joining Novartis, I spent two years working at<strong>{' '}
                  <ExternalLink href="https://www.bsc.es/" showArrow={false}>
                    Barcelona Supercomputing Center
                  </ExternalLink></strong>,
                  Spain&apos;s national center of supercomputing. During my time there, I was
                  part of the{' '}
                  <ExternalLink href="https://hpai.bsc.es/" showArrow={false}>
                    High Performance Artificial Intelligence
                  </ExternalLink>{' '}
                  group, where I conducted<strong> Deep Learning</strong> research for <strong>medical computer vision </strong>
                  projects, specializing in embryology and vascular diseases using CT scans and
                  microscopy imaging. I also contributed to the development and evaluation of
                  medical <strong>Large Language Models</strong> and ensured the design of trustworthy AI systems
                  by addressing biases, with a focus on healthcare applications.
                </p>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </div>
  )
}
