/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        paper: '#FBFAF7',
        ink: '#2A2724',
        muted: '#6B655D',
        faint: '#A8A096',
        label: '#8A8278',
        accent: '#9C8B73',
        'accent-light': '#C9B79C',
        border: '#EBE6DC',
        'border-input': '#D9D3C7',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}

