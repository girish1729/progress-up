<template>
 <div>

  <div class="wrapper">
     <div class='text-center'>
     <button @click="reloadPage" class="clearButton" role="button">Clear all</button>
     </div>

     <form>
     <input ref="fileInput"  v-on:change="uploadFiles" class="file-input" type="file" name="myFiles" multiple hidden>
     <span @click="$refs.fileInput.click()" >
     <font-awesome-icon size="10x" icon="cloud-upload-alt" />
     <p>Browse Files to Upload</p>
     </span>
     </form>
  </div>

    <div v-if="message" class="alert alert-light" role="alert">
    </div>

 <section class="progressArea">
  <div v-if="progressInfos">
      <div v-for="(progressInfo, index) in progressInfos"
        :key="index" >
       <li class="row">
          <font-awesome-icon icon="file-alt" />
          <div class='content'>
           <div class='details'>
            <span>{{progressInfo.fileName}}</span>
            <span class='percent'> {{progressInfo.percentage}} %</span>
           </div>
           <div class='progress-bar'>
                <div class="progress" :style="{ width:
progressInfo.percentage + '%' }"> </div>
            </div>
            <span class="size">{{progressInfo.size}} Bytes</span>
          </div>
       </li>
      </div>
    </div>
   </section>

 </div>
</template>

<script>
import UploadService from "../services/UploadFilesService";

export default {
  name: "upload-files-progress",
  data() {
    return {
      selectedFiles: undefined,
      progressInfos: [],
      message: ""
    };
  },
  methods: {
    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name,
size: file.size };

      UploadService.upload(file, (event) => {
        this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
      })
        .then((response) => {
          let prevMessage = this.message ? this.message + "\n" : "";
          this.message = prevMessage + response.data.message;
      });
    },

    reloadPage() {
        window.location.reload();
    },

    uploadFiles(event) {
      this.progressInfos = []; 
      this.selectedFiles = event.target.files;
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
};
</script>
