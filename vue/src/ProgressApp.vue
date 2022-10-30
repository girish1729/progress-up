<template>
    <div class="container" style="width:600px">
      <upload-engine></upload-engine>
      <slot></slot>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import UploadEngine from "./UploadEngine.vue";

export default defineComponent({
 name: "ProgressApp",
  components: {
    UploadEngine
  }
});
</script>
