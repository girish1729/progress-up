const form = document.querySelector("form"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-up-area");

form.addEventListener("click", () => {
    fileInput.click();
});


fileInput.onchange = ({
    target
}) => {
    let files = target.files;
    progressArea.innerHTML = "";
    for (i = 0; i < files.length; i++) {
        file = files[i];
        if (file) {
            let fileName = file.name;
            let fileLoaded = 0;
            let size = file.size;
            let progressHTML =
                `<li class="row">
                       <i class="fas fa-file-alt"></i>
                       <div class="content">
                            <div class="details">
                              <span class="name">${fileName} </span>
                              <span id="${fileName}-1" class="percent">${fileLoaded} % </span>
                            </div>
                         <div id="${fileName}-2" class="progress-bar">
                              <div  class="progress" style="width: ${fileLoaded}%"></div>
                         </div>
                         <span class="size">${size} Bytes</span>
                        </div>
		 </li>`;
            progressArea.innerHTML += progressHTML;
            uploadFile(fileName);
        }
    }
}

function clearAll() {
	progressArea.innerHTML = '';
}
// file upload function
function uploadFile(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadmultiple");
    xhr.upload.addEventListener("progress", ({
        loaded,
        total
    }) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        document.getElementById(name + '-1').innerHTML = fileLoaded + "%";
        document.getElementById(name + '-2').innerHTML = `
             <div  class="progress" style="width: ${fileLoaded}%"></div>
	`;
    });
    let data = new FormData(form);
    xhr.send(data);
}
