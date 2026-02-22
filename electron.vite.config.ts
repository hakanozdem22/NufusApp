import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
// 1. BU SATIRI EKLE:
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    // 2. PLUGINS KISMINI BURADAKİ GİBİ GÜNCELLE:
    plugins: [
      react(),
      nodePolyfills({
        // Buffer ve stream modüllerini dahil etmesini söylüyoruz
        include: ['buffer', 'stream', 'util', 'zlib', 'process'],
        globals: {
          Buffer: true,
          global: true,
          process: true
        }
      })
    ]
  }
})
