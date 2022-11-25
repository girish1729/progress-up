import { defineConfig } from 'vite'
import { resolve } from 'path'
import libCss from 'vite-plugin-libcss';

import vue from '@vitejs/plugin-vue'

export default defineConfig({
 assetsInclude: ["./assets/**"],
 build: {
    cssCodesplit: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ProgressUp',
      fileName: 'progress-up'
    },
    rollupOptions: {
      external: ['vue', 'vue-pdf'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue(), libCss()]
})
