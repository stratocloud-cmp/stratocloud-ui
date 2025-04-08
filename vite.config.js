import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: "http://127.0.0.1:8082/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
      vue()
  ],

  optimizeDeps: {
    include: [
      // `monaco-editor/esm/vs/language/json/json.worker`,
      // `monaco-editor/esm/vs/language/css/css.worker`,
      // `monaco-editor/esm/vs/language/html/html.worker`,
      // `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
      // `monaco-editor/esm/vs/basic-languages/python/python`,
      // `monaco-editor/esm/vs/basic-languages/powershell/powershell`
    ],
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
