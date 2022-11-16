<template>

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


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h2 class="text-5xl leading-tight mb-4 pb-4 border-b">  HTML5 Multiple File Upload with Progress Bar 
</h2>

<!-- XXX tabs -->
<div class="bg-light p7 rounded w-9/12 mx-auto">
  <!-- Tabs -->
  <ul id="tabs" class="inline-flex pt-2 px-1 w-full border-b">

    <li class="bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2  -mb-px">
	<a id="default-tab" @click="toggleTabs(1)" :class="{'px-4 text-dark-800 font-semibold py-2 rounded-t': openTab !== 1, 'bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px' : openTab === 1}" > File upload</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a @click="toggleTabs(2)" :class="{'px-4 text-dark-800 font-semibold py-2 rounded-t': openTab !== 2, 'bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px' : openTab === 2}" >
Setup</a>
    </li> 

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">

	<a @click="toggleTabs(3)" :class="{'px-4 text-dark-800 font-semibold py-2 rounded-t': openTab !== 3, 'bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px' : openTab === 3}" >
Statistics</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">

	<a @click="toggleTabs(4)" :class="{'px-4 text-dark-800 font-semibold py-2 rounded-t': openTab !== 4, 'bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px' : openTab === 4}" >
Help</a>
    </li>

  </ul>

  <!-- Tab Contents -->
<div id="tab-contents">

 <div :class="{'hidden': openTab !== 1, 'block': openTab === 1}">
<!-- XXX drag drop -->
	<div id='progress-up-statsArea'></div>

	<div id='progress-up-form' class="bg-light p-4 rounded mx-auto">
    	  <div class="text-gold-400 border border-red-800 border-dashed rounded cursor-pointer">
	   <form class='flex p-8  justify-center'>
		<img class="stroke-white dark:bg-white" width="100" height="100"
src="./assets/icons/upload/file-submit.svg" alt="progress-up file submit icon" />
	       <input id="progress-up-fileInput" name="uploadFiles" type="file" multiple hidden>
	   </form>
	   <h2 class="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>

	<div id='progress-up-configSummary'></div>

	<button id="upButton" onClick="uploadAll()" class="inline-block px-6
	py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight
	uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg
	focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0
	active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out
	opacity-20" disabled>Begin Uploading files
	</button>
	
	<button type="button" onClick="clearAll()" class="inline-block
px-6 py-2.5 bg-yellow-500 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out">
	 Reset form
	</button>
 	

  </div>

<!-- Second tab -->

 <div :class="{'hidden': openTab !== 2, 'block': openTab === 2}">
	<h2>File upload config</h2>
	   <form class="w-full max-w-lg">
	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="grid-post-endpoint">
	          POST endpoint  
	         </label>
	         <input id='progress-up-uploadURL' class="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	   focus:outline-none focus:bg-light" type="text"
	   placeholder="URL to post [cross origin or absolute URL needs CORS]">
	         <p class="text-red-500 text-xs italic">Please fill out this field.</p>
	       </div>
	   
	       <div class="w-full md:w-1/2 px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-filesName">
	   	Name of files input field
	         </label>
	         <input id='progress-up-filesName' class="appearance-none block w-full bg-gray-200
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
	           <select id='progress-up-indicator' onChange="setIndicator()" class="block appearance-none w-full bg-gray-200 border
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
	         <input onChange="toggleAuthQ(this)" id='progress-up-authenable' class="mr-2 leading-tight" type="checkbox">
	       </label>
	      </div>
	     </div>
	   
             <div id='progress-up-authsection' class="hidden">
	        <div class="flex flex-wrap -mx-3 mb-6">
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs font-bold mb-2" for="grid-state">
	              Auth type
	            </label>
	            <div class="relative">
	              <select id='progress-up-authtype' class="block
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
	      font-bold mb-2" for="grid-username">
	             Username  
	            </label>
	            <input id='progress-up-username' class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	      focus:outline-none focus:bg-light"  type="text"
	      placeholder="username">
	            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2" for="grid-pass">
	      	Password
	            </label>
	            <input id='progress-up-pass' class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	      focus:outline-none focus:bg-light focus:border-gray-500"
	       type="password" placeholder="Password">
	          </div>
	         </div>
 	   </div>
	   
	   <button type="button" onClick="saveConfig()" class="inline-block px-6
	py-2.5 bg-red-600 text-dark dark:text-white font-medium text-xs leading-tight uppercase
	rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700
	focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800
	active:shadow-lg transition duration-150 ease-in-out">Save</button>
	   
	   <button type="button" onClick="testEP()" class="inline-block
px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out">
	    Test file upload
	   </button>
	   </form>
  </div>

<!-- Third tab -->

 <div :class="{'hidden': openTab !== 3, 'block': openTab === 3}">
      <h2> Statistics </h2>
	<div class="flex flex-col">
	  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
	    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
	      <div class="overflow-hidden">
	        <table class="min-w-full">
	          <thead class="bg-light border-b">
	            <tr>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                #
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Time
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Status
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Details
	              </th>
	            </tr>
	          </thead>
	          <tbody id="progress-up-statsTable">

		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>

   </div>

<!-- Fourth tab -->

 <div :class="{'hidden': openTab !== 4, 'block': openTab === 4}">
    <div class="flex flex-col">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
	 <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
	    <div class="overflow-hidden">

	        <table class="min-w-full">
	          <thead class="bg-light border-b">
	            <tr>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	               Param
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Type
	              </th>
	              <th scope="col" class="text-sm font-medium text-dark-900 px-6 py-4 text-left">
	                Description
	              </th>
	            </tr>
	          </thead>
	          <tbody>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">uploadURL</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The absolute/relative path of HTTP POST
endpoint </td>
		   </tr>


	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">filesName</td>
	              <td class="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> The name of files configured in backend </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">HTTP auth </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Checkbox </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Enable it if your backend requires auth</td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">HTTP auth type</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Choose one of Digest/Basic HTTP auth </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Auth username</td>
	              <td class="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Username configured in backend for auth </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Password</td>
	              <td class="text-sm text-dark-900 font-light px-6 py-4 whitespace-nowrap"> String </td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Password configured in backend for auth </td>
		   </tr>

	            <tr class="bg-light-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-dark-900">Progress Indicator</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> Select option</td>
	              <td class="text-sm text-dark-900 font-light px-6
py-4 whitespace-nowrap"> See below for possible options </td>
		   </tr>
		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>

	<img src="./assets/progress-types.png" alt="Progress-up types" />

       <ul class='marker:text-green list-outside'>
         <li class='pb-2'> There is also the ability to perform a test Upload to validate the endpoint.  </li>
         <li>
       	Remember that the configuration is active only for the session.
         </li>
       
         <li>
       	There is also statistics for upload and profiling available.
         </li>
         <li>
       	If using absolute URL please ensure <a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing">CORS is enabled</a>.
         </li>
       </ul>
  </div>

 </div>
</div>
<!-- XXX tabs -->


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

</template>


<script>
import axios from "axios";

import ldBar from "./assets/progressBar/loading-bar.js";

export default {
  data() {
    return {
    openTab: 1,
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
 },

    toggleTabs: function(tabNumber){
      this.openTab = tabNumber
    }

}
};

</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/progress-up.css");
.ldBar {
  position: relative;
}
.ldBar.label-center > .ldBar-label {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-shadow: 0 0 3px #fff;
}
.ldBar-label:after {
  content: "%";
  display: inline;
}
.ldBar.no-percent .ldBar-label:after {
  content: "";
}
</style>
