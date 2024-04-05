import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: process.env.MODE === "lan" ? "app.coco-erp.lan" : "localhost"
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
})
