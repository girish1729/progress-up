<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js" ></script>
	<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" ></script>
	<script  src="https://cdn.jsdelivr.net/npm/pdfobject@2.2.8/pdfobject.min.js" ></script>
</svelte:head>

<script lang='ts'>
   import ldBar from 'https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/progressBar/loading-bar.js';
   import {afterUpdate} from 'svelte';
   import {inputs, totalsize, totalfiles, statsTable, progressBars,
errInfos, uploadFileInfos, uploadFileList, errMsg } from './store.js';
  let isUploadDisabled = true;
  let browseInput;
  let details = '';
  let startUploadts = 0;
  let thumbNailsDone = false;


   
  let isDragActive = false;
 function handleDragEnter(e) {
	isDragActive = true;
    }

    function handleDragLeave(e) {
	isDragActive = false;
    }


    function handleDragDrop(e) {
        e.preventDefault();
        dropFiles = e.dataTransfer.files;
    	$uploadFileList = dropFiles;
    	setupUpload();
    }

    function handleDragEnd(e) {
    e.dataTransfer.dropEffect = 'copy';
    }

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

    let progress: any = {};
    let showProgress: boolean = true;
    let sizeLabel:string =  "Single file limit";
    let filterLabel:string =  "Allow file type";

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(inputs);
    };

   afterUpdate(() => {
        createBars();
	errInfos.set([...$errInfos]);
	uploadFileInfos.set([...$uploadFileInfos]);
	 if(($inputs.uploadURL.length > 3) && ($inputs.filesName.length > 3)) {
            console.log('Enable upload button if Files in Q');
            if (uploadFileInfos && uploadFileInfos.length > 0) {
                console.log('Enabled upload button');
            	isUploadDisabled = false;
            } else {
            	isUploadDisabled = true;
	    }
        } else {
            console.log('Disable upload without configuration');
            isUploadDisabled = true;
        }

        console.log("DOM Updated");
   })

    const uploadOneFile = async (info: any, idx: number) => {
        let formData = new FormData();
        formData.append($inputs.filesName, info.file);
        let fname = info.file.name;
        console.log("Uploading to ::" + $inputs.uploadURL);
        console.log("Uploading file name ::" + $inputs.filesName);
       let options = {
            headers: {
                "Content-Type": "multipart/form-data",
		Authorization: ""
            },
            onUploadProgress: (progE:any) => {
                let perc: number;
                if (progE.total) {
                    perc = (progE.loaded / progE.total) * 100;
                    $progressBars[idx].set(perc);
                    info.bytesSent = humanFileSize(progE.progress * info.file.size);
                    info.eta = progE.estimated;
                    info.rate = (progE.rate / 1024 / 1024).toFixed(2);

                    console.log(info.bytesSent, info.eta, info.rate, perc);
	            uploadFileInfos.set([...$uploadFileInfos]);
                }
            },
	};

            if ($inputs.authEnabled) {
                var username = "user";
                var password = "password";
                var basicAuth = "Basic " + btoa(username + ":" + password);
                options["headers"] = {
                    "Content-Type": "multipart/form-data",
                    "Authorization": basicAuth
                };
            }

        await axios.post($inputs.uploadURL, formData, options).then(function() {
            spitStatistics(idx);
            console.log("All files uploaded");
	    thumbNailsDone = true;
            }).catch((error) => {
                alert("Upload failed. Please check endpoint in Setup");
                alert(error);
            });
 
    };

    const uploadAll = () => {
        startUploadts = Date.now();
        if ($uploadFileInfos) {
            for (let i = 0; i < $uploadFileInfos.length; i++) {
                let info = $uploadFileInfos[i];
                uploadOneFile(info, i);
            }
        }
    };

    const fileSelectFinish = (e: any) => {
        let files = e.target.files;
        console.log(files);
        $uploadFileList = files;
        setupUpload();
    };


    const humanFileSize = (size: number) => {
        const i: any = Math.floor(Math.log(size) / Math.log(1024));
        let t2: any = size / Math.pow(1024, i);
        let t: any = t2.toFixed(2) * 1;
        const ret: string = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    };


    const spitStatistics = (idx: number) => {
        if ($uploadFileInfos && idx == $uploadFileInfos.length - 1) {
            let endUploadts = Date.now();
            let totaltime = endUploadts - startUploadts;
            let tsize = humanFileSize($totalsize);

            var ts = new Date().toLocaleString();
            var tot = $uploadFileInfos.length;
            var status = $totalfiles == tot ? true : false;

            details = $totalfiles + '/' + tot +
                " files size " + tsize +
                " sent in " + totaltime + " ms";

            var id = $statsTable.length + 1;
            let stat = {
                id: id,
                ts: ts,
                status: status,
                details: details
            };
	    statsTable.set([...$statsTable,stat]);
            isUploadDisabled = true;
            $progressBars = [];
	    $totalfiles = 0;
	    $totalsize = 0;
        }
    };

   const reloadAll = () => {
        details = "";
	$uploadFileInfos = [];
        $errInfos = [];
        $progressBars = [];
        isUploadDisabled = true;
	$totalfiles = 0;
	$totalsize = 0;
	thumbNailsDone = false;
        console.log("Reload ");
   };

    const clearAll = () => {
        details = "";
	$uploadFileInfos = [];
	$uploadFileList = [];
        $errInfos = [];
        $progressBars = [];
        isUploadDisabled = true;
	$totalfiles = 0;
	$totalsize = 0;
	$errMsg = '';
	thumbNailsDone = false;
        console.log("Cleared");
    };

    const wordCount = (val:string) => {
        var wom = val.match(/\S+/g);
        return {
            chars: val.length,
            words: wom ? wom.length : 0,
            lines: val.split(/\r*\n/).length
        };
    };


    const checkFilter = (mime:string) => {
	console.log($inputs.filtFiles.type);
	console.log($inputs.filtFiles.action);
        /* No filter XXX */
        if ($inputs.filtFiles.type == 'all') {
            console.log("No file type filters active");
            return true;
        }
        if ($inputs.filtFiles.action == "allow" && mime.match($inputs.filtFiles.type) ) {
            return true;
        }
        if ($inputs.filtFiles.action == "deny" && !mime.match($inputs.filtFiles.type) ) {
            return true;
        }
        return false;
    };
    const checkSize = (size) => {
            console.log("Size check:: size is " +
		humanFileSize(size));
            if (sizeLabel == "Single file limit") {
            	console.log("Single file limit");
                if (size <= ($inputs.fileSizeLimit * 1024 * 1024)) {
                    return true;
                }
            	console.log("Single file limit exceeded");
                return false;
            }
            console.log("Total limit");
            return true;
        };
        const checkTotalSize = () => {
            console.log("Total size check:: total size is " +
              humanFileSize($totalsize));
            console.log("Allowed size is :: " +
              humanFileSize($inputs.fileSizeLimit * 1024 * 1024));
            if (sizeLabel == "Total limit") {
                if ($totalsize <= ($inputs.fileSizeLimit * 1024 * 1024)) {
		    $errMsg = '';
                    isUploadDisabled = false;
                    return true;
                }
                isUploadDisabled = true;
                $errMsg = "Total size exceeds policy, delete some files";
            	console.log("Total file limit exceeded");
                return false;
            }
            return true;
        },

    const printBannedBanner = (file:File, id: string, ts:string,
msg:string)  => {
        $errInfos.push({
            file: file,
            id: id,
            meta: '',
            thumb: '',
            ts: ts,
            msg: msg
        });
    };

const showThumbnail = (f:fileInfo, i: number, cb) => {
	console.log("creating thumb for " + f.file.name);
        let id = 'a' + i;
        let target = id + '-thumb';
	let type = f.file.type.split('/')[0];
        switch (true) {
            case /text/.test(f.file.type):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let res:any;
			if(e.target) {
                        	res = e.target.result;
			}
                        let wc = wordCount(res);
                        f.meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = (<string>res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");
                        var fileIcon = fileTypeIcons[type];
                        let pic = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" +
                            fileIcon;
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                txt,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join('');
			cb(i);
                    };
                })(f.file);
                reader.readAsText(f.file);
                break;
            case /image/.test(f.file.type):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let pic:any;
			if(e.target) {
                        	pic = e.target.result;
			}
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                locf.name,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join(''); 
                            f.meta = locf.name;
			    cb(i);
                    };
                })(f.file);
                reader.readAsDataURL(f.file);
                break;
            case /audio/.test(f.file.type):
                console.log("Audio type detected");
                var audioUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<audio controls class="h-9 w-9" width="125" height="125"> ',
		    '<source src="',
                    audioUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </audio>'
                ].join('');
                f.meta = f.file.name;
		cb(i);
                break;
            case /video/.test(f.file.type):
                console.log("Video type detected");
                var videoUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<video controls class="h-9 w-9" width="125" height="125">',
		    '<source src="',
                    videoUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </video> '
                ].join('');
                f.meta = f.file.name;
		cb(i);
                break;
            case /pdf/.test(f.file.type):
                console.log("PDF type detected");
                var pdfURL = window.URL.createObjectURL(f.file);
                f.meta = f.file.name;
		target = document.getElementById(id + '-thumb');
                PDFObject.embed(pdfURL, target);
		cb(i);
                break;
            default:
                console.log("default type detected");
                var fileIcon = fileTypeIcons[type];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                f.meta = f.file.name;
                let pic = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" + fileIcon;
                f.thumb = [
                    '<img width="125" height="125" src=',
                    pic,
                    '" title="',
                    f.file.name,
		    '" alt="',
                    f.file.name,
                    '" class="w-12 h-12" />'
                ].join('');
		cb(i);
                break;
        }
    };

    const createBars = () => {
	console.log(thumbNailsDone);
        if (thumbNailsDone) {
	    console.log("Returning immediately");
            return;
        }
        for (var i = 0; i < $uploadFileInfos.length; i++) {
            let f = $uploadFileInfos[i];
            let id = 'a' + i;
            let bar = new ldBar('#' + id, {
                preset: $inputs.progType.toLowerCase()
            });
            bar.set(0);
            console.log("Creating progress bar::" + id);
            progressBars.set([...$progressBars,bar]);
            showThumbnail(f, i, function(i) {
		if(i == $uploadFileInfos.length - 1) {
        	thumbNailsDone = true;
		console.log("All thumbnails done");
		}
	        uploadFileInfos.set([...$uploadFileInfos]);
	    });
        }
        for (var i = 0; i < $errInfos.length; i++) {
            let f = $errInfos[i];
            showThumbnail(f, i, function(i) {
		if(i == $errInfos.length - 1) {
        	thumbNailsDone = true;
		console.log("All thumbnails done");
		}
	        errInfos.set([...$errInfos]);
	    });
        }
    };

    const setupUpload = () => {
	reloadAll();
        var delQ:number[] = [];
	if(!$uploadFileList) {
		return;
	}
        for (var i = 0; i < $uploadFileList.length; i++) {
            let f = $uploadFileList && $uploadFileList[i];
            let mime = f.type;
            let name = f.name;
            let ts = f.lastModifiedDate.toLocaleDateString();
            let size = humanFileSize(f.size);
            let id = 'a' + i;
            $totalsize  += f.size;
            if (!checkSize(f.size)) {
                console.log("Size check:: size is " + f.size);
                let msg = name + " too big for upload";
                console.log(msg);
            	printBannedBanner(f, id, ts, msg);
                delQ.push(i);
                continue;
            }
            if (!checkFilter(mime)) {
                console.log("Hit banned file type:: filter issue");
                let msg = name + " cannot be uploaded due to policy.";
            	printBannedBanner(f, id, ts, msg);
                delQ.push(i);
                continue;
            }
		
            if ($uploadFileInfos && i == $uploadFileInfos.length - 1) {
                console.log("Total size check:: total size is " +
                    $totalsize);
                if (!checkTotalSize()) {
                    let msg = `Total size exceeds policy, delete some`;
                    isUploadDisabled = true;
                }
            }
            $totalfiles += 1;
        }

var tmpFileList = Array.from($uploadFileList).filter(function(value, index) {
                return delQ.indexOf(index) == -1;
            });
	    console.log(tmpFileList);
            for (var i = 0; i < tmpFileList.length; i++) {
                let f = tmpFileList[i];
                let mime = f.type;
                let name = f.name;
                let ts = f.lastModifiedDate.toLocaleDateString();
                let size = humanFileSize(f.size);
                let id = 'a' + i;
   
            let fInfo; 
            fInfo = {
                file: f,
                size: size,
                id: id,
                thumb: '',
                meta: '',
                bytesSent: '0 Bytes',
                eta: '0',
                ts: ts,
                rate: '0',
            };
	    uploadFileInfos.set([...$uploadFileInfos,fInfo]);
	}
        isUploadDisabled = false;
    };
</script>

	<div id='progress-up-statsArea'>
		<h2 class="text-5xl leading-tight border-b">{details} </h2>
	</div>

	<div  class=" p-4 rounded mx-auto bg-light"> 
    	  <div 
	on:dragenter={handleDragEnter} 
	on:dragleave={handleDragLeave}  
	on:drop={handleDragDrop} 
	ondragover="return false"
        on:click={() => browseInput.click()}
class="{isDragActive ? 'bg-blue-400':'bg-light'} text-gold-400 border border-red-800 border-dashed
rounded cursor-pointer" >
	   <form class='flex p-8  justify-center'>
		<img class="stroke-white dark:bg-white" width="100" height="100"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/upload/file-submit.svg" alt="progress-up file submit icon" />
	       <input bind:this={browseInput} on:change={fileSelectFinish}  name="uploadFiles" type="file" multiple hidden />
	   </form>
	   <h2 class="flex justify-center text-dark-500 text-xl font-medium mb-2"> 
	     Drop files or click to select</h2>
	  </div>
	</div>


	
	<div class="flex justify-end">
	<button disabled={isUploadDisabled} on:click={uploadAll} class=" inline-block px-6
	py-2.5 bg-blue-400 text-dark dark:text-white font-medium leading-tight
	rounded shadow-md text-md hover:bg-blue-500 hover:shadow-lg
	focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0
	active:bg-blue-600 active:shadow-lg transition duration-150
ease-in-out mr-4 {isUploadDisabled ? ' opacity-50' : ''}" >Begin Upload </button>
	
<button type="button" on:click={clearAll} class=" inline-block
px-6 py-2.5 bg-orange-500 text-md text-dark dark:text-white
font-medium  leading-tight rounded shadow-md hover:bg-orange-600
hover:shadow-lg focus:bg-orange-600 focus:shadow-lg
focus:outline-none focus:ring-0 active:bg-orange-700 active:shadow-lg transition duration-150 ease-in-out">
	 Reset form
	</button>
	</div>

     <div id="config">

    {#if $inputs.uploadURL && $inputs.filesName}
		<h2 class="leading-tight pb-2">
	Please configure first
		</h2>
   {:else}
		<h2 class="leading-tight pb-2">
	&#128202; Progress type <span
class='text-sm'>{$inputs.progType}</span>  
		<br/>
			 &#128228; Upload URL <span
class='text-sm'>{$inputs.uploadURL}</span> 
		<br/>
		&#128218; FilesName <span
class='text-sm'>{$inputs.filesName}</span>
		</h2>
  {/if}

	</div>

 	<h3 class="text-red-500 text-3xl">
		{$errMsg}
	</h3>





