import { defineConfig } from 'vite'
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'farms',
      filename: 'remoteEntry.js',
      exposes: {
        './farms-app': './src/App/index.tsx',
      },
      shared: [
        'react',
        'react-dom',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled',
      ],
    }),
  ],
  server: {
    port: 3002,
    cors: true
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@fb': path.resolve(__dirname, 'src/firebase'),
      '@usecases': path.resolve(__dirname, 'src/usecases'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@App': path.resolve(__dirname, 'src/App'),
      '@generalTypes': path.resolve(__dirname, 'src/types'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
  optimizeDeps: {
    exclude: ['@phosphor-icons/react'],
  },
  build: {
    target: 'esnext',
  }
})
