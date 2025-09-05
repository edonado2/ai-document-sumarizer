import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Set default API URL for production builds
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://ai-document-summarizer-backend.onrender.com/api')
  }
})
