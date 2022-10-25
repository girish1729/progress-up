<template>
    <div class="container" style="width:600px">
      <upload-files-progress></upload-files-progress>
    </div>
</template>

<script>
import UploadFilesProgress from "@components/uploadFilesProgress.vue";

export default {
  name: "App",
  components: {
    UploadFilesProgress
  }
};
</script>
