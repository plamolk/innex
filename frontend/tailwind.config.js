/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update content paths based on your actual project structure.
  content: ["./**/*.{html,js}"], 
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind utility classes
        'bg-primary': 'var(--color-bg-primary)',
        'text-primary': 'var(--color-text-primary)',
        'btn-primary': 'var(--color-btn-primary)',
        'btn-text': 'var(--color-btn-text)',
      },
    },
  },
  plugins: [],
}
