import { defineConfig } from 'vite'
import {resolve} from 'path';
import react from '@vitejs/plugin-react'

export default defineConfig({
 assetsInclude: ['./assets/**'],
 build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'ProgressUp',
      fileName: 'progress-up'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dropzone'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React'
        }
      }
    }
  },

  plugins: [react()]
})
