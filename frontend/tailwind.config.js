/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#09090b',
        ember: '#ef4444',
        blood: '#b91c1c',
        fog: '#27272a'
      },
      boxShadow: {
        ember: '0 0 0 1px rgba(239, 68, 68, 0.35), 0 6px 20px rgba(0, 0, 0, 0.5)'
      }
    }
  },
  plugins: []
};
