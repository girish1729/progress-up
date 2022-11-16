<template>

<div class="dark:bg-gray-800 dark:text-white">

<!-- Dark mode controls -->
<div class="flex justify-end items-center space-x-2 mx-auto relative">
  <div class="w-14 h-8">

  <label for="dark-mode" class="w-full h-full rounded-full p-1 flex justify-between cursor-pointer">
    <span class="hidden dark:inline">&#127774;</span>
    <span class="inline dark:hidden">&#127769; </span>
  </label>

  <input type="checkbox" id="dark-mode" class='hidden'
onchange="document.documentElement.classList.toggle('dark')" />
  </div>
</div>


<!--
	<div id="config">
		<h2 class="leading-tight pb-2">
			&#128202; Progress type <span
class='text-sm'>{{form.progType}}</span>  
			 &#128228; Upload URL <span
class='text-sm'>{{form.uploadURL}}</span> 
		&#128218; FilesName <span
class='text-sm'>{{form.filesName}}</span>

		</h2>
	</div>

<h2 class="text-5xl leading-tight border-b"> {{details}} </h2>

	<div @dragover.prevent @drop.stop.prevent="onDrop" @click="openFileBrowser"  class="bg-light p-4 rounded mx-auto"> 
    	  <div class="text-gold-400 border border-red-800 border-dashed rounded cursor-pointer">
	   <form class='flex p-8  justify-center'>
		<img class="stroke-white dark:bg-white" width="100"
height="100" src="./assets/icons/upload/file-submit.svg" alt="progress-up file submit icon" />
	       <input ref="fileInput" @change="fileSelectFinish" name="uploadFiles" type="file" multiple hidden>
	   </form>
	</div>
-->
	
<h2>File upload config</h2>
	   <form class="w-full max-w-lg">
	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="uploadURL">
	          POST endpoint  
	         </label>
	         <input v-model='form.uploadURL' class="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	   focus:outline-none focus:bg-light" type="text"
	   placeholder="URL to post [cross origin or absolute URL needs CORS]">
	         <p class="text-red-500 text-xs italic">Please fill out field.</p>
	       </div>
	   
	       <div class="w-full md:w-1/2 px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-filesName">
	   	Name of files input field
	         </label>
	         <input v-model='form.filesName' class="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	    type="text" placeholder="Name of files input field">
	       </div>
	      </div>
	   
	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-indicator">
	           Progress indicator type
	         </label>
	         <div class="relative">
	           <select v-model='form.progType' v-on:change="setIndicator()" class="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option default>Line</option>
	   			<option>Fan</option>
	   			<option>Bubble</option>
	   			<option>Energy</option>
	   			<option>Rainbow</option>
	   			<option>Stripe</option>
	   			<option>Text</option>
	   			<option>Circle</option>
	           </select>
	           <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	             <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	           </div>
	         </div>
	       </div>
	      </div>
	

	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	       <label class="md:w-2/3 block text-dark-500 font-bold">
	         <span class="text-sm">
	           HTTP Auth required?
	         </span>
	         <input v-model='authEnabled' @change='enableAuth' class="mr-2 leading-tight" type="checkbox">
	       </label>
	      </div>
	     </div>
	   
             <div v-bind:class="(authEnabled) ? 'block' : 'hidden'" >
	        <div class="flex flex-wrap -mx-3 mb-6">
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide
text-dark-700 text-xs font-bold mb-2" for="progress-up-authtype">
	              Auth type
	            </label>
	            <div class="relative">
	              <select v-model='form.authType' class="block
appearance-none w-full bg-gray-200 border border-gray-200 text-dark-700
py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-light focus:border-gray-500" >
	                <option>HTTP basic auth</option>
	                <option>HTTP digest auth</option>
	              </select>
	       
	              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	              </div>
	            </div>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" for="username">
	             Username  
	            </label>
	            <input v-model='form.user' class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	      focus:outline-none focus:bg-light"  type="text"
	      placeholder="username">
	            <p class="text-red-500 text-xs italic">Please fill out field.</p>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" for="progress-up-pass">
	      	Password
	            </label>
	            <input v-model='form.pass' class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	      focus:outline-none focus:bg-light focus:border-gray-500"
	       type="password" placeholder="Password">
	          </div>
	         </div>
 	   </div>
	   
	   <button type="button" @click="saveConfig()" class="inline-block px-6
	py-2.5 bg-red-600 text-dark dark:text-white font-medium text-xs leading-tight uppercase
	rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700
	focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800
	active:shadow-lg transition duration-150 ease-in-out">Save</button>
	   
	   <button type="button" @click="testEP()" class="inline-block
px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out">
	    Test file upload
	   </button>
	   </form>


	<button id="upButton" @click="uploadAll()" v-bind:class="{ 'opacity-20' : disableUpload}" class="inline-block px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out" :disabled="disableUpload">Begin Uploading files </button>
	
<!--
	<button type="button" @click="clearAll()" class="inline-block
px-6 py-2.5 bg-yellow-500 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out">
	 Reset form
	</button>
 

	
     <div v-for="(stat, index) in statsTable" :key="index" >

	            <tr class="bg-gray-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">{{stat.id}}</td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {{stat.ts}}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {{stat.status}}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {{stat.details}}
	              </td>
	            </tr>
	</div>

<div id="progress-up-progressArea"> 
  <div v-for="(file,id) in uploadFileInfos" :key = "id" >
    <section class="m-4 p-4 mt-4 mb-4 transition-colors
    text-light-100 dark:text-white mx-auto">
     <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
    border-gray-300 text-gray-600 dark:text-white relative">
    
      <div @click="delItem(id)" title="Delete" class="absolute
    cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
    	<img width="25" height="25" src="./assets/icons/misc/trash-icon.svg" />
      </div>
    
      <div class="flex flex-wrap -mx-2 mb-8">
          <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
             <div class="h-12 text-sm text-grey-dark flex items-left
    justify-left">
                 <img width="125" height="125" :src="file.imagesrc"
:title="file.name" :alt="file.name" class="w-12 h-12" />
             </div>
          </div>
    
          <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
            <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
              <ul>
          	    <li  class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Name: {{file.name}}
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Date: {{file.ts}}
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Type: {{file.mime}}
          	    </li>
          	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">
          	    Size: {{file.size}} 
          	    </li>
              </ul>
            </div>
           </div>
      </div>
          <div class='ldBar bottom-0 right-0 pb-8' :id="file.id" ></div>
      </div>
    </section>
  </div>
</div>
-->

 
  </div>
</template>
<script>

import axios from "axios";

export default {
  data() {
    return {
    authEnabled: false,
form : {
   uploadURL : '',
   filesName: '',
authType: '',
user : '',
pass : '',
progType: 'Line'
  },

    fileTypes: {
        "video": "avi.svg",
        "css": "css.svg",
        "csv": "csv.svg",
        "eps": "eps.svg",
        "excel": "excel.svg",
        "html": "html.svg",
        "movie": "mov.svg",
        "mp3": "mp3.svg",
        "other": "other.svg",
        "pdf": "pdf.svg",
        "ppt": "ppt.svg",
        "rar": "rar.svg",
        "text": "txt.svg",
        "audio": "wav.svg",
        "word": "word.svg",
        "zip": "zip.svg"
    },
      uploadFileInfos: [],
      uploadFileList: [],
      statsTable: [],
    disableUpload : true,
      details: "",
    };
  },

  methods: {

    dragover(e) {
      e.preventDefault();
    },

    onDrop(evt, list) {
      const files = evt.dataTransfer.files;
	console.log(files);
    this.uploadFileList = files;
    this.setupUpload();
    },

spitStatistics(idx) {
    if (idx == uploadFileList.length - 1) {
        let endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
        totalsize = this.humanFileSize(totalsize);
        
        var ts = new Date().toLocaleString();
        var tot = uploadFileList.length;
        var status = totalfiles == tot ?
            "<img src='./assets/icons/misc/success-icon.svg' >" :
            "<img src='./assets/icons/misc/failure-icon.svg' >";
        var details = `${totalfiles}/${tot} files size ${totalsize} sent in
${totaltime} ms`;
        var id = statsTable.length + 1;
      
        disableUpload = true;
        this.progressBars = [];
        this.totalfiles = 0;
        this.totalsize = 0;
        this.totaltime = 0;
        this.startUploadts = 0;
    }
},

async uploadOneFile(file, idx) {
    let uplFormData = new FormData();
    formData.append(filesName, file);
    let options = {
        onUploadProgress: function(e) {
            let perc = parseInt(e.progress * 100);
            this.progressBars[idx].set(perc);
        }
    };

    if (authEnabled) {
        var username = "user";
        var password = "password";
        var basicAuth = "Basic " + btoa(username + ":" + password);
        options["headers"] =  {
                "Authorization": +basicAuth
         };
    }
    await axios.post(uploadURL, uplFormData, options).then((resp) => {
        spitStatistics(idx)
    }).catch((error) => {
        alert("Upload failed. Please check endpoint in Setup");
        alert(error);
    });
},

uploadAll() {
    console.log("Starting upload...");
    startUploadts = Date.now();
    for (i = 0; i < uploadFileList.length; i++) {
        f = uploadFileList[i].name;
        uploadOneFile(f, i);
    }
},
saveConfig() {
    console.log(this.form.uploadURL, this.form.filesName, this.authEnabled,
this.form.authType, this.form.user,this.form.pass,this.form.progType);
},

async testUpload(event) {
    console.log("Uploading using HTML5 File API...");
    let testForm = new FormData();

    const blob = new Blob(['Test upload DELETE'], {
        type: "plain/text"
    });
    testForm.append(filesName, blob, "progress-up-test.txt");
    let options = {};
    if (authEnabled) {
        var username = "user";
        var password = "password";
        var basicAuth = "Basic " + btoa(username + ":" + password);
        options = {
            headers: {
                "Authorization": +basicAuth
            }
        };
    }

    await axios.post(uploadURL, testForm, options).then((resp) => {
        alert("Test succeeded");
    }).catch((error) => {
        alert("Upload failed. Please check endpoint in Setup");
        alert(error);
    });
},

testEP() {
    saveConfig();
    testUpload();
},

setIndicator() {
    var progType = this.form.progType;
    console.log(progType);
    progType = progType.toLowerCase()
    switch (progType) {
        case "bubble":
            preset = progType;
            extra = "data-img-size=\"100,100\"";
            break;
        case "rainbow":
            preset = progType;
            extra = "data-stroke=\"data:ldbar/res,gradient(0,1,#f99,#ff9)\"";
            break;
        default:
            break;
    }
},
    uploadAllFiles() {
      this.uploadFileInfos = []; 
      for (let i = 0; i < this.uploadFileInfos.length; i++) {
        uploadProgress(i, this.uploadFileInfos[i]);
      }
    },
 clearAll() {
    this.details = "";
    this.progressInfos = []; 
    this.uploadFileList = [];
    this.progressBars = [];
    this.totalfiles = 0;
    this.totalsize = 0;
    this.totaltime = 0;
    this.startUploadts = 0;
    this.endUploadts = 0;

    disableUpload = true;
    console.log("Cleared");

 },

  drop(evt) {
	this.uploadFileList = evt.DataTransfer.files;
	this.setupUpload();
  },
  openFileBrowser() {
      this.$refs.fileInput.click();
  },
  uploadFile(file, onUploadProgress) {
    let formData = new FormData();

    formData.append(filesName, file);

    return axios.post(uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  },

    uploadProgress(idx, file) {
      this.uploadFileInfos[idx] = { percentage: 0, fileName: file.name,
size: file.size };

      uploadFile(file, (event) => {
        this.uploadFileInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
      })
        .then((response) => {
      });
    },

fileSelectFinish(evt) {
    let selectedFiles = evt.target.files;
    this.uploadFileList = selectedFiles;
    this.setupUpload();
},

delItem(index) {
    let list = [...uploadFileList];
    list.splice(index, 1);
    this.uploadFileList = list;
},

humanFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 +
        " " + ["B", "kB", "MB", "GB", "TB"][i]
    );
},

    buildThumb(f, type, cb ) {
        type = type.split('/')[0];
	console.log(type);

        if (type != "image") {
            var fileIcon = this.fileTypes[type];
            if (fileIcon == undefined) {
                fileIcon = "file.svg";
            }
            cb("src/assets/icons/filetypes/" + fileIcon);
        } else {
	    console.log("here");
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    cb(e.target.result);
                };
            })(f);
            reader.readAsDataURL(f);
        }
    },

    setupUpload() {
        for (var i = 0; i < this.uploadFileList.length; i++) {
            let f = this.uploadFileList[i];
            let ts = f.lastModifiedDate.toLocaleDateString();
            let fname = f.name;
            let size = this.humanFileSize(f.size);
            let mime = f.type;
            let id = "a" + i;
	    this.buildThumb(f, mime, (src) => {
               let imagesrc = src;
            this.uploadFileInfos.push({
                ts:ts,
                name:fname,
                size:size,
                mime:mime,
                id: id,
                imagesrc:imagesrc
            });

            var bar = new ldBar("#" + id, {
                preset: this.form.preset
            });
            bar.set(0);
	    });

            this.progressBars.push(bar);
            totalsize += f.size;
            totalfiles += 1;
        }
        disableUpload = false;
 }

}
};

</script>

<style>
@import url("https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/progress-up.css");
</style>
