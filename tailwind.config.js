/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
    content: [
      './app.vue',
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
    ],
    
      theme: {
        extend: {
          backgroundImage: {
            'military-canvas': "url('/textures/canvas.jpg')", // ты можешь положить текстуру в public/textures/
            'military-map': "url('/textures/war-map.jpg')"
          },
          fontFamily: {
            military: ['Oswald', 'Arial Narrow', 'sans-serif'],
          },
          colors: {
            military: {
              DEFAULT: '#b78b50',
              dark: '#8c6b3c',
            }
          }
        }
      },
  
    plugins: [],
  }
  