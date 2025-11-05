import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup/vitest-setup.ts'],
    css: true,
    include: ['./components/**/*.test.{ts,tsx}'],
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/component-test-results.json'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
})