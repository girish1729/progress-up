<template>
  <div>
    <div v-if="progressInfos">
      <div class="mb-2"
        v-for="(progressInfo, index) in progressInfos"
        :key="index"
      >
        <span>{{progressInfo.fileName}}</span>
        <div class="progress">
          <div class="progress-bar progress-bar-info"
            role="progressbar"
            :aria-valuenow="progressInfo.percentage"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{ width: progressInfo.percentage + '%' }"
          >
            {{progressInfo.percentage}}%
          </div>
        </div>
      </div>
    </div>

    <label class="btn btn-default">
      <input type="file" multiple @change="selectFile" />
    </label>

    <button class="btn btn-success"
      :disabled="!selectedFiles"
      @click="uploadFiles" >
      Upload
    </button>

    <div v-if="message" class="alert alert-light" role="alert">
    </div>

    </div>
</template>

<script>
import UploadService from "../services/UploadFilesService";

export default {
  name: "upload-files",
  data() {
    return {
      selectedFiles: undefined,
      progressInfos: [],
      message: "",

      fileInfos: [],
    };
  },
  methods: {
    selectFile(event) {
      this.progressInfos = [];
      this.selectedFiles = event.target.files;
    },

    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name };

      UploadService.upload(file, (event) => {
        this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
      })
        .then((response) => {
          let prevMessage = this.message ? this.message + "\n" : "";
          this.message = prevMessage + response.data.message;
      });
    },

    uploadFiles() {
      console.log("Click activate");
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
};
</script>
