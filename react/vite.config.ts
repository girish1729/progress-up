import { defineConfig } from 'vite'
import {resolve} from 'path';
import react from '@vitejs/plugin-react'
import libCss from 'vite-plugin-libcss';

export default defineConfig({
 assetsInclude: ['./assets/**'],
 build: {
    cssCodesplit: true,
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'ProgressUp',
      fileName: 'progress-up'
    },
    rollupOptions: {
      external: ['react', 'react-dropzone'],
      output: {
        globals: {
          react: 'react',
          "react-dropzone": 'react-dropzone',
        }
      }
    }
  },
  plugins: [react(),libCss() ]
})
