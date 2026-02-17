import { motion } from 'framer-motion'
import ExternalLink from './ExternalLink'

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/lucia-urcelay-ganzabal-ba3262202/',
  },
  {
    label: 'Scholar',
    href: 'https://scholar.google.es/citations?user=v5R2EjgAAAAJ&hl=es',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/luciaurcelay',
  },
  {
    label: 'Twitter',
    href: 'https://x.com/luciaurcelayg',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Separator */}
        <div className="w-full h-px bg-primary/15 mb-10" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Copyright and coordinates */}
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-wide">
              © {currentYear} LUCIA URCELAY GANZABAL. All rights reserved.
            </p>
            <p className="text-base text-primary/60">
              N 41° 23.1390 E 2° 11.6308
            </p>
          </div>

          {/* Social links */}
          <nav aria-label="Social media links">
            <ul className="flex flex-col items-start md:items-end gap-2">
              {socialLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ExternalLink href={link.href} className="text-xl">
                    {link.label}
                  </ExternalLink>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </motion.footer>
  )
}
