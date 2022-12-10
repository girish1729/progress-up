import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess(),
    kit: {
        adapter: adapter(),
        prerender: {
            default: true
        },
        files: {
            assets: 'static',
            lib: 'src/lib'
        }
    }
};

export default config;

