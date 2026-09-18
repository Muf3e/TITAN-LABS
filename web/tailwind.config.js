/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        titan: {
          blue: '#0066FF',
          cyan: '#00C6FF',
          purple: '#7B2CBF',
          pink: '#FF2A85',
          orange: '#FFA03A',
          green: '#00C853',
          red: '#EF4444',
          obsidian: '#0B0F19',
          surface: '#131B2E',
          'surface-elevated': '#1E293B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        brand: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
