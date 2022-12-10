import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'

const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: path.resolve('./src/lib'),
			$assets: path.resolve('./static')
		}
	}
}

export default config
