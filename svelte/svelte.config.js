
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      assets: 'assets',
      fallback: null,
      precompress: false,
      strict: true
    })
  }
};

