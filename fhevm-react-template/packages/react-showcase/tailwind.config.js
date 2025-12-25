/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Zama brand colors
        'zama-yellow': '#FFD208',
        'zama-black': '#000000',
        'zama-gray': {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#888888',
          300: '#666666',
          400: '#333333',
          500: '#2a2a2a',
          600: '#1a1a1a',
          700: '#000000',
        },
        'zama-green': '#4caf50',
        'zama-red': '#f44336',
        'zama-orange': '#ff9800',
        'zama-blue': '#007bff',
      },
      fontFamily: {
        'system': ['system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'zama': '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
