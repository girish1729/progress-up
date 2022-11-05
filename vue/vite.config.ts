import { defineConfig } from 'vite'
import { resolve } from 'path'
import libCss from 'vite-plugin-libcss';

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
 build: {
    cssCodesplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ProgressUp',
      // the proper extensions will be added
      fileName: 'progress-up'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue(), libCss()]
})
