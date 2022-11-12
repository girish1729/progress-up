<template>

<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h2 class="text-5xl leading-tight mb-4 pb-4 border-b">  HTML5 Multiple File Upload with Progress Bar 
</h2>

<!-- XXX tabs -->
<div class="bg-light p7 rounded w-9/12 mx-auto">
  <!-- Tabs -->
  <ul id="tabs" class="inline-flex pt-2 px-1 w-full border-b">

    <li class="bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px">
	<a id="default-tab" href="#first">File upload</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#second">Setup</a>
    </li> 

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#third">Statistics</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#fourth">Help</a>
    </li>
  </ul>

  <!-- Tab Contents -->
<div id="tab-contents">

 <div id="first" class="p-4">
<!-- XXX drag drop -->
	<div id='progress-up-statsArea'></div>

	<div @dragover="dragover" @drop="drop" @click="openFileBrowser()" id='progress-up-form' class="bg-light p-4 rounded mx-auto">
    	  <div class="text-gold-400 border border-red-800 border-dashed rounded cursor-pointer">
	   <form class='flex p-8  justify-center'>
		<img class="stroke-white dark:bg-white" width="100" height="100" src="https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/upload/file-submit.svg" alt="progress-up file submit icon" />
	       <input id="progress-up-fileInput" name="uploadFiles" type="file" multiple hidden>
	   </form>
	   <h2 class="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>

	<div id="config">
		<h2 class="leading-tight pb-2">
			&#128202; Progress type <span
class='text-sm'>{{preset}}</span>  
			 &#128228; Upload URL <span
class='text-sm'>{{uploadURL}}</span> 
		&#128218; FilesName <span
class='text-sm'>{{filesName}}</span>
		</h2>
	</div>
	

	<button id="upButton" onClick="uploadAll()" class="inline-block px-6
	py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs leading-tight
	uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg
	focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0
	active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out
	opacity-20" disabled>Begin Uploading files
	</button>
	
	<button type="button" @click="clearAll()" class="inline-block
px-6 py-2.5 bg-yellow-500 text-dark dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out">
	 Reset form
	</button>
 	
  </div>

<!-- Second tab -->

  <div id="second" class="hidden p-4">
	<h2>File upload config</h2>
	   <form class="w-full max-w-lg">
	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-uploadURL">
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
	           <select id='progress-up-indicator'
v-on:change="setIndicator()" class="block appearance-none w-full bg-gray-200 border
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
	         <input v-on:change="toggleAuthQ(this)" id='progress-up-authenable' class="mr-2 leading-tight" type="checkbox">
	       </label>
	      </div>
	     </div>
	   
             <div id='progress-up-authsection' class="hidden">
	        <div class="flex flex-wrap -mx-3 mb-6">
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide
text-dark-700 text-xs font-bold mb-2" for="progress-up-authtype">
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
	      font-bold mb-2" for="progress-up-username">
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
	      font-bold mb-2" for="progress-up-pass">
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
  <div id="third" class="hidden p-4">
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

      <div v-for="(stat, index) in statsTable"
        :key="index" >

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

		   </tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>
   </div>

<!-- Fourth tab -->
  <div id="fourth" class="hidden p-4">
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

	<img src="images/progress-types.png" alt="Progress-up types" />

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
  <div v-if="progressInfos">
      <div v-for="(progressInfo, index) in progressInfos"
        :key="index" >

<section :id="`${id}-section`" class="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white mx-auto">
 <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
border-gray-300 text-gray-600 dark:text-white relative">

  <div  v-on:click="`delItem(${i})`" title="Delete" class="absolute
cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
	<img width="25" height="25" src="https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/misc/trash-icon.svg" />
  </div>

  <div class="flex flex-wrap -mx-2 mb-8">
      <!--first col -->
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left
justify-left">
		<div :id="`${progressInfo.name}`"></div>
         </div>
      </div>

      <!--second col -->
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
          <ul>
      	    <li  class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {{progressInfo.name}}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {{{progressInfo.ts}}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {{progressInfo.mime}}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {{progressInfo.size}} 
      	    </li>
          </ul>
        </div>
       </div>
  </div>
      <div class='ldBar bottom-0 right-0 pb-8' :id="id" ></div>


  </div>
</section>

      </div>
    </div>
  </div>



</template>


<script>
import axios from "axios";

export default {
  name: "ProgressUp",

/* XXX Globals */

var preset = "line";
var extra = '';

/* XXX these are backend variables */
var uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
uploadURL = 'https://localhost:2324/uploadmultiple';
var filesName = "uploadFiles";
var authEnabled = false;
var authType = "Basic";
var user = '';
var pass = '';


/* XXX File upload tab functions */

var fileTypeIcons = {
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
};

/* XXX Internal variables */
var uploadFileList = [];
/* stats variables */

var progressBars = [];
var statsTable = [];
var totalfiles = 0;
var totalsize = 0;
var totaltime = 0;
var startUploadts = 0;
var endUploadts = 0;

const uplform = document.querySelector("#progress-up-form form");
uplform.addEventListener("dragover", dragOver, false);
uplform.addEventListener("drop", drop, false);

const fileInput = document.getElementById("progress-up-fileInput");
const progressArea = document.getElementById("progress-up-progressArea");
const statsArea = document.getElementById("progress-up-statsArea");
const configSummary = document.getElementById("progress-up-configSummary");

uplform.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({
    target
}) => fileSelectFinish(target);



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

/* tabs for tailwind */
let tabsContainer = document.querySelector("#tabs");
let tabTogglers = tabsContainer.querySelectorAll("#tabs a");
tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        let tabName = this.getAttribute("href");
        let tabContents = document.querySelector("#tab-contents");
        for (let i = 0; i < tabContents.children.length; i++) {
            tabTogglers[i].parentElement.classList.remove("border-t", "border-r", "border-l", "-mb-px", "bg-white");
            tabContents.children[i].classList.remove("hidden");
            if ("#" + tabContents.children[i].id === tabName) {
                continue;
            }
            tabContents.children[i].classList.add("hidden");
        }
        e.target.parentElement.classList.add("border-t", "border-r", "border-l", "-mb-px", "bg-white");
    });
});


fileSelectFinish(target) {
    let selectedFiles = target.files;
    uploadFileList = selectedFiles;
    setupUpload();
},

humanFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 +
        " " + ["B", "kB", "MB", "GB", "TB"][i]
    );
},

setIconImage(name, type) {
    type = type.split('/')[0];
    console.log(type);
    var fileIcon = fileTypeIcons[type];
    if (fileIcon == undefined) {
        fileIcon = "file.svg";
    }
    var icon = [
        '<img width="125" height="125" src="',
	'https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/filetypes/' + fileIcon,
        '" title="', name,
        '" alt="', name,
        '" class="h-9 w-9" />'
    ].join('');
    document.getElementById(name).innerHTML = icon;
},

showThumbnails() {
    for (var i = 0, f; f = uploadFileList[i]; i++) {
        if (!f.type.match('image.*')) {
            setIconImage(f.name, f.type);
        } else {
            var reader = new FileReader();
            // Closure to capture the file information.  
            reader.onload = (function(theFile) {
                return function(e) {
                    var thumb = [
                        '<img width="125" height="125" src="',
                        e.target.result,
                        '" title="', theFile.name,
        		'" alt="', theFile.name,
        		'" class="w-12 h-12" />'
                    ].join('');
		    document.getElementById(theFile.name).innerHTML = thumb;
                };
            })(f);
            reader.readAsDataURL(f);
        }
    }
},

setupUpload() {
    var progressHTML = [];
    for (var i = 0; i < uploadFileList.length; i++) {
        let f = uploadFileList[i];
        let ts = f.lastModifiedDate.toLocaleDateString();
        let name = f.name;
        totalsize += f.size;
        let size = humanFileSize(f.size);
        let mime = f.type;
        let id = 'a' + i;
        totalfiles += 1;

        progressHTML.push(
            `
<section id="${id}-section" class="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white mx-auto">
 <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
border-gray-300 text-gray-600 dark:text-white relative">

  <div  onClick="delItem(${i})" title="Delete" class="absolute
cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
	<img width="25" height="25" src="https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/misc/trash-icon.svg" />
  </div>

   <div class="flex flex-wrap -mx-2 mb-8">
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left
justify-left">
		<div id="${name}"></div>
         </div>
      </div>
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left
justify-left">
      <ul>
      	    <li  class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: ${name}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: ${ts}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: ${mime}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: ${size} 
      	    </li>
      </ul>
   </div>

      	<div class='ldBar bottom-0 right-0 pb-8' id="${id}" ></div>

  </div>
</section>
`);

    }
    progressArea.innerHTML = progressHTML.join('');

    for (var i = 0; i < uploadFileList.length; i++) {
        var selector = '#a' + i;
        var bar = new ldBar(selector, {
            preset: preset
        });
        bar.set(0);
        progressBars.push(bar);
    }
    showThumbnails();
    enableUploadButton();
},

delItem(index) {
    let list = [...uploadFileList];
    list.splice(index, 1);
    uploadFileList = list;
    el = document.getElementById('a' + index + '-section');
    el.remove();

},

dumpConfigSummary() {
configSummary.innerHTML = `
	<div id="config">
		<h2 class="leading-tight pb-2">
			&#128202; Progress type <span
class='text-sm'>${preset}</span>  
			 &#128228; Upload URL <span
class='text-sm'>${uploadURL}</span> 
		&#128218; FilesName <span
class='text-sm'>${filesName}</span>
		</h2>
	</div>
	`;
},

spitStatistics(idx) {
    if (idx == uploadFileList.length - 1) {
        endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
        totalsize = humanFileSize(totalsize);
        statsArea.innerHTML = `
	<div id="uploadStats">
	<h2 class="text-5xl leading-tight border-b">
		${totalfiles} file(s) uploaded ${totalsize} sent in ${totaltime} milliseconds</h2>
	</div>
	`;


        var ts = new Date().toLocaleString();
        var tot = uploadFileList.length;
        var status = totalfiles == tot ?
            '<img src="https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/misc/success-icon.svg" >' :
            '<img src="https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/misc/failure-icon.svg" >';
        var details = `${totalfiles}/${tot} files size ${totalsize} sent in
${totaltime} ms`;

        var id = statsTable.length + 1;
        statsTable.push(`

	            <tr class="bg-gray-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">${id}</td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   ${ts}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   ${status}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   ${details}
	              </td>
	            </tr>
    `);

        upBut.setAttribute('disabled', true);
        upBut.classList.add('opacity-20');
        populateStats();
        progressBars = [];
        totalfiles = 0;
        totalsize = 0;
        totaltime = 0;
        startUploadts = 0;
        endUploadts = 0;
    }
},

async function uploadOneFile(name, idx) {
    let uplFormData = new FormData(uplform);
    let options = {
        onUploadProgress: function(e) {
            /*{
              loaded: number;
              total?: number;
              progress?: number; // in range [0..1]
              bytes: number; // how many bytes have been transferred since the last trigger (delta)
              estimated?: number; // estimated time in seconds
              rate?: number; // upload speed in bytes
              upload: true; // upload sign
            }*/
            let perc = parseInt(e.progress * 100);
            progressBars[idx].set(perc);
        }
    };

    if (authEnabled) {
        var username = 'user';
        var password = 'password';
        var basicAuth = 'Basic ' + btoa(username + ':' + password);
        options['headers'] =  {
                'Authorization': +basicAuth
         };
    }
    await axios.post(uploadURL, uplFormData, options).then((resp) => {
        spitStatistics(idx)
    }).catch((error) => {
        alert("Upload failed. Please check endpoint in Setup");
        alert(error);
    });
}

function uploadAll() {
    console.log("Starting upload...");
    startUploadts = Date.now();
    for (i = 0; i < uploadFileList.length; i++) {
        f = uploadFileList[i].name;
        uploadOneFile(f, i);
    }
},
/* XXX Setup tab functions */


toggleAuthQ(val) {
    const authSection = document.querySelector("#progress-up-authsection");
    authSection.classList.toggle("hidden");
},

initApp() {
    document.getElementById("progress-up-uploadURL").value = uploadURL;
    document.getElementById("progress-up-filesName").value = filesName;
    dumpConfigSummary();
},

saveConfig() {

    uploadURL = document.getElementById("progress-up-uploadURL").value;
    filesName = document.getElementById("progress-up-filesName").value;
    authEnabled = document.getElementById("progress-up-authenable").value;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;

    console.log(uploadURL, filesName, authEnabled, authType, user, pass);
    dumpConfigSummary();
},

async testUpload(event) {
    console.log("Uploading using HTML5 File API...");
    let testForm = new FormData();

    const blob = new Blob(['Test upload DELETE'], {
        type: 'plain/text'
    });
    testForm.append(filesName, blob, 'progress-up-test.txt');
    let options = {};
    if (authEnabled) {
        var username = 'user';
        var password = 'password';
        var basicAuth = 'Basic ' + btoa(username + ':' + password);
        options = {
            headers: {
                'Authorization': +basicAuth
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
    var progType = document.getElementById("progress-up-indicator").value;
    console.log(progType);
    progType = progType.toLowerCase()
    switch (progType) {
        case "line":
            preset = progType;
            break;
        case "fan":
            preset = progType;
            break;
        case "bubble":
            preset = progType;
            extra = 'data-img-size="100,100"';
            break;
        case "rainbow":
            preset = progType;
            extra = 'data-stroke="data:ldbar/res,gradient(0,1,#f99,#ff9)"';
            break;
        case "energy":
            preset = progType;
            break;
        case "stripe":
            preset = progType;
            break;
        case "text":
            preset = progType;
            break;
        case "circle":
            preset = progType;
            break;
        default:
            break;
    }
    dumpConfigSummary();
},

/* XXX Statistics tab functions */

populateStats() {
    statsTableDOM = document.getElementById("progress-up-statsTable");
    statsTableDOM.innerHTML = statsTable.join('');
},

/* XXX orig code */
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

enableUploadButton() {
    upBut = document.getElementById("upButton");
    upBut.removeAttribute('disabled');
    upBut.classList.remove('opacity-20');
},
    clearAll() {
      this.progressInfos = []; 
    progressArea.innerHTML = '';
    statsArea.innerHTML = '';
    configSummary.innerHTML = '';
    uploadFileList = [];
    uploadFileList = [];
    progressBars = [];
    totalfiles = 0;
    totalsize = 0;
    totaltime = 0;
    startUploadts = 0;
    endUploadts = 0;

    upBut = document.getElementById("upButton");
    upBut.disabled = true;
    console.log("Cleared");

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
@import url("https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/progress-up.css");
</style>
