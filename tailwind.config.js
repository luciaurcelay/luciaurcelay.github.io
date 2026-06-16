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
        serif: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#565656',
        },
        surface: {
          DEFAULT: '#FAF9F6',
          muted: '#f8f8f8',
        },
        accent: {
          DEFAULT: '#1a1a1a',
          hover: '#333333',
        }
      },
      fontSize: {
        '2xs': ['0.75rem', '1rem'],        // 12px
        'xs': ['0.6875rem', '1rem'],       // 11px
        'sm': ['0.8125rem', '1.2rem'],     // 13px
        'base': ['0.9375rem', '1.45rem'],  // 15px
        'lg': ['1rem', '1.6rem'],          // 16px
        'xl': ['1.125rem', '1.65rem'],     // 18px
        '2xl': ['1.375rem', '1.85rem'],    // 22px
        '3xl': ['1.6875rem', '2.05rem'],   // 27px
        '4xl': ['2rem', '2.3rem'],         // 32px
        '5xl': ['2.625rem', '1'],          // 42px
        '6xl': ['3.375rem', '1'],          // 54px
        '7xl': ['4rem', '1'],              // 64px
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
