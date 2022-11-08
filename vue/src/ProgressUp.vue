<template>
 <div>
  <div class="progress-up-wrapper">
     <div class='text-center'>
     <button @click="clearAll" class="clearButton" role="button">Clear all</button>
     </div>

     <form class="progress-up-form">
     <input id="fileInput"  v-on:change="onChange" class="file-input" type="file" name="myFiles" multiple hidden>
      <div @dragover="dragover" @drop="drop" @click="openFileBrowser()">
      	<i  class="fas fa-8x fa-cloud-upload-alt"></i>
     	<h2>Browse Files to Upload</h2>
      </div>
     </form>
  </div>

 <section class="progress-up-area">
  <div v-if="progressInfos">
      <div v-for="(progressInfo, index) in progressInfos"
        :key="index" >
       <li class="row">
         <i class="fas fa-3x fa-file-alt"></i>
          <div class='content'>
           <div class='details'>
            <span>{{progressInfo.fileName}}</span>
            <span class='percent'> {{progressInfo.percentage}} %</span>
           </div>
           <div class='progress-bar'>
                <div class="progress" :style="{ width: progressInfo.percentage + '%' }"> </div>
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
import axios from "axios";

export default {
  name: "ProgressUp",
  props: {
    uploadURL: undefined,
    filesName: undefined,
  },
  data() {
    return {
      Files: undefined,
      progressInfos: [],
      message: ""
    };
  },
  methods: {
  dragover(evt) {
	evt.preventDefault();
  },
  drop(evt) {
	this.Files = evt.DataTransfer.files;
  },
  openFileBrowser() {
      document.getElementById("fileInput").click();
  },
  uploadFile(file, onUploadProgress) {
    let formData = new FormData();

    formData.append(this.filesName, file);

    return axios.post(this.uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  },

    uploadProgress(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name,
size: file.size };

      this.uploadFile(file, (event) => {
        this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
      })
        .then((response) => {
          let prevMessage = this.message ? this.message + "\n" : "";
          this.message = prevMessage + response.data.message;
      });
    },

    clearAll() {
      this.progressInfos = []; 
    },
    onChange(event) {
      this.Files = event.target.files;
      uploadAllFiles(this.Files);
    },

    uploadAllFiles(files) {
      this.progressInfos = []; 
      this.message = "";
      for (let i = 0; i < files.length; i++) {
        this.uploadProgress(i, files[i]);
      }
    }
  }
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/girish1729/progress-up/css/progress-up.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
</style>
