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
  // molstar is a very large library; on some Node versions esbuild's dependency
  // pre-bundling of it deadlocks and stalls every dev-server request. Excluding
  // it makes Vite serve it as native ESM instead of trying to pre-bundle it.
  optimizeDeps: {
    exclude: ['molstar'],
  },
  // Bind IPv4 explicitly so http://127.0.0.1:5173/ works. Default `localhost` can
  // listen only on IPv6 (::1), which refuses connections to 127.0.0.1.
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
