/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:            '#111111',
        surface:       '#181818',
        surface2:      '#1a1a1a',
        border:        '#2a2a2a',
        border2:       '#333333',
        accent:        '#e8173a',
        gold:          '#f0c040',
        'user-blue':   '#5b8dee',
        'user-purple': '#b57bee',
        'user-gold':   '#f0c040',
        muted:         '#888888',
        dim:           '#555555',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
