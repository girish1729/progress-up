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

uplform.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({
    target
}) => fileSelectFinish(target);

function enableUploadButton() {
    upBut = document.getElementById("upButton");
    upBut.removeAttribute('disabled');
    upBut.classList.remove('opacity-60');
}

function clearAll() {
    progressArea.innerHTML = '';
    statsArea.innerHTML = '';
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
    var span = document.createElement('span');
    var fileIcon = fileTypeIcons[type];
    if (fileIcon == undefined) {
        fileIcon = "file.svg";
    }
    span.innerHTML = [
        '<img width="70px" height="70px" src="',
        'icons/filetypes/' + fileIcon,
        '" title="', name,
        '" class="absolute mt-2 top-0 left-0" />'
    ].join('');
    document.getElementById(name).insertBefore(span, null);
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
                    // Render thumbnail.  
                    var span = document.createElement('span');
                    span.innerHTML = [
                        '<img width="70px" height="70px" class="absolute top-0 left-0 thumb" src="',
                        e.target.result,
                        '" title="', theFile.name,
        		'" class="absolute mt-2 top-0 left-0" />'
                    ].join('');
                    document.getElementById(theFile.name).insertBefore(span, null);
                };
            })(f);
            // Read in the image file as a data URL.  
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

<section id="${id}-section" class="m-4 rounded-[12px] border-dark-500
bg-yellow-100 transition-colors text-light-100 dark:text-white flex flex-row items-start  relative">
 <div class="py-3 px-6 border-gray-300 text-gray-600 ">

  <div onClick="delItem(${i})" title="Delete" class="absolute cursor-pointer top-0 right-0 mt-2 mr-2" >
	<img  width="25" height="25" src="icons/misc/trash-icon.svg" />
  </div>

  <span id="${name}"></span>

      <ul class='mx-10 px-10'>
      	    <li  class="text-xl font-light leading-relaxed text-gray-800">
      	    Name: ${name}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800">
      	    Date: ${ts}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800">
      	    Type: ${mime}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800">
      	    Size: ${size} 
      	    </li>
      </ul>

      <div class='ldBar absolute bottom-0 right-0 my-8' id="${id}" ></div>
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

function uploadAll() {
    console.log("Starting upload...");
    startUploadts = Date.now();
    for (i = 0; i < uploadFileList.length; i++) {
        f = uploadFileList[i].name;
        uploadOneFile(f, i);
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

function spitStatistics(idx) {
    if (idx == uploadFileList.length - 1) {
        endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
        totalsize = humanFileSize(totalsize);
        statsArea.innerHTML = `
	<div id="uploadStats" >
		<h2 class="text-5xl leading-tight border-b " >${totalfiles} file(s) uploaded
			<span class='row-gap'></span>
		${totalsize} sent
			<span class='row-gap'></span>
		in ${totaltime} milliseconds</h2>
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
        upBut.classList.add('opacity-60');
        populateStats();
        progressBars = [];
        totalfiles = 0;
        totalsize = 0;
        totaltime = 0;
        startUploadts = 0;
        endUploadts = 0;
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
}

function saveConfig() {

    uploadURL = document.getElementById("progress-up-uploadURL").value;
    filesName = document.getElementById("progress-up-filesName").value;
    authEnabled = document.getElementById("progress-up-authenable").value;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;

    console.log(uploadURL, filesName, authEnabled, authType, user, pass);
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
