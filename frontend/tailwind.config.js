/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#06080e',
          dark: '#0d111a',
          card: '#131826',
          border: '#1f293d',
          muted: '#64748b',
          glow: '#00ff9d',
        },
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          surface: '#f1f5f9',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b',
        },
        neon: {
          green: '#00ff9d',
          cyan: '#00e5ff',
          magenta: '#ff007f',
          yellow: '#fcee0a',
        },
      },
      boxShadow: {
        'neon-green': '0 0 15px rgba(0, 255, 157, 0.35)',
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.35)',
        'neon-pulse': '0 0 25px rgba(0, 255, 157, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'light-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 157, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
