/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  test: {
    exclude: [
      ...configDefaults.exclude,
      'src/components/ui/*'
    ],
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        'src/components/ui/*'
      ],
      provider: "istanbul"
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTest.js',
    css: true
  }
})
