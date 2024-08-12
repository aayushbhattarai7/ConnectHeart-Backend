/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        medium: 500,
      },
      maxWidth: {
        'custom': '35rem', 
      },
      width: {
        'googlew':'21.5rem',
        'custom': '30rem', 
        'maxx':'80rem',
        'lgx':'50rem',
        'cmts':'40rem',
        'img':'42',
        'imgw':'45rem',
        'max2':'85rem'
      }, 
      height: {
        'postborder':'34.5rem'
      }
    },
  },
  plugins: [],
}

