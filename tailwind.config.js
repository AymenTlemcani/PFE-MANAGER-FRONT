/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-pattern': '24px 24px',
        'gradient-size': '400% 400%',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite', // Slowed down animation
      }
    },
  },
  plugins: [],
};
