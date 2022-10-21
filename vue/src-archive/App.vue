<script>
import axios from 'axios';
export default {
    data() {
        return {
		fileLoaded: []
	}
    },
    methods: {

        onFileUpload() {
            const files = this.$refs.fileInput.files;
            const form = this.$refs.uploadForm;
            const progressArea = this.$refs.progressArea;
            const uploadedArea = this.$refs.uploadedArea;
            progressArea.innerHTML = "";
            for (this.i = 0; this.i < files.length; this.i++) {
                let formData = new FormData();
                const file = files[this.i];
                if (file) {
                    const fileName = file.name;
                    const size = file.size;
		    this.fileLoaded[fileName] = 30;
                    const progressHTML =
                        `<li class="row">
	      	    <font-awesome-icon size="4x" icon="fa-solid fa-file-alt" />
                       <div class="content">
                            <div class="details">
                              <span class="name">${fileName} </span>
                              <span
class="percent">${this.fileLoaded[fileName]} %</span>
                            </div>
                         <div class="progress-bar">
                              <div  class="progress" style="width:
${this.fileLoaded[fileName]}%"></div>
                         </div>
                         <span class="size">${size} Bytes</span>
                        </div>
		 </li>`;
                    progressArea.innerHTML += progressHTML;
                    formData.append('myFiles', file);
                    this.uploadFile(formData, file);
                }
            }
        },

        reloadPage() {
            window.location.reload();
        },

        uploadFile(formData, file) {
            axios.post('http://localhost:2324/uploadmultiple',
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: function(progressEvent) {
                        this.fileLoaded[file] = Math.floor((progressEvent.loaded /
                            progressEvent.total) * 100);
                       }.bind(this)
                }
            ).then(function() {
                console.log('SUCCESS!!');
            });

        }

    },
    mounted: function() {
	
    }

}
</script>

<template>
  <uploadarea>
    <template #title>
     progress.up | HTML5 multiple file upload progress bar
    </template>
    <template #author>
	Girish Venkatachalam
    </template>
    <template #uploadform>
	<div class="wrapper">
	 <header>Progress.up file upload </header>
	 <div class='text-center'>
	   <button @click="reloadPage" class="clearButton" role="button">Clear all</button>
	 </div>
	 <form ref='uploadForm' action="#">
	      <input ref="fileInput"  v-on:change="onFileUpload(e)" class="file-input" type="file" name="myFiles" multiple hidden>
	<span @click="$refs.fileInput.click()" >
	      <font-awesome-icon size="10x" icon="fa-solid fa-cloud-upload-alt" />
	      <p>Browse Files to Upload</p>
	</span>
	 </form>
	 <section class='progressArea' ref="progressArea"></section>
	</div>
    </template>

  </uploadarea>
</template>

