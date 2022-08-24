// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-10': 'rgba(255, 255, 255, 0.1)',
        'primary-20': 'rgba(255, 255, 255, 0.2)',
        'primary-30': 'rgba(255, 255, 255, 0.3)',
        'primary-40': 'rgba(255, 255, 255, 0.4)',
        'primary-50': 'rgba(255, 255, 255, 0.5)',
        'primary-60': 'rgba(255, 255, 255, 0.6)',
        'primary-70': 'rgba(255, 255, 255, 0.7)',
        'primary-80': 'rgba(255, 255, 255, 0.8)',
        'primary-90': 'rgba(255, 255, 255, 0.9)',
        'primary-100': '#05293C',
        orangeN: '#F59E0B',
        orangeM: '#F78166',
        greenM: '#11DBC5',
        greenL: '#22C55E',
        blueN: '#3B82F6',
      },
      animation: {
        fadeIn: 'show 0.5s ease',
      },
      keyframes: {
        show: {
          'from': {
            right: '300px',
            opacity: 0
          },
          'to': {
            right: "50%",
            opacity: 1
          }
        }
      },
    },
  },
  plugins: [],
};