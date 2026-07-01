import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9fc',
          100: '#e0f2fe',
          200: '#b5e5fc',
          300: '#7dd3f8',
          400: '#38bdf8',
          500: '#2dd4bf',
          600: '#22b8a8',
          700: '#0f3a5c',
          800: '#051a2a',
          900: '#020a0f',
        },
        aurora: {
          50: '#f0f9fc',
          100: '#e0f2fe',
          200: '#2dd4bf',
          300: '#22b8a8',
          400: '#0f3a5c',
          500: '#051a2a',
          600: '#051a2a',
          700: '#051a2a',
          800: '#020a0f',
          900: '#020a0f',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          500: '#059669',
          600: '#047857',
        },
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #051a2a 0%, #0f3a5c 50%, #2dd4bf 100%)',
        'gradient-aurora-subtle': 'linear-gradient(135deg, #f0f9fc 0%, #e0f2fe 100%)',
      },
      boxShadow: {
        aurora: '0 20px 50px rgba(45, 212, 191, 0.15)',
        'aurora-lg': '0 30px 70px rgba(45, 212, 191, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
