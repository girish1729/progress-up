<template>
  <div id="app">
    <div class="container" style="width:600px">
      <div style="margin: 20px">
        <h3>bezkoder.com</h3>
        <h4>Vue.js multiple Files upload</h4>
      </div>
      <upload-files></upload-files>
    </div>
  </div>
</template>

<script>
import UploadFiles from "./components/UploadFiles";

export default {
  name: "App",
  components: {
    UploadFiles
  }
};
</script>
