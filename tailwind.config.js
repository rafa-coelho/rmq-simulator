/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rmq: {
          orange: '#FF6600',
          dark: '#1a1a2e',
          darker: '#16162a',
          light: '#2a2a4e',
          accent: '#4fc3f7',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 1s ease-in-out infinite',
        'message-flow': 'messageFlow 2s ease-in-out',
      },
      keyframes: {
        flow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        messageFlow: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
