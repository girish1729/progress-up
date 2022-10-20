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
                              <span class="percent">${fileLoaded} %</span>
                            </div>
                         <div class="progress-bar">
                              <div  class="progress" style="width: ${fileLoaded}%"></div>
                         </div>
                         <span class="size">${size} Bytes</span>
                        </div>
		 </li>`;
            progressArea.innerHTML += progressHTML;
            this.uploadFile(fileName, file.size, progressHTML);
        }
    }
    },

    reloadPage()  {
	window.location.reload();
    },

    uploadFile(name) {
    axios.post( 'https://localhost:2324/uploadmultiple',
	formData,
  	{
	headers: { 'Content-Type': 'multipart/form-data'
		},
	onUploadProgress: function( progressEvent ) {
        const fileLoaded = Math.floor((progressEvent.loaded /
progressEvent.total) * 100);
        document.getElementById(name + '-1').innerHTML = fileLoaded;
        document.getElementById(name + '-2').innerHTML = `
             <div  class="progress" style="width: ${fileLoaded}%"></div>
	`;
					}.bind(this)
					}
				).then(function(){
					console.log('SUCCESS!!');
				});

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
	</div>
    </template>

  </uploadarea>
</template>

