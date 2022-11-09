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

const uplform = document.getElementById("progress-up-form");
uplform.addEventListener("dragover", dragOver, false);
uplform.addEventListener("drop", drop, false);

fileInput = document.getElementById("fileInput");
progressArea = document.getElementById("progress-up-area");
statsArea = document.getElementById("progress-up-statsArea");
progressArea.innerHTML = "";

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
                " " +
                ["B", "kB", "MB", "GB", "TB"][i]
            );
}

function showThumbnails() {
    // Loop through the FileList and render image files as thumbnails.  
    for (var i = 0, f; f = uploadFileList[i]; i++) {
        // Only process image files.  
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.  
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.  
                var span = document.createElement('span');
                span.innerHTML = [
		'<img width="100px" height="100px" class="thumb" src="',
                    e.target.result,
                    '" title="', theFile.name, 
		'" class="py-4 pl-4 aspect-square" />'
                ].join('');
                document.getElementById(theFile.name).insertBefore(span, null);
            };
        })(f);
        // Read in the image file as a data URL.  
        reader.readAsDataURL(f);
    }
}

function setupUpload() {
    var progressHTML = [];
    for (var i = 0; i < uploadFileList.length; i++) {
        let f = uploadFileList[i];
        let ts = f.lastModifiedDate.toLocaleDateString();
        let name = f.name;
        let size = humanFileSize(f.size);
        let mime = f.type;
        let id = 'a' + i;
        totalfiles += 1;
        totalsize += size;

        progressHTML.push(
`
<section class="rounded-md border border-neutral-500 bg-white hover:bg-neutral-600 transition-colors text-black-100 flex flex-row items-start cursor-pointer">

<span onClick="delItem(${i})">
<i class="fa fa-trash" aria-hidden="true"></i>
</span>

<p id="${name}" class="text-xl font-light leading-relaxed mt-6 mb-4 text-gray-800">
Name: ${name}
</p>
<p class="text-xl font-light leading-relaxed mt-6 mb-4 text-gray-800">
Date: ${ts}
</p>
<p class="text-xl font-light leading-relaxed mt-6 mb-4 text-gray-800">
Type: ${mime}
</p>
<p class="text-xl font-light leading-relaxed mt-6 mb-4 text-gray-800">
Size: ${size} 
</p>

<div class="py-3 px-6 border-t border-gray-300 text-gray-600">
	<div class='ldBar' id="${id}" ></div>
</div>

</section>
`);


    }
    progressArea.innerHTML = '<ul>' + progressHTML.join('') + '</ul>';

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
	console.log(uploadFileList);	
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
    await axios.post(uploadURL, uplFormData, {
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
    }).then((resp) => {
        spitStatistics(idx)
    });
}

function spitStatistics(idx) {
    if (idx == uploadFileList.length - 1) {
        endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
	totalsize = humanFileSize(totalsize);
        statsArea.innerHTML = `
	<div id="uploadStats">
		<h2>${totalfiles} files uploaded
			<span class='row-gap'></span>
		${totalsize} sent
			<span class='row-gap'></span>
		in ${totaltime} milliseconds</h2>
	</div>
	`;


        var ts = new Date().toLocaleString();
        var tot = uploadFileList.length;
        var status = totalfiles == tot ?
            '<i class="fa fa-check" style="font-size:48px;color:green"></i>' :
            '<i class="fa fa-times" style="font-size:48px;color:red"></i>';
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


function initApp() {
    document.getElementById("uploadURL").value = uploadURL;
    document.getElementById("filesName").value = filesName;
}

function saveConfig() {

    uploadURL = document.getElementById("uploadURL").value;
    filesName = document.getElementById("filesName").value;
    authEnabled = document.getElementById("progress-up-authenable").value;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;

    console.log(uploadURL, filesName, authEnabled, authType, user, pass);
}

function testResult(resp) {
    if (resp.status === 200) {
        alert("Test succeeded");
    } else {
        alert("Test failed, try again");
        alert(resp.statusText)
    }
}

async function testUpload(event) {
    console.log("Uploading using HTML5 File API...");
    let testForm = new FormData();

    const blob = new Blob(['Test upload DELETE'], {
        type: 'plain/text'
    });
    testForm.append(filesName, blob, 'progress-up-test.txt');
    await axios.post(uploadURL, testForm)
        .then((resp) => {
            testResult(resp)
        });
}

function testEP() {
    saveConfig();
    testUpload();
}

function setIndicator() {
    var progType = document.getElementById("progType").value;
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
                " " +
                ["B", "kB", "MB", "GB", "TB"][i]
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

