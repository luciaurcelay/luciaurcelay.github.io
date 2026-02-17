import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { label: 'publications', href: '/publications' },
  { label: 'about', href: '/about' },
]

export default function Header() {
  const location = useLocation()

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full py-6 md:py-8 px-6 md:px-12 lg:px-16"
    >
      <nav
        className="max-w-6xl mx-auto flex items-center justify-between"
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
          aria-label="Home"
        >
          <img
            src="/star.ico"
            alt=""
            className="w-12 h-12"
            aria-hidden="true"
          />
        </Link>

        <ul className="flex items-center gap-6 md:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`text-lg transition-opacity duration-200 ${
                  location.pathname === link.href
                    ? 'opacity-100'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  )
}
