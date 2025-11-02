/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './projects.html',
    './publications.html',
    './talks.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#2563eb', dark: '#1e40af' } },
      borderRadius: { '2xl': '1rem' }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
  safelist: [
    'prose','prose-invert','dark',
    'bg-blue-600','hover:bg-blue-700','text-white',
    'bg-amber-500','bg-green-600','bg-fuchsia-600'
  ]
};
