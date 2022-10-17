import { createApp} from 'vue'
import App from './App.vue'
import UploadProgress from './plugins/uploadProgress.js';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
/* import specific icons */
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faCloudUploadAlt)

import './assets/main.css'
import './assets/uploadArea.css'

const app = createApp(App);
app.use(UploadProgress);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app')
