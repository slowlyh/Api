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
        primary: {
          DEFAULT: '#00d4ff',
          dark: '#0099cc',
        },
        secondary: {
          DEFAULT: '#ff0080',
        },
        dark: {
          bg: '#0a0e27',
          card: '#151b3d',
          hover: '#1a2142',
          border: '#2a3154',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
