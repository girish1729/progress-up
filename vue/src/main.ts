import { createApp, Plugin } from 'vue';
import ProgressApp from './ProgressApp.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
library.add(faCloudUploadAlt, faFileAlt, faCheck);

import './assets/uploadArea.css';

const app = createApp(ProgressApp);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');

export default {
	install: () => {
		app.component('progress-up', ProgressApp);
	}
};
