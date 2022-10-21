<template>
  <div id="app">
    <div class="container" style="width:600px">
      <div style="margin: 20px">
        <h1>progress.up | HTML5 multi file upload progress bar</h1>
        <h2>Vue.js plugin </h2>
      </div>
      <upload-files-progress></upload-files-progress>
    </div>
  </div>
</template>

<script>
import UploadFilesProgress from "./components/uploadFilesProgress";

export default {
  name: "App",
  components: {
    UploadFilesProgress
  }
};
</script>
