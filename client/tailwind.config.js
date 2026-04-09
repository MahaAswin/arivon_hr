/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FB923C',
        },
        background: '#0F172A',
        card: '#1E293B',
        secondary: '#94A3B8',
        info: '#38BDF8',
        success: '#22C55E',
        warning: '#FACC15',
        error: '#EF4444',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
      },
    },
  },
  plugins: [],
}
