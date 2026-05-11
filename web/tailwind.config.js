/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a5bbff',
          400: '#8098ff',
          500: '#5c6fff',
          600: '#3d4ef7',
          700: '#2f3be3',
          800: '#2832b8',
          900: '#262f91',
          950: '#181c5a',
        },
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
        },
        warn: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        dark: {
          900: '#0a0b14',
          800: '#0f1020',
          700: '#151728',
          600: '#1c1e32',
          500: '#252840',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glow: { from: { boxShadow: '0 0 20px rgba(92,111,255,0.3)' }, to: { boxShadow: '0 0 40px rgba(92,111,255,0.6)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(92,111,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(92,111,255,0.05) 1px, transparent 1px)",
        'hero-gradient': 'radial-gradient(ellipse at top, #1c1e32 0%, #0a0b14 60%)',
        'card-gradient': 'linear-gradient(135deg, rgba(28,30,50,0.8) 0%, rgba(21,23,40,0.9) 100%)',
      },
    },
  },
  plugins: [],
}
