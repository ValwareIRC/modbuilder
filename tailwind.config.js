/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pastel colors for our nodes
        'node-lavender': '#8B7CF8',
        'node-pink': '#F8A1C4',
        'node-mint': '#A8E6CF',
        'node-blue': '#A1C4F8',
        'node-yellow': '#F8E6A1',
        'node-coral': '#F8C4A1',
        'node-purple': '#E6A8F8',
        'node-cyan': '#A1F8E6',
        // Dark theme colors
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2d2d2d',
        'dark-surface-secondary': '#3d3d3d',
        'dark-border': '#555',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#ccc',
        'dark-text-muted': '#aaa',
      },
      backgroundImage: {
        'gradient-node': 'linear-gradient(135deg, #404040 0%, #353535 100%)',
      },
      boxShadow: {
        'node': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'button': '0 2px 4px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        'node': '12px',
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}