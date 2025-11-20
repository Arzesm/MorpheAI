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
        'night-deep-blue': '#0A1120',
        'night-lighter': '#131B2E',
        'night-card': '#1A2332',
        'mythic-ivory': '#F2EDE3',
        'morphe-blue': '#1E90FF',
        'light-ai-blue': '#9CD1F5',
        'amethyst-spirit': '#6A5ACD',
        'amethyst-light': '#8B7DD8',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(30, 144, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(106, 90, 205, 0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}

