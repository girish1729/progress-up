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
                       <i class="fas fa-3x fa-file-alt"></i>
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

async function uploadFile(name) {
    let data = new FormData(form);
await axios.post('https://girishvenkatachalam.me:2324/uploadmultiple', data, {
  onUploadProgress: function (e) {
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
        document.getElementById(name + '-1').innerHTML = fileLoaded + "%";
        document.getElementById(name + '-2').innerHTML = `
             <div  class="progress" style="width: ${fileLoaded}%"></div>
	`;
  }

});  

}

