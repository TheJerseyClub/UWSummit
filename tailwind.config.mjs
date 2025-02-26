/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
     keyframes: {
        fall: {
          '0%': { 
            transform: 'translateY(-20vh) rotate(0deg)',
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(120vh) rotate(360deg)',
            opacity: 0 
          }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'bounce-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' }
        },
        'slide-in-side': {
          '0%': {
            opacity: '0',
            transform: 'translateX(var(--tw-translate-x, 0))'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        'slide-in-right': {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: 0 
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: 1 
          }
        },
      },
      animation: {
        'fall': 'fall 3s linear forwards',
        marquee: 'marquee 240s linear infinite',
        marquee2: 'marquee2 240s linear infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'fade-in-down': 'fade-in-down 0.3s ease-out',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'bounce-horizontal': 'bounce-horizontal 1s ease-in-out infinite',
        'slide-in-side': 'slide-in-side 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards'
      },
    },
  },
  plugins: [],
};
