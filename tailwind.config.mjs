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
        }
      },
      animation: {
        'fall': 'fall 3s linear forwards'
      }
    },
  },
  plugins: [],
};
