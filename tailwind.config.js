const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E30019'
      },
      boxShadow: {
        '3xl': 'rgba(0, 0, 0, 0.5) 0px 2px 20px 0px'
      },
      animation: {
        'lds-facebook': 'lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite'
      },
      keyframes: {
        'lds-facebook': {
          '50%, 100%': { top: '24px', height: '32px' },
          '0%': { top: '8px', height: '64px' }
        }
      }
    }
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.container': {
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      });
    })
  ]
};
