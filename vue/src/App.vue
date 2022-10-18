<script>

export default {
  data() {
    return { 
    }
  },
  methods: {

    onFileUpload(){
    const files = this.$refs.fileInput.files;
    const form = this.$refs.uploadForm;
    const progressArea = this.$refs.progressArea;
    const uploadedArea = this.$refs.uploadedArea;
    progressArea.innerHTML = "";
    for (this.i = 0; this.i < files.length; this.i++) {
        const file = files[this.i];
        if (file) {
            const fileName = file.name;
            const fileLoaded = 0;
            const size = file.size;
            const progressHTML =
                `<li class="row">
	      	    <font-awesome-icon size="4x" icon="fa-solid fa-file-alt" />
                       <div class="content">
                            <div class="details">
                              <span class="name">${fileName} </span>
                              <span id="${fileName}-1" class="percent">${fileLoaded} %</span>
                            </div>
                         <div id="${fileName}-2" class="progress-bar">
                              <div  class="progress" style="width: ${fileLoaded}%"></div>
                         </div>
                         <span class="size">${size} Bytes</span>
                        </div>
		 </li>`;
            progressArea.innerHTML += progressHTML;
            uploadedArea.classList.add("onprogress");
            this.uploadFile(fileName, file.size, progressHTML);
        }
    }
    },

    reloadPage()  {
	window.location.reload();
    },

    uploadFile(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadmultiple");
    xhr.upload.addEventListener("progress", ({
        loaded,
        total
    }) => {
        const fileLoaded = Math.floor((loaded / total) * 100);
        document.getElementById(name + '-1').innerHTML = fileLoaded;
        document.getElementById(name + '-2').innerHTML = `
             <div  class="progress" style="width: ${fileLoaded}%"></div>
	`;
    });
    const form = this.$refs.uploadForm;
    const data = new FormData(form);
    xhr.send(data);
    }
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
	 <section class='uploadedArea' ref="uploadedArea"></section>
	</div>
    </template>

  </uploadarea>
</template>

