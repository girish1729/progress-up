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
var uploadFileInfos = [];
var errInfos = [];
/* stats variables */

var progressBars = [];
var statsTable = [];
var totalfiles = 0;
var totalsize = 0;
var totaltime = 0;
var startUploadts = 0;
var endUploadts = 0;

var errMsg = '';

const uplform = document.querySelector("#progress-up-form form");
var upBut = document.getElementById("upButton");
uplform.addEventListener("dragover", dragOver);
uplform.addEventListener("drop", drop );

uplform.addEventListener('dragenter', (e) =>
    e.target.classList.add('bg-blue-400')
);
uplform.addEventListener('dragleave', (e) =>
    e.target.classList.remove('bg-blue-400')
);

const fileInput = document.getElementById("progress-up-fileInput");
const progressArea = document.getElementById("progress-up-progressArea");
const errArea = document.getElementById("progress-up-errArea");
const errMsgArea = document.getElementById("progress-up-errMsgArea");
const statsArea = document.getElementById("progress-up-statsArea");
const configSummary = document.getElementById("progress-up-configSummary");

uplform.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({
    target
}) => fileSelectFinish(target);

function enableUploadButton() {
    upBut.removeAttribute('disabled');
    upBut.classList.remove('opacity-50');
}

function disableUploadButton() {
    upBut.setAttribute('disabled');
    upBut.classList.add('opacity-50');
}

function clearAll() {
    progressArea.innerHTML = '';
    statsArea.innerHTML = '';
    errArea.innerHTML = '';
    errMsgArea.innerHTML = '';
    configSummary.innerHTML = '';
    uploadFileInfos = [];
    progressBars = [];
    totalfiles = 0;
    totalsize = 0;
    totaltime = 0;

    upBut.disabled = true;
    console.log("Cleared");
}

function dragOver(evt) {
    evt.dataTransfer.dropEffect = 'copy';
    evt.dataTransfer.effectAllowed = 'all';
}

function drop(evt) {
    evt.preventDefault();
    evt.target.classList.remove('bg-blue-400')
    var dropFiles = event.dataTransfer.files;
    console.log(dropFiles);
    uploadFileList = dropFiles;
    console.log(uploadFileList);
    setupUpload();
}

function fileSelectFinish(target) {
    let selectedFiles = target.files;
    uploadFileList = selectedFiles;
    setupUpload();
}

function humanFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return ( (size / Math.pow(1024, i)).toFixed(2) * 1 +
        " " + ["B", "kB", "MB", "GB", "TB"][i]
    );
}

function setIconImage(name, type, title) {
    type = type.split('/')[0];
    console.log(type);
    var fileIcon = fileTypeIcons[type];
    if (fileIcon == undefined) {
        fileIcon = "file.svg";
    }
    var icon = [
        '<img width="125" height="125" src="',
        'https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/' + fileIcon,
        '" alt="', name,
        '" title="', title,
        '" class="h-9 w-9" />'
    ].join('');
    document.getElementById(name + '-thumb').innerHTML = icon;
}

function wordCount(val) {
    var wom = val.match(/\S+/g);
    return {
        chars: val.length,
        words: wom ? wom.length : 0,
        lines: val.split(/\r*\n/).length
    };
}

function figuretype(type) {
        if (type.includes('image')) {
            return 'image';
        } else if (type.includes('pdf')) {
            return 'pdf';
        } else if (type.includes('video')) {
            return 'video';
        } else if (type.includes('audio')) {
            return 'audio';
        } else if (type.includes('image')) {
            return 'image';
        } else if (type.includes('text')) {
            return 'text';
        }
    }

function showThumbnail(f, i) {
    let id = 'a' + i;
    let ftype = figuretype(f.file.type);
    switch (ftype) {
        case 'text':
            console.log("Text type detected");
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    txt = e.target.result;
                    wc = wordCount(txt);
                    meta = document.getElementById(`${id}-meta`);
                    meta.innerHTML = (`
			Metadata: 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
  			`);
                    var dataArray = txt.split("\n");
                    dataArray = dataArray.slice(0, 20);
                    txt = dataArray.join("\n");
                    setIconImage(f.file.name, f.file.type, txt);
                };
            })(f.file);
            reader.readAsText(f.file);
            break;
        case 'image':
            console.log("Image type detected");
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
                    document.getElementById(theFile.name + '-thumb').innerHTML = thumb;
                };
            })(f.file);
            reader.readAsDataURL(f.file);
            break;
        case 'audio':
            console.log("Audio type detected");
            var audioUrl = window.URL.createObjectURL(f.file);

            var icon = [
                '<audio controls width="125" height="125"><source src="',
                audioUrl,
                '" title="', name,
                '" alt="', name,
                '" class="h-9 w-9" </source> </audio>'
            ].join('');
            document.getElementById(f.name + '-thumb').innerHTML = icon;
            break;
        case 'video':
            console.log("Video type detected");
            var videoUrl = window.URL.createObjectURL(f.file);

            var icon = [
                '<video controls width="125" height="125"><source src="',
                videoUrl,
                '" title="', name,
                '" alt="', name,
                '" class="h-9 w-9"</source> </video>'
            ].join('');
            document.getElementById(f.name + '-thumb').innerHTML = icon;
            break;
        case 'pdf':
            console.log("PDF type detected");
            var pdfURL = window.URL.createObjectURL(f.file);
            var loc = document.getElementById(f.file.name + '-thumb');
            PDFObject.embed(pdfURL, loc);
            break;
        default:
            console.log("default type detected");
            setIconImage(f.file.name, f.file.type, f.file.name);
            break;
    }
}

function checkFilter(mime) {
    /* No filter XXX */
    if (filtFiles.type == 'all') {
        console.log("No file type filters active");
        return true;
    }
    if (filtFiles.action == "allow" && mime.match(filtFiles.type)  ) {
        return true;
    }
    if ( filtFiles.action == "deny" && !mime.match(filtFiles.type) ) {
        return true;
    }
    return false;
}

function checkSize(size) {
            console.log("Size check:: size is " +
		humanFileSize(size));
    const label = document.querySelector("#progress-up-sizeToggle");
            if (label.textContent == "Single file limit") {
            	console.log("Single file limit");
                if (size <= (fileSizeLimit * 1024 * 1024)) {
                    return true;
                }
            	console.log("Single file limit exceeded");
                return false;
            }
            console.log("Total limit");
            return true;
        }

function checkTotalSize() {
            console.log("Total size check:: total size is " +
              humanFileSize(totalsize));
            console.log("Allowed size is :: " +
              humanFileSize(fileSizeLimit * 1024 * 1024));
    const label = document.querySelector("#progress-up-sizeToggle");
            if (label.textContent == "Total limit") {
                if (totalsize <= (fileSizeLimit * 1024 * 1024)) {
		    errMsgArea.innerHTML = '';
		    enableUploadButton();
                    return true;
                }
		    disableUploadButton();
                    return true;
                errMsgArea.innerHTML = `Total size exceeds policy, delete some files`;
            	console.log("Total file limit exceeded");
                return false;
            }
            return true;
        }

function printBannedBanner(errHTML, file, id, name, mime, ts, size, msg) {

    errInfos.push({
                file: file,
                id: id,
                meta: '',
                size: size,
                thumb: '',
                ts: ts,
                msg: msg
            });
        
    errHTML.push(
        `
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
		<div id="${name}-thumb"></div>
         </div>
      </div>
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12  text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: ${name}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: ${ts}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: ${mime}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: ${size} 
      	    </li>
      	    <li id="${id}-meta" class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    </li>
         </ul>
        </div>
       </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-lg text-grey-dark flex items-left justify-left">
		${msg}
         </div>
	 
      </div>
    </div>

 </div>
</section>
`);

}

function createBars() {
    for (var i = 0; i < uploadFileInfos.length; i++) {
        var selector = '#a' + i;
        var bar = new ldBar(selector, {
            preset: progType.toLowerCase()
        });
        bar.set(0);
        progressBars.push(bar);
    }
}

function createThumbnails() {
    for (var i = 0; i < uploadFileInfos.length; i++) {
        f = uploadFileInfos[i];
        showThumbnail(f, i);
    }
    for (var i = 0; i < errInfos.length; i++) {
        f = errInfos[i];
        showThumbnail(f, i);
    }

}

function createSection(prog, id, i, name, ts, mime, size) {
    prog.push(
        `
<section id="${id}-section" class="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div  onClick="delItem(${i})" title="Delete" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25" src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/trash-icon.svg" />
    </div>

    <div class="flex -mx-2 mb-8">
      <div class="w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
		<div id="${name}-thumb"></div>
         </div>
      </div>

      <div class="w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: ${name}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: ${ts}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: ${mime}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: ${size} 
      	    </li>
      	    <li id="${id}-meta" class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    </li>
      	    <li id="${id}-prog" class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    </li>
         </ul>
        </div>
       </div>

      <div class="w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="text-sm text-grey-dark flex items-left justify-left">
    		<div class='ldBar' id="${id}" ></div>
         </div>
      </div>
	 
      </div>
    </div>

 </div>
</section>
`);
}

function setupUpload() {
    clearAll();
    var progressHTML = [];
    var errHTML = [];
    var delQ = [];
    for (var i = 0; i < uploadFileList.length; i++) {
        let f = uploadFileList[i];
        let mime = f.type;
        let name = f.name;
        let ts = f.lastModified.toLocaleString();
        totalsize += f.size;
        let size = humanFileSize(f.size);
        let id = 'a' + i;
        if (!checkSize(f.size)) {
            console.log("Size check:: size is " + f.size);
            msg = `${name} too big for upload`;
            console.log(msg);
            printBannedBanner(errHTML, f, id, name, mime, ts, size, msg);
            delQ.push(i);
            continue;
        }
        if (!checkFilter(mime)) {
            console.log("Hit banned file type:: filter issue");
            msg = `${name} cannot be uploaded due to policy.`;
            printBannedBanner(errHTML, f, id, name, mime, ts, size, msg);
            delQ.push(i);
            continue;
        }
        if (i == uploadFileList.length - 1) {
            console.log("Total size check:: total size is " + totalsize);
            if (!checkTotalSize()) {
                msg = `Total size exceeds policy, delete some`;
                disableUploadButton();
            }
        }
        totalfiles += 1;
    }

    errArea.innerHTML = errHTML.join('');
    var tmpFileList = Array.from(uploadFileList).filter(function(value, index) {
        return delQ.indexOf(index) == -1;
    });
    for (var i = 0; i < tmpFileList.length; i++) {
        let f = tmpFileList[i];
        let mime = f.type;
        let name = f.name;
        let ts = f.lastModified.toLocaleString();
        let size = humanFileSize(f.size);
        let id = 'a' + i;
        uploadFileInfos.push({
                    file: f,
                    id: id,
                    meta: '',
                    size: size,
                    ts: ts,
                    thumb: '',
                    bytesSent: ' ',
                    eta: ' ',
                    rate: ' ',
                });
        createSection(progressHTML, id, i, name, ts, mime, size);
    }
    progressArea.innerHTML = progressHTML.join('');
    createBars();
    createThumbnails();
    enableUploadButton();
}

function delItem(index) {
    let list = [...uploadFileInfos];
    totalsize -= uploadFileInfos[index].size;
    list.splice(index, 1);
    uploadFileInfos = list;
    el = document.getElementById('a' + index + '-section');
    el.remove();
    checkTotalSize();
}

function dumpConfigSummary() {
    if (uploadURL === undefined || filesName === undefined) {
        configSummary.innerHTML = `
	<div id="config">
		<h2 class="leading-tight pb-2">
		Please configure first
		</h2>
	</div>
	`;
        disableUploadButton();
    } else {
        configSummary.innerHTML = `
	<div id="config">
		<h3 class="leading-tight px-6 pb-2">
			&#128202; Progress type <span
class='text-sm'>${progType}</span>  
		<br/>
			 &#128228; Upload URL <span
class='text-sm'>${uploadURL}</span> 
		<br/>
		&#128218; FilesName <span
class='text-sm'>${filesName}</span>
		</h3>
	</div>
	`;
    }
}

function spitStatistics(idx) {
    if (idx == uploadFileInfos.length - 1) {
        endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
        totalsize = humanFileSize(totalsize);
        tot = uploadFileInfos.length;

        var ts = new Date().toLocaleString();
        var tot = uploadFileInfos.length;
        var status = totalfiles == tot ?
            '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/success-icon.svg" >' :
            '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" >';
        var details = `${totalfiles}/${tot} files of size ${totalsize} sent in
${totaltime} ms`;
        statsArea.innerHTML = details;

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
        upBut.classList.add('opacity-50');
        populateStats();
        progressBars = [];
        totalfiles = 0;
        totalsize = 0;
        totaltime = 0;
        startUploadts = 0;
        endUploadts = 0;
    }
}


async function uploadOneFile(f, idx) {

    let id = 'a' + idx;
    let uplForm = new FormData();
    uplForm.append(filesName, f);
    let size = f.size;
    let p = document.getElementById(id + '-prog');
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
            let bytesSent = humanFileSize(e.progress * size);
            Mysize = humanFileSize(size);
            let eta = e.estimated;
            let rate = (e.rate / 1024 / 1024).toFixed(2);

            p.innerHTML = `
		<span>${bytesSent} of ${Mysize} uploaded  ${rate} MB/s ETA ${eta} s</span>
		`;

        }
    };

    if (authEnabled) {
        var username = 'user';
        var password = 'password';
        var basicAuth = 'Basic ' + btoa(username + ':' + password);
        options['headers'] = {
            'Authorization': +basicAuth
        };
    }
    await axios.post(uploadURL, uplForm, options).then((resp) => {
        spitStatistics(idx)
    }).catch((error) => {
        alert("Upload failed to (" + uploadURL + "). Please check endpoint in Setup");
        alert(error);
    });
}

function uploadAll() {
    console.log("Starting upload...");
    startUploadts = Date.now();
    for (i = 0; i < uploadFileInfos.length; i++) {
        f = uploadFileInfos[i];
        uploadOneFile(f, i);
    }
}

/* XXX Setup tab functions */

/* XXX Globals */

var progType = "Line";
var extra = '';

/* XXX these are backend variables */
var uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
uploadURL = 'https://localhost:2324/uploadmultiple';
var filesName = "uploadFiles";
var authEnabled = false;
var authType = "Basic";
var user = '';
var pass = '';
/* Default 100 MB limit for uploads. Total as well as individual */
var fileSizeLimit = 100;
var sizeLimitType = "Single file limit";

var filtFiles = {
    "type": "all",
    "action": "allow"
};


function initApp() {
    document.getElementById("progress-up-uploadURL").value = uploadURL;
    document.getElementById("progress-up-filesName").value = filesName;
    dumpConfigSummary();
}

function applyFilter() {
    f = document.querySelector('#progress-up-filter')
    filt = f.value;
    filtType = document.querySelector('#filterAction');
    if (filtType.checked) {
        action = "deny";
    } else {
        action = "allow";
    }
    console.log(filt, action);
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

}

function toggleSizeQ() {
    val = document.querySelector('#sizeToggle');
    console.log(val.checked);
    const label = document.querySelector("#progress-up-sizeToggle");
    if (val.checked === true) {
        label.innerHTML = "Total limit";
    } else {
        label.innerHTML = "Single file limit";
    }
}

function toggleFilterQ() {
    val = document.querySelector('#filterAction');
    console.log(val.checked);
    const label = document.querySelector("#progress-up-filterLabel");
    if (val.checked === true) {
        label.innerHTML = "Deny file type";
    } else {
        label.innerHTML = "Allow file type";
    }
}


function toggleAuthQ(val) {
    const authSection = document.querySelector("#progress-up-authsection");
    authSection.classList.toggle("hidden");
}

function saveConfig() {

    uploadURL = document.getElementById("progress-up-uploadURL").value;
    filesName = document.getElementById("progress-up-filesName").value;
    if (uploadURL && filesName) {
        enableUploadButton();
    }
    authEnabled = document.getElementById("progress-up-authenable").checked;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;
    fileSizeLimit = document.getElementById("fileSizeLimit").value;
    sizeLimitType = document.getElementById("sizeToggle").checked;
    fileTypeFilter = document.getElementById("progress-up-filter").value;
    typeFilterAction = document.getElementById("filterAction").checked;

    applyFilter();
    console.log(uploadURL);
    console.log(filesName);
    console.log(authEnabled);
    if (authEnabled) {
        console.log(authType);
        console.log(user, pass);
    }
    console.log(fileSizeLimit);
    console.log(sizeLimitType);
    console.log(fileTypeFilter);
    console.log(typeFilterAction);
    dumpConfigSummary();
}

async function testUpload(event) {
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
}

function testEP() {
    saveConfig();
    testUpload();
}

function setIndicator() {
    var progType = document.getElementById("progress-up-indicator").value;
    console.log(progType);
    switch (progType) {
        case "Bubble":
            extra = 'data-img-size="100,100"';
            break;
        case "Rainbow":
            extra = 'data-stroke="data:ldbar/res,gradient(0,1,#f99,#ff9)"';
            break;
        default:
            break;
    }
    dumpConfigSummary();
}

/* XXX Statistics tab functions */

function populateStats() {
    statsTableDOM = document.getElementById("progress-up-statsTable");
    statsTableDOM.innerHTML = statsTable.join('');
}

/* XXX ---------------------------------- XXX */

/* XXX third party file upload - yet to integrate */
/* XXX ---------------------------------- XXX */

/* XXX Not used */

function dataFileDnD() {
    return {
        files: [],
        fileDragging: null,
        fileDropping: null,
        humanFileSize(size) {
            const i = Math.floor(Math.log(size) / Math.log(1024));
            return (
                (size / Math.pow(1024, i)).toFixed(2) * 1 +
                " " + ["B", "kB", "MB", "GB", "TB"][i]
            );
        },
        remove(index) {
            let files = [...files];
            files.splice(index, 1);

            files = createFileList(files);
        },
        drop(e) {
            let removed, add;
            let files = [...files];

            removed = files.splice(this.fileDragging, 1);
            files.splice(this.fileDropping, 0, ...removed);

            files = createFileList(files);
            this.fileDropping = null;
            this.fileDragging = null;
        },
        dragenter(e) {
            let targetElem = e.target.closest("[draggable]");

            fileDropping = targetElem.getAttribute("data-index");
        },
        dragstart(e) {
            fileDragging = e.target
                .closest("[draggable]")
                .getAttribute("data-index");
            e.dataTransfer.effectAllowed = "move";
        },
        loadFile(file) {
            const preview = document.querySelectorAll(".preview");
            const blobUrl = URL.createObjectURL(file);

            preview.forEach(elem => {
                elem.onload = () => {
                    URL.revokeObjectURL(elem.src); // free memory
                };
            });

            return blobUrl;
        },
        addFiles(e) {
            const files = createFileList([...this.files], [...e.target.files]);
            this.files = files;
            this.form.formData.files = [...files];
        }
    };
}

function upload(event) {
    console.log("Uploading using HTML5 File API...");
    let data = new FormData();
    fetch(uploadURL, {
            method: 'POST',
            body: data
        })
        .then((result) => {
            console.log('Success:', result);
        });

}

var reader = new FileReader();
reader.onprogress = function(progressEvent) {
    if (progressEvent.lengthComputable) {
        var percentLoaded = Math.round((
            progressEvent.loaded * 100) / progressEvent.total);

        document.getElementById(name + '-1').innerHTML = fileLoaded + "%";
    }
    console.log("total: " + progressEvent.total + ", loaded: " +
        progressEvent.loaded + "(" + percentLoaded + "%)");
}


function tusUploadFile(f, filesName, endpoint) {
    var upload = new tus.Upload(file, {
        endpoint: endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: filesName,
            filetype: file.type
        },
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            console.log("Download %s from %s", upload.file.name, upload.url)
        }
    })

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function(previousUploads) {
        // Found previous uploads so we select the first one. 
        if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
    })
}
