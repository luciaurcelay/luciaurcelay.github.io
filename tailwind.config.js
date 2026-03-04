import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#565656',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8f8f8',
        },
        accent: {
          DEFAULT: '#1a1a1a',
          hover: '#333333',
        }
      },
      fontSize: {
        '2xs': '0.8125rem', // 13px
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#333333',
            '--tw-prose-headings': '#000000',
            '--tw-prose-links': '#000000',
            '--tw-prose-bold': '#000000',
            '--tw-prose-counters': '#666666',
            '--tw-prose-bullets': '#666666',
            '--tw-prose-quotes': '#333333',
            '--tw-prose-quote-borders': '#e5e5e5',
            '--tw-prose-hr': '#e5e5e5',
            h2: {
              fontWeight: '500',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontWeight: '500',
            },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              fontWeight: 'inherit',
              '&:hover': {
                opacity: '0.7',
              },
            },
            p: {
              lineHeight: '1.5',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}
