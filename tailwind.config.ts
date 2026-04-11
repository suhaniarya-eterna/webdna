
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Space Grotesk', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: '#0F0B0A',
        foreground: '#FDFCFB',
        primary: {
          DEFAULT: '#BFA181',
          foreground: '#0F0B0A',
        },
        secondary: {
          DEFAULT: '#332B28',
          foreground: '#FDFCFB',
        },
        muted: {
          DEFAULT: 'rgba(191, 161, 129, 0.08)',
          foreground: 'rgba(255, 255, 255, 0.5)',
        },
        accent: {
          DEFAULT: '#BFA181',
          foreground: '#0F0B0A',
        },
        card: {
          DEFAULT: 'rgba(15, 11, 10, 0.95)',
          foreground: '#FDFCFB',
        },
        border: 'rgba(191, 161, 129, 0.12)',
      },
      keyframes: {
        'dna-twist': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'dna-twist-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px currentColor)' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px currentColor)' },
        },
        'flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'dna-twist': 'dna-twist 10s linear infinite',
        'dna-twist-slow': 'dna-twist-slow 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
