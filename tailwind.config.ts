import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Agro-Tech Dark Navy Hierarchy
        navy: {
          950: '#0A192F', // Deep background
          900: '#0D1F3C', // Midnight sections
          800: '#112240', // Surface cards
          700: '#1E293B', // Slate borders / muted
          600: '#1B4F7A', // Institutional navy
          DEFAULT: '#1B4F7A',
        },
        'navy-deep': '#0A192F',
        'navy-midnight': '#0D1F3C',
        'navy-surface': '#112240',

        // Agro Green (Action & Neon Tech Accents)
        'agro-green': {
          neon: '#4ADE80',
          electric: '#00E676',
          action: '#6AAF3D',
          dark: '#153C24',
          DEFAULT: '#6AAF3D',
        },
        'verde-tech': '#4ADE80',
        'verde-neon': '#00E676',
        'verde-folha': '#6AAF3D',
        'verde-escuro': '#153C24',

        // Gold & Accents
        gold: {
          DEFAULT: '#E8B84B',
          glow: 'rgba(232, 184, 75, 0.15)',
          light: '#F0CD7A',
          dark: '#C9982E',
        },
        dourado: '#E8B84B',
        'dourado-glow': 'rgba(232, 184, 75, 0.15)',

        // Neutrals & Editorial
        carvao: '#202522',
        'off-white': '#F7F5EF',
        'tech-slate': {
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },

        // shadcn/ui dynamic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#6AAF3D',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1B4F7A',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#E8B84B',
          foreground: '#202522',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        beweather: {
          primary: '#1F4D2B',
          secondary: '#1E73BE',
          accent: '#6BBF59',
          amarelo: '#F5C518',
          grafite: '#1A1F1C',
          offwhite: '#FAFAF7',
        },
      },
      fontFamily: {
        heading: ['var(--font-jakarta)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}
export default config
