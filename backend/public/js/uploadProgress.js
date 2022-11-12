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

function enableUploadButton() {
    upBut = document.getElementById("upButton");
    upBut.removeAttribute('disabled');
    upBut.classList.remove('opacity-20');
}

function clearAll() {
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
}

function dragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var dropFiles = event.dataTransfer.files;
    uploadFileList = dropFiles;
    setupUpload();
}

function fileSelectFinish(target) {
    let selectedFiles = target.files;
    uploadFileList = selectedFiles;
    setupUpload();
}

function humanFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 +
        " " + ["B", "kB", "MB", "GB", "TB"][i]
    );
}

function setIconImage(name, type) {
    type = type.split('/')[0];
    console.log(type);
    var fileIcon = fileTypeIcons[type];
    if (fileIcon == undefined) {
        fileIcon = "file.svg";
    }
    var icon = [
        '<img width="125" height="125" src="',
        'icons/filetypes/' + fileIcon,
        '" title="', name,
        '" alt="', name,
        '" class="h-9 w-9" />'
    ].join('');
    document.getElementById(name).innerHTML = icon;
}

function showThumbnails() {
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
}

function setupUpload() {
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
text-light-100 dark:text-white">
 <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div  onClick="delItem(${i})" title="Delete" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25" src="icons/misc/trash-icon.svg" />
    </div>

    <div class="flex flex-wrap -mx-2 mb-8">
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
		<div id="${name}"></div>
         </div>
      </div>
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
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
       </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
    		<div class='ldBar' id="${id}" ></div>
         </div>
      </div>
    </div>

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
}

function delItem(index) {
    let list = [...uploadFileList];
    list.splice(index, 1);
    uploadFileList = list;
    el = document.getElementById('a' + index + '-section');
    el.remove();

}

function dumpConfigSummary() {
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
}

function spitStatistics(idx) {
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
            '<img src="icons/misc/success-icon.svg" >' :
            '<img src="icons/misc/failure-icon.svg" >';
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
}


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
}

/* XXX Setup tab functions */

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



function toggleAuthQ(val) {
    const authSection = document.querySelector("#progress-up-authsection");
    authSection.classList.toggle("hidden");
}

function initApp() {
    document.getElementById("progress-up-uploadURL").value = uploadURL;
    document.getElementById("progress-up-filesName").value = filesName;
    dumpConfigSummary();
}

function saveConfig() {

    uploadURL = document.getElementById("progress-up-uploadURL").value;
    filesName = document.getElementById("progress-up-filesName").value;
    authEnabled = document.getElementById("progress-up-authenable").value;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;

    console.log(uploadURL, filesName, authEnabled, authType, user, pass);
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
            let files = [...this.files];
            files.splice(index, 1);

            this.files = createFileList(files);
        },
        drop(e) {
            let removed, add;
            let files = [...this.files];

            removed = files.splice(this.fileDragging, 1);
            files.splice(this.fileDropping, 0, ...removed);

            this.files = createFileList(files);

            this.fileDropping = null;
            this.fileDragging = null;
        },
        dragenter(e) {
            let targetElem = e.target.closest("[draggable]");

            this.fileDropping = targetElem.getAttribute("data-index");
        },
        dragstart(e) {
            this.fileDragging = e.target
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
    let data = new FormData(uplform);
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
