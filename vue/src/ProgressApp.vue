<template>
    <div class="container" style="width:600px">
      <upload-files-progress></upload-files-progress>
      <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UploadFilesProgress from "@components/uploadFilesProgress.vue";

export default defineComponent({
  name: "ProgressApp",
    inheritAttrs: false,
  components: {
    UploadFilesProgress
  }
});
</script>
