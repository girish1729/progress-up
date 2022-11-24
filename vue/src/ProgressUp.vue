<script>
import axios from "axios";
import ldBar from "./assets/progressBar/loading-bar.js";
import pdf from 'vue-pdf'

export default {
    data() {
        return {
            openTab: 1,
            dragging: false,
            authEnabled: false,
    	    filtFiles = {
        	"type": "all",
        	"action": "allow"
    	   },
            form: {
                uploadURL: 'https://localhost:2324/uploadmultiple',
                filesName: 'uploadFiles',
                authType: '',
                user: '',
                pass: '',
                progType: 'Line',
                fileSizeLimit: 10,
                sizeLimitType: "Single file limit",
                fileTypeFilter: "All",
                fileTypeAction: "Allow file type"
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
            errInfos: [],
            statsTable: [],
            progressBars: [],
            disableUpload: true,
            details: "",
        };
    },

    updated() {
        this.$nextTick(() => {
            this.createProgressBars();
            if (this.form.uploadURL == undefined || this.form.filesName == undefined) {
                this.disableUpload = true;
            }
        });
    },

    methods: {

        dragover(e) {
            e.preventDefault();
        },

        onDragEnter() {
            this.dragging = true;
        },
        onDragLeave() {
            this.dragging = false;
        },
        onDrop(evt, list) {
            const files = evt.dataTransfer.files;
            this.clearAll();
            console.log(files);
            this.uploadFileList = files;
            this.setupUpload();
        },

        spitStatistics(self, idx) {
            if (idx == self.uploadFileList.length - 1) {
                let endUploadts = Date.now();
                self.totaltime = `${endUploadts - this.startUploadts}`;
                self.totalsize = this.humanFileSize(this.totalsize);

                var ts = new Date().toLocaleString();
                var tot = self.uploadFileList.length;
                var status = self.totalfiles == tot ?
                    "<img src='src/assets/icons/misc/success-icon.svg' >" :
                    "<img src='src/assets/icons/misc/failure-icon.svg' >";
                self.details = `${self.totalfiles}/${tot} files of size ${this.totalsize} sent in ${self.totaltime} ms`;
                var id = self.statsTable.length + 1;

                let stat = {
                    id: id,
                    ts: ts,
                    status: status,
                    details: self.details
                };
                self.statsTable.push(stat);

                self.progresBars = [];
                self.disableUpload = true;
                self.totalfiles = 0;
                self.totalsize = 0;
                self.totaltime = 0;
                self.startUploadts = 0;
            }
        },

        uploadOneFile(file, idx) {
            let uplFormData = new FormData();
            uplFormData.append(this.form.filesName, file);
            console.log(uplFormData);
        console.log("Uploading to " + this.form.uploadURL);
        console.log("Uploading file name" + this.form.filesName);
            let self = this;
            let options = {
            headers: {
                "Content-Type": "multipart/form-data"
            },

                onUploadProgress: function(e) {
                    let perc = parseInt(e.progress * 100);
                    console.log(perc + " is the percentage uploaded");
                    self.progressBars[idx].set(perc);
                    file.bytesSent = this.humanFileSize(e.progress * size);
                    file.eta = e.estimated;
                    file.rate = (e.rate / 1024 / 1024).toFixed(2);
                }
            };

            if (this.authEnabled) {
                var username = "user";
                var password = "password";
                var basicAuth = "Basic " + btoa(username + ":" + password);
                options["headers"] = {
                    "Authorization": +basicAuth
                };
            }
            console.log("Uploading to " + this.form.uploadURL);
            axios.post(this.form.uploadURL, uplFormData, options).then((resp) => {
                this.spitStatistics(self, idx);
            }).catch((error) => {
                alert("Upload failed. Please check endpoint in Setup");
                alert(error);
            });
        },

        uploadAll() {
            console.log("Starting upload...");
            this.startUploadts = Date.now();
            for (let i = 0; i < this.uploadFileInfos.length; i++) {
                let f = this.uploadFileInfos[i];
                this.uploadOneFile(f, i);
            }
        },
        saveConfig(e) {

            e.preventDefault();

        console.log(this.form.uploadURL);
        console.log(this.form.filesName);
        console.log(this.form.progType);

        if (this.form.authEnabled) {
            console.log(this.form.authType);
            console.log(this.form.user, inputs.pass);
        }
        console.log(this.form.fileSizeLimit);
        console.log(this.form.sizeLimitType);
        console.log(this.form.fileTypeFilter);
        console.log(this.form.fileTypeAction);

        },

        async testUpload() {
            console.log("Uploading using HTML5 File API...");
            let testForm = new FormData();

            const blob = new Blob(['Test upload DELETE'], {
                type: "plain/text"
            });
            testForm.append(this.form.filesName, blob, "progress-up-test.txt");
            let options = {};
            if (this.authEnabled) {
                var username = "user";
                var password = "password";
                var basicAuth = "Basic " + btoa(username + ":" + password);
                options = {
                    headers: {
                        "Authorization": +basicAuth
                    }
                };
            }

            console.log("Upload test to " + this.form.uploadURL);
            await axios.post(this.form.uploadURL, testForm, options).then((resp) => {
                alert("Test succeeded");
            }).catch((error) => {
                alert("Upload failed. Please check endpoint in Setup");
                alert(error);
            });
        },

        testEP(e) {
            e.preventDefault();
            this.saveConfig(e);
            this.testUpload();
        },

        setIndicator() {
            var progType = this.form.progType;
            console.log(progType);
            switch (progType) {
                case "Bubble":
                    var extra = "data-img-size=\"100,100\"";
                    break;
                case "Rainbow":
                    var extra = "data-stroke=\"data:ldbar/res,gradient(0,1,#f99,#ff9)\"";
                    break;
                default:
                    break;
            }
        },
        clearAll() {
            this.details = "";
            this.uploadFileList = [];
            this.uploadFileInfos = [];
            this.errInfos = [];
            this.progressBars = [];
            this.totalfiles = 0;
            this.totalsize = 0;
            this.totaltime = 0;

            this.disableUpload = true;
            console.log("Cleared");

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

        fileSelectFinish(evt) {
            let selectedFiles = evt.target.files;
            this.clearAll();
            this.uploadFileList = selectedFiles;
            this.setupUpload();
        },

        humanFileSize(size) {
            const i = Math.floor(Math.log(size) / Math.log(1024));
            let t2 = size / Math.pow(1024, i);
            let t = t2.toFixed(2) * 1;
            const ret = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
            return (ret);
        },
        toggleTabs(tabNumber) {
            this.openTab = tabNumber
        },

        applyFilter() {
            filt = this.form.fileFilter.value;
            filtType = this.form.filterAction;
            console.log(filt, filtType);
            switch (filt) {
                case "All":
                    break;
                case "PDF only":
                    filtFiles = {
                        "type": "application/pdf",
                        "action": action
                    };
                    break;
                case "Image only":
                    filtFiles = {
                        "type": "image",
                        "action": action
                    };
                    break;
                case "Video only":
                    filtFiles = {
                        "type": "video",
                        "action": action
                    };
                    break;
                case "Audio only":
                    filtFiles = {
                        "type": "audio",
                        "action": action
                    };
                    break;
                case "Zip only":
                    filtFiles = {
                        "type": "application/zip",
                        "action": action
                    };
                    break;
                case "Text only":
                    filtFiles = {
                        "type": "text",
                        "action": action
                    };
                    break;
                default:
                    console.log("Filter not understood");
                    break;
            }
        },

        toggleSizeQ() {
            var sizeLabel = "Single file limit";
            val = this.form.sizeLimitType;
            if (val.checked === true) {
                sizeLabel = "Total limit";
            } else {
                sizeLabel = "Single file limit";
            }
        },

        toggleFilterQ() {
            var filterLabel = "Allow file type";
            val = this.form.fileTypeAction;
            if (val.checked === true) {
                filterLabel = "Deny file type";
            } else {
                filterLabel = "Allow file type";
            }
        },

        wordCount(val) {
            var wom = val.match(/\S+/g);
            return {
                chars: val.length,
                words: wom ? wom.length : 0,
                lines: val.split(/\r*\n/).length
            };
        },

        checkFilter(mime) {
            /* No filter XXX */
            if (filtFiles.type == 'all') {
                console.log("No file type filters active");
                return true;
            }
            if (mime.match(filtFiles.type) && filtFiles.action == "allow") {
                return true;
            }
            if (mime.match(filtFiles.type) && filtFiles.action == "deny") {
                return true;
            }
            return false;
        },

    checkSize(size) {
        if (size <= (this.form.fileSizeLimit * 1024 * 1024)) {
            return true;
        }
        return false;
    },

    checkTotalSize() {
        if (this.sizeLimitType == "Total limit") {
            if (totalsize <= (this.form.fileSizeLimit * 1024 * 1024)) {
                return true;
            }
            return false;
        }
        return false;
    },

    showThumbnail(f, i) {
        let id = 'a' + i;
	let target = id + '-thumb';
        switch (true) {
            case /text/.test(f.type):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(f) {
                    return function(e) {
                        txt = e.target.result;
                        let wc = this.wordCount(txt);
                        f.meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = txt.split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");

                        var fileIcon = this.fileTypeIcons[type];
                        let pic = "src/assets/icons/filetypes/" 
				+ fileIcon, 
			f.thumb = [
                 '<img width="125" height="125" src=',
		pic,
		'title="',
		txt
		'" alt="', 
		f.name,
		'" class="w-12 h-12" />'].join('');

                    };
                })(f);
                reader.readAsText(f);
                break;
            case /image/.test(f.type):
                console.log("Image type detected");
                var reader = new FileReader();
                // Closure to capture the file information.  
                reader.onload = (function(theFile) {
                    return function(e) {
                        e.target.result,

			f.thumb = [
                 '<img width="125" height="125" src=',
		pic,
		'title="',
		txt
		'" alt="', 
		f.name,
		'" class="w-12 h-12" />'].join('');
                 <img width="125" height="125" src="{{file.imagesrc}}" title="{{file.name}}" alt="{{file.name}}" class="w-12 h-12" />
			    f.meta = txt;
                    };
                })(f);
                reader.readAsDataURL(f);
                break;
            case /audio/.test(f.type):
                console.log("Audio type detected");
                var audioUrl = window.URL.createObjectURL(f);
		f.thumb = [
		'<audio controls width="125" height="125"> <source src="'
		audioUrl,
		'title="',
		f.name,
		'" alt="', 
		f.name,
		'" class="h-9 w-9"> </source> </audio> />'].join('');
		f.meta = f.name;
                break;
            case /video/.test(f.type):
                console.log("Video type detected");
                var videoUrl = window.URL.createObjectURL(f);
		f.thumb = [
		'<video controls width="125" height="125"> <source src="'
		videoUrl,
		'title="',
		f.name,
		'" alt="', 
		f.name,
		'" class="h-9 w-9"> </source> </video> />'].join('');
		f.meta = f.name;
                break;
            case /pdf/.test(f.type):
                console.log("PDF type detected");
                var pdfURL = window.URL.createObjectURL(f);
                var id = id + '-pdf';
			    f.meta = txt;
                PDFObject.embed(pdfURL, target);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[type];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
		f.meta = f.name;
                let pic = "src/assets/icons/filetypes/" + fileIcon; 
		f.thumb = [
                 '<img width="125" height="125" src=',
		pic,
		'title="',
		f.name
		'" alt="', 
		f.name,
		'" class="w-12 h-12" />'].join('');
                break;
        }
    },



        createBars() {
            for (var i = 0; i < uploadFileInfos.length; i++) {
		f = uploadFileInfos[i];
                var selector = '#a' + i;
                var bar = new ldBar(selector, {
                    preset: progType.toLowerCase()
                });
                bar.set(0);
                progressBars.push(bar);
        	showThumbnail(f, i);
            }
        },

    printBannedBanner(file, msg) {
        this.errInfos.push({
            file: File,
            meta: '',
            msg: msg
        });
    },

setupUpload() {
    var delQ = [];
    for (var i = 0; i < uploadFileList.length; i++) {
        let f = uploadFileList[i];
        let mime = f.type;
        let name = f.name;
        let ts = f.lastModifiedDate.toLocaleDateString();
        totalsize += f.size;
        let size = humanFileSize(f.size);
        let id = 'a' + i;
        if (!checkSize(f.size)) {
            console.log("Size check:: size is " + f.size);
            msg = `${name} too big for upload`;
            console.log(msg);
            printBannedBanner(f, msg);
            delQ.push(i);
            continue;
        }
        if (!checkFilter(mime)) {
            console.log("Hit banned file type:: filter issue");
            msg = `${name} cannot be uploaded due to policy.`;
            printBannedBanner(f, msg);
            delQ.push(i);
            continue;
        }
        if (i == uploadFileList.length - 1) {
            console.log("Total size check:: total size is " +
                totalsize);
            if (!checkTotalSize()) {
                msg = `Total size exceeds policy, delete some`;
                this.disableUpload = true;
            }
        }
        totalfiles += 1;
        this.uploadFileInfos.push({
                file: f,
                id: id,
                meta: '',
                bytesSent: 0,
                eta: 0,
                rate: 0,
        });
    }
    this.uploadFileList = this.uploadFileList.filter(function(value, index) {
        return delQ.indexOf(index) == -1;
    });
    createBars();
    this.disableUpload = false;
},
        delItem(index) {
            let list = [...this.uploadFileList];
            list.splice(index, 1);
            this.uploadFileList = list;
            this.uploadFileInfos = list;
            this.totalsize -= this.upLoadFileList[index].size;
            this.checkTotalSize();
        },
    }
};

</script>

<template>

<section class="dark:bg-gray-800 dark:text-white">
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

<h2 class="text-5xl leading-tight">  HTML5 Multiple File Upload with Progress Bar 
</h2>
	<h3 class="flex justify-center text-3xl text-gray-100 mb-4 pb-4">Vue plugin </h3>


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

	<div id='progress-up-statsArea'>
		<h2 className="text-5xl leading-tight border-b">{{details}} </h2>
	</div>


	<div id='progress-up-form' class="bg-light p-4 rounded mx-auto">
    	  <div @click="openFileBrowser" :class="{'bg-blue-400': dragging, 'bg-white': !dragging}"
@dragenter="onDragEnter" @dragleave="onDragLeave"
@dragover.prevent @drop.stop.prevent @drop="onDrop" @dragover="dragover" class="text-gold-400 border border-red-800 border-dashed rounded cursor-pointer">
	   <form class='flex p-8 justify-center'>
		<img class="stroke-white dark:bg-white" width="100" height="100"
src="./assets/icons/upload/file-submit.svg" alt="progress-up file submit icon" />
	       <input ref="fileInput" @change="fileSelectFinish" name="uploadFiles" type="file" multiple hidden>
	   </form>
	   <h2 class="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>


	<div id="config">
		<h2 className="leading-tight pb-2">
	  <div v-if="form.uploadURL && form.filesName">
			&#128202; Progress type <span
className='text-sm'>{{form.progType}}</span>  
			 &#128228; Upload URL <span
className='text-sm'>{{form.uploadURL}}</span> 
		&#128218; FilesName <span
className='text-sm'>{{form.filesName}}</span>
	   </div>
           <div v-else>
		Please configure first
	   </div>
		</h2>
	</div>

	<button id="upButton" @click="uploadAll" class="inline-block
px-6 py-2.5 bg-blue-400 text-dark dark:text-white font-medium text-xs
leading-tight uppercase rounded shadow-md hover:bg-blue-500
hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none
focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150
ease-in-out" :class="(disableUpload ?  'opacity-20':'')"
>Begin Uploading files
	</button>
	
	<button type="button" @click="clearAll" class="inline-block
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
	         <input type="text" v-model="form.uploadURL" class="appearance-none block w-full bg-gray-200
	   text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	   focus:outline-none focus:bg-light" placeholder="URL to post [cross origin or absolute URL needs CORS]">
	         <p class="text-red-500 text-xs italic">Please fill out this field.</p>
	       </div>
	   
	       <div class="w-full md:w-1/2 px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-filesName">
	   	Name of files input field
	         </label>
	         <input v-model="form.filesName" class="appearance-none block w-full bg-gray-200
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
	           <select v-model='form.progType' @change="setIndicator()" class="block appearance-none w-full bg-gray-200 border
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
<label class="relative flex justify-between items-center p-2 text-xl"
for="fileSizeLimit" >
<span>File Size Limit (MB)</span>
  <input v-model="fileSizeLimit" class='m-6 p-6 form-range'
type="range"  name="rangeInput" min="10" max="1000"
step=10 value="0" @change="sizeLimit.value=rangeInput.value">                      
<output id="sizeLimit" name="sizeLimit" for="fileSizeLimit">10</output>
	</div>
	</div>

	      <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">

<label class="relative flex justify-between items-center p-2 text-xl"
for="sizeToggle" >
<span>{{sizeLabel}}</span>
  <input v-model="sizeToggle" @change="toggleSizeQ()" type="checkbox" class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span class="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-blue-600 rounded-full duration-300 ease-in-out peer-checked:bg-yellow-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>
	</div>
	</div>



	      <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	         <label class="block uppercase tracking-wide text-dark-700 text-xs
	   font-bold mb-2" for="progress-up-indicator">
	          File type Filters 
	         </label>
	         <div class="relative">
	           <select v-model='progress-up-filter'
 class="block appearance-none w-full bg-gray-200 border
	   border-gray-200 text-dark-700 py-3 px-4 pr-8 rounded leading-tight
	   focus:outline-none focus:bg-light focus:border-gray-500"
	   >
	   			<option default>All</option>
	   			<option>PDF only</option>
	   			<option>Image only</option>
	   			<option>Video only</option>
	   			<option>Audio only</option>
	   			<option>Zip only</option>
	   			<option>Text only</option>
	           </select>
	           <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	             <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	           </div>
	         </div>
	       </div>
	      </div>

<label class="relative flex justify-between items-center p-2 text-xl"
for="filterAction" >
<span>{{filterLabel}}</span>
  <input v-model="filterAction" @change="toggleFilterQ()" type="checkbox" class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
  <span class="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1
bg-green-600 rounded-full duration-300 ease-in-out peer-checked:bg-red-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
</label>

	     <div class="flex flex-wrap -mx-3 mb-6">
	       <div class="w-full px-3">
	       <label class="md:w-2/3 block text-dark-500 font-bold">
	         <span class="text-sm">
	           HTTP Auth required?
	         </span>
	         <input v-model='authEnabled' class="mr-2 leading-tight" type="checkbox">
	       </label>
	      </div>
	     </div>
	   
             <div :class="(authEnabled ?'block':'hidden')" id='progress-up-authsection'>
	        <div class="flex flex-wrap -mx-3 mb-6">
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs font-bold mb-2" >
	              Auth type
	            </label>
	            <div class="relative">
	              <select v-model='form.authType' class="block
appearance-none w-full bg-gray-200 border border-gray-200 text-dark-700
py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-light focus:border-gray-500" >
	                <option default>HTTP basic auth</option>
	                <option>HTTP digest auth</option>
	              </select>
	       
	              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-700">
	                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
	              </div>
	            </div>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2">
	             Username  
	            </label>
	            <input v-model='form.user' class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight
	      focus:outline-none focus:bg-light"  type="text"
	      placeholder="username">
	            <p class="text-red-500 text-xs italic">Please fill out this field.</p>
	          </div>
	      
	          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
	            <label class="block uppercase tracking-wide text-dark-700 text-xs
	      font-bold mb-2">
	      	Password
	            </label>
	            <input v-model='form.pass' class="appearance-none block w-full bg-gray-200
	      text-dark-700 border border-gray-200 rounded py-3 px-4 leading-tight
	      focus:outline-none focus:bg-light focus:border-gray-500"
	       type="password" placeholder="Password">
	          </div>
	         </div>
 	   </div>
	   
	   <button @click="saveConfig" class="inline-block px-6
	py-2.5 bg-red-600 text-dark dark:text-white font-medium text-xs leading-tight uppercase
	rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700
	focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800
	active:shadow-lg transition duration-150 ease-in-out">Save</button>
	   
	   <button  @click="testEP" class="inline-block
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


	            <tr v-for="(stat,id) in statsTable" :key="id" class="bg-gray-100 border-b">
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"> {{stat.id}}</td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {{stat.ts}}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   <span v-html="stat.status"></span>
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   {{stat.details}}
	              </td>
	            </tr>

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
		<div  v-html="file.thumb" id="{{file.id}}" + '-thumb'></div>
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
       	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
		    Metadata: {{file.meta}}

      	    <li class="text-xl font-light leading-relaxed text-gray-800
    dark:text-white">

		<span>{{bytesSent}} of {{Mysize}} uploaded  {{rate}} MB/s ETA ${eta} s</span>
          	    </li>
     
              </ul>
            </div>
           </div>
      </div>
          <div class='ldBar bottom-0 right-0 pb-8' :id="file.id" >
	  </div>
      </div>
    </section>
  </div>
</div>



  <div id="progress-up-errArea"> 
    <div v-for="(err,id) in errInfos; last as lastTime;index as id " >
      <section class="bg-red-200 m-4 p-4 mt-4 mb-4 transition-colors
  text-light-100 dark:text-white">
   <div class="bg-red-600 dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">
  
      <div title="Removed from uploads" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
            <img width="25" height="25"
  src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" />
      </div>
  
      <div class="flex flex-wrap -mx-2 mb-8">
        <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
           <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
		<div  v-html="err.thumb" id="{{err.id}}" + '-thumb'></div>
           </div>
        </div>
        <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
          <div class="h-12  text-grey-dark flex items-left justify-left">
           <ul>
        	    <li  class="font-light leading-relaxed text-gray-800
  dark:text-white">
        	    Name: {{err.name}}
        	    </li>
        	    <li class=" font-light leading-relaxed text-gray-800
  dark:text-white">
        	    Date: {{err.ts}}
        	    </li>
        	    <li class=" font-light leading-relaxed text-gray-800
  dark:text-white">
        	    Type: {{err.mime}}
        	    </li>
        	    <li class="font-light leading-relaxed text-gray-800
  dark:text-white">
        	    Size: {{err.size}} 
        	    </li>
        	    <li class="font-light leading-relaxed text-gray-800
  dark:text-white"> Metadata: {{err.meta}}
        	    </li>
           </ul>
          </div>
         </div>
  
        <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
           <div class="h-12 text-lg text-grey-dark flex items-left justify-left">
  		{{err.msg}}
           </div>
  	 
        </div>
      </div>
  
      </section>
    </div>
  </div>

</section>

</template>


<style scoped>
@import url("https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/progress-up.css");
</style>
