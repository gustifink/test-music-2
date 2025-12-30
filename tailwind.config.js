/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-black': '#000000',
        'spotify-dark': '#121212',
        'spotify-gray': '#1a1a1a',
        'spotify-elevated': '#282828',
        'spotify-highlight': '#2a2a2a',
        'spotify-green': '#1db954',
        'spotify-green-light': '#1ed760',
        'spotify-text': '#ffffff',
        'spotify-text-secondary': '#b3b3b3',
        'spotify-text-subdued': '#6a6a6a',
      },
      fontFamily: {
        'spotify': ['Circular Std', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
