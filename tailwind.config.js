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
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        curtain: {
          navy: '#0A192F',      
          gold: '#C5A059',      
          cream: '#F9F7F2',     
          black: '#121212',     
        }
      },
      animation: {
        'curtain-open': 'curtainOpen 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'logo-reveal': 'logoReveal 1s ease-out 1.5s both',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        curtainOpen: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        wiggle: {
         '0%, 100%': { transform: 'skewY(0deg)' },
         '50%': { transform: 'skewY(5deg)' },
        },

        logoReveal: {
          '0%': { opacity: 0, transform: 'scale(0.5) rotate(-180deg)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
