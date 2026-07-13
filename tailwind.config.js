/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        sans: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      colors: {
        grape: '#8b5cf6',
        bubblegum: '#ec4899',
        tangerine: '#fb923c',
        sun: '#fbbf24',
        grass: '#34d399',
        sky2: '#38bdf8',
        cherry: '#f87171',
      },
      boxShadow: {
        // Chunky "toy" bottom shadow so buttons/cards feel pressable & 3D.
        toy: '0 5px 0 rgba(15, 23, 42, 0.14)',
        'toy-lg': '0 8px 0 rgba(15, 23, 42, 0.14)',
        card: '0 14px 34px rgba(91, 33, 182, 0.18)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        tada: {
          '0%': { transform: 'scale(1) rotate(0)' },
          '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale(1.15) rotate(3deg)' },
          '40%, 60%, 80%': { transform: 'scale(1.15) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
      },
      animation: {
        pop: 'pop 0.25s ease-out',
        bounceIn: 'bounceIn 0.5s ease-out',
        wiggle: 'wiggle 0.4s ease-in-out',
        float: 'float 3.5s ease-in-out infinite',
        tada: 'tada 0.9s ease-in-out',
      },
    },
  },
  plugins: [],
};
