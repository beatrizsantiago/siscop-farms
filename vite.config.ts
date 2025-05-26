import { defineConfig } from 'vite'
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'farms',
      filename: 'remoteEntry.js',
      exposes: {
        './farms-app': './src/App/index.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3002,
  },
})
