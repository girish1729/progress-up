import { createApp} from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import ProgressApp from './ProgressApp.vue';

library.add(faCloudUploadAlt, faFileAlt, faCheck);
const app = createApp(ProgressApp);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');

export default ProgressApp;

