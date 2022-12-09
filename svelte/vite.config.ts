import { defineConfig } from 'vite'
import {resolve} from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import libCss from 'vite-plugin-libcss';

export default defineConfig({
 assetsInclude: ['../public/assets/**'],
 build: {
    cssCodesplit: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ProgressUp',
      fileName: 'progress-up'
    },
    rollupOptions: {
      external: ['svelte'],
    }
  },
  plugins: [svelte(),libCss() ]
})
