/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        earth: {
          50:  '#faf7f2',
          100: '#f2ebe0',
          200: '#e3d5bc',
          300: '#cdb88f',
          400: '#b99566',
          500: '#a67c4e',
          600: '#8a6340',
          700: '#6f4e32',
          800: '#5a3f2a',
          900: '#4a3422',
        },
        forest: {
          50:  '#f1f8f1',
          100: '#dceedc',
          200: '#badcba',
          300: '#8dc38d',
          400: '#5ea45e',
          500: '#3d873d',
          600: '#2d6b2d',
          700: '#245524',
          800: '#1e441e',
          900: '#193819',
        },
        slate: {
          950: '#0a0f0a',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-right': 'slideRight 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideRight: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
