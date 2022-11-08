/* XXX Globals */

var preset = "stripe";
var extra = '';

/* XXX these are backend variables */
var uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
uploadURL = 'https://localhost:2324/uploadmultiple';
var filesName = "uploadFiles";
var authEnabled = false;
var authType = "Basic";
var user = '';
var pass = '';

/* XXX Internal variables */
var uploadFileList = [];
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

/* XXX functions */
function initApp() {
    document.getElementById("uploadURL").value = uploadURL;
    document.getElementById("filesName").value = filesName;
    testProgress();
}

function saveConfig() {

    uploadURL = document.getElementById("uploadURL").value;
    filesName = document.getElementById("filesName").value;
    authEnabled = document.getElementById("progress-up-auth").value;
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

    uploadURL = document.getElementById("uploadURL").value;
    filesName = document.getElementById("filesName").value;
    authEnabled = document.getElementById("progress-up-auth").value;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;

    testUpload();
}

function setIndicator() {
    var prog = document.getElementById("progress-up-indicator").value;

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

function enableUploadButton() {
    upBut = document.getElementById("upButton");
    upBut.removeAttribute('disabled');
    upBut.classList.remove('opacity-60');
}

function clearAll() {
    progressArea.innerHTML = '';
    statsArea.innerHTML = '';
    uploadFileList = [];
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
    console.log("Files dropped:: " + dropFiles);
    uploadFileList = dropFiles;
    setupUpload();
}

function fileSelectFinish(target) {
    let selectedFiles = target.files;
    console.log("Files selected:: " + selectedFiles);
    uploadFileList = selectedFiles;
    setupUpload();
}

function setupUpload() {
    var progressHTML = [];
    for (var i = 0, f; f = uploadFileList[i]; i++) {
        let ts = f.lastModifiedDate.toLocaleDateString();
        let name = f.name;
        let per = 20;
        let size = f.size;
        let mime = f.type;

        totalfiles += 1;
        totalsize += size;

        var progString = `<div class="ldBar label-center" ${extra} data-value="${per}" data-preset="${preset}" ></div>`;
        progressHTML.push(
            `<li class="row">
		${progString}

<div class="ldBar label-center" data-value="35" data-preset="stripe" ></div>
             <i class="fas fa-2x fa-file-alt"></i>
               <div class="ldBar" data-preset="circle" data-value="20"></div>
               <span class="name">Name:: ${name}</span>
               <span class="ts">Date:: ${ts}</span>
               <span class="mime">Type:: ${mime}</span>
               <span class="size">Size:: ${size} Bytes</span>
	       <div data-preset="line" id="${name}-progress" class="ldBar" data-value="${per}"> </div>
	   </li>`);

    }
    progressArea.innerHTML = '<ul>' + progressHTML.join('') + '</ul>';
    enableUploadButton();
}

function spitStatistics(idx) {
    if (idx == uploadFileList.length - 1) {
        endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
        statsArea.innerHTML = `
	<div id="uploadStats">
		<h2>${totalfiles} files uploaded
			<span class='row-gap'></span>
		${totalsize} bytes sent
			<span class='row-gap'></span>
		in ${totaltime} milliseconds</h2>
	</div>
	`;
    }
    upBut.disabled = true;
    upBut.setAttribute('value', "Uploaded");
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
            let fileLoaded = parseInt(e.progress * 100);
            document.getElementById(name + '-progress')
                .setAttribute("data-value", fileLoaded)
        }
    }).then((resp) => {
        spitStatistics(idx)
    });
}

/* XXX Not used */

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
        document.getElementById(name + '-2').innerHTML = `
             <div  class="progress" style="width: ${fileLoaded}%"></div>
	`;
    }
    console.log("total: " + progressEvent.total + ", loaded: " +
        progressEvent.loaded + "(" + percentLoaded + "%)");
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
                span.innerHTML = ['<img class="thumb" src="',
                    e.target.result,
                    '" title="', theFile.name, '"/>'
                ].join('');
                document.getElementById('list').insertBefore(span, null);
            };
        })(f);
        // Read in the image file as a data URL.  
        reader.readAsDataURL(f);
    }
}

allTypes = [
	"line", 
	"fan",
	"energy",
	"bubble",
	"rainbow",
	"stripe",
	"text",
	"circle"
];

function testProgress() {
	progIndicator = [];
	per = 25;
const showall = document.getElementById("showall");
	for(i=0; i < allTypes.length;i++) {
		type = allTypes[i];
		progIndicator.push(`
	<li>
        <div class="ldBar label-center" data-value="${per}"
data-preset="${type}" >
	</div>
	</li>`);
		
	}
    showall.innerHTML = '<ul>' + progIndicator.join('') + '</ul>';
}
