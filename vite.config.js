import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'google-site-verification',
        transformIndexHtml(html) {
          const token = env.VITE_GOOGLE_SITE_VERIFICATION?.trim()
          const verificationTag = token
            ? `<meta name="google-site-verification" content="${token.replace(/["<>]/g, '')}" />`
            : ''

          return html.replace('<!-- google-site-verification -->', verificationTag)
        },
      },
    ],
  }
})
