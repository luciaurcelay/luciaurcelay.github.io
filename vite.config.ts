import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Bind IPv4 explicitly so http://127.0.0.1:5173/ works. Default `localhost` can
  // listen only on IPv6 (::1), which refuses connections to 127.0.0.1.
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
