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
          50: '#f4f7fb',
          100: '#e8eef7',
          200: '#d4e0f0',
          300: '#b5c9e4',
          400: '#8caad2',
          500: '#5f86b9',
          600: '#456e9f',
          700: '#375882',
          800: '#314a6b',
          900: '#2d405a',
        },
        coral: {
          50: '#fbf7f2',
          100: '#f7eee3',
          200: '#f0dcc8',
          300: '#e7c5a2',
          400: '#dbab7b',
          500: '#cc9062',
          600: '#b8764f',
          700: '#975f42',
          800: '#7a4d38',
          900: '#65412f',
        },
        teal: {
          50: '#f1f6f6',
          100: '#dcecec',
          200: '#bdd8d8',
          300: '#97bebe',
          400: '#6c9f9f',
          500: '#528585',
          600: '#3f6b6c',
          700: '#355657',
          800: '#30484a',
          900: '#2c3f40',
        },
        lavender: '#eef2f8',
        peach: '#f8f2ea',
        mint: '#e8f0ef',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'confetti': 'confetti 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}