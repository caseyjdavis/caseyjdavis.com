// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        slate: {
          dark: '#1e293b',
          border: '#334155',
          muted: '#94a3b8',
        },
        brand: {
          blue: '#2563eb',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
