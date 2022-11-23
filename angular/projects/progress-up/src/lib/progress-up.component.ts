import {
    Component,
    Input,
    ElementRef,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import {AxiosInstance} from 'axios';

declare var ldBar: any;

import {
    ProgressUpService
} from './progress-up.service';
import {
    HttpEvent,
    HttpEventType,
    HttpResponse
} from '@angular/common/http';
import {
    Observable
} from 'rxjs';

interface statsTableType {
    id: number;
    ts: string;
    status: string;
    details: string;
};

interface fileInfo {
    ts: string;
    name: string;
    size: string;
    mime: string;
    id: string;
    meta: string;
    bytesSent: string;
    rate: string;
    eta: string;
};

interface errInfo {
    ts: string;
    name: string;
    size: string;
    mime: string;
    meta: string;
    msg: string;
};


@Component({
    selector: 'progress-up',
    templateUrl: 'progress-up.component.html',
    styleUrls: [
        './progress-up.component.css'
    ],
    encapsulation: ViewEncapsulation.None

})

export class ProgressUpComponent {


    fileTypeIcons: {
        [key: string]: string
    } = {
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


var filtFiles = { 
	"type": "all",
	"action": "allow"
};
    /* XXX these are backend variables */
    ///uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
    form = {
    uploadURL : 'https://localhost:2324/uploadmultiple',
    filesName : "uploadFiles",
    authEnabled : false,
    authType : "Basic",
    user : '',
    pass : '',
    progType : 'Line'
    fileSizeLimit : 10,
    sizeLimitType : "Single file limit",
    fileTypeFilter : "All",
    typeFilterAction : "Allow file type"

    };

   darkControls = `
    <span class="hidden dark:inline">&#127774;</span>
    <span class="inline dark:hidden">&#127769; </span>
  `;

    configVals1 = ' &#128202; Progress type ';
    configVals2 = '&#128228; Upload URL ';
    configVals3 = '&#128218; FilesName';

    uploadFileList: any = [];
    uploadFileInfos: fileInfo[] = [];
    errInfos: errInfo[] = [];
    disableUpload = true;
    thumbNailsDone = false;
    isDragged = false;

    progressBars: any[] = [];
    details = '';
    statsTable: statsTableType[] = [];


    totalfiles = 0;
    totalsize = 0;
    totaltime = 0;
    startUploadts = 0;
    endUploadts = 0;
    extra = "";
    bytesSent = 0;
    Mysize = 0;
    eta = 0;
    rate = 0;


    progress: any = {};
    showProgress: boolean = true;

    //constructor(private el:ElementRef, private uploadService: ProgressUpService) {}
    constructor(private el:ElementRef, private axiosClient: AxiosInstance) {}

  openTab = 1;
  toggleTabs($tabNumber: number){
    this.openTab = $tabNumber;
  }
   darkMode() {
	document.body.classList.toggle('dark');
   }
    uploadOneFile(file: File, idx: number) {
        let self = this;

        if (this.form.authEnabled) {
            var username = 'user';
            var password = 'password';
            var basicAuth = 'Basic ' + btoa(username + ':' + password);
            var options = {
	'headers' : {
                'Authorization': +basicAuth
            }
            };
        }

	/*
        this.uploadService.upload(idx, this.form.uploadURL,
this.form.filesName, file).subscribe(
            (event: HttpEvent < any > ) => {
                if (event.type === HttpEventType.UploadProgress) {
                    if (event.total) {
                        const total: number = event.total;
                        let perc = Math.round(100 * event.loaded / total);
			console.log(perc + "% got uploaded");
                        self.progressBars[idx].set(perc);
                    }
                } else if (event instanceof HttpResponse) {
            	   self.spitStatistics(self, idx);
                    console.log(event);
                }
            },
            err => {
                this.progress[file.name] = 0;
            });
	*/

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
            self.progressBars[idx].set(perc);
	    self.bytesSent = self.humanFileSize(e.progress * size);
	    self.Mysize = self.humanFileSize(size);
	    self.eta = e.estimated;
	    self.rate = (e.rate / 1024 / 1024).toFixed(2);
        }
    };

       this.axiosClient = axios.create(options);
	
    const formData: FormData = new FormData();
    formData.append(fname, file);
await axios.post(this.form.uploadURL, formData, options).then((resp) => {
        self.spitStatistics(idx)
    }).catch((error) => {
        alert("Upload failed to (" + uploadURL + "). Please check endpoint in Setup");
        alert(error);
    });


    }

    uploadAll() {
	this.startUploadts = Date.now();
        if (this.uploadFileList) {
            for (let i = 0; i < this.uploadFileList.length; i++) {
                let file = this.uploadFileList[i];
                this.uploadOneFile(file, i);
            }
        }
    }

    onDragOver(event: any) {
        event.preventDefault();
	this.isDragged = true;
    }

    onDragLeave(event: any) {
        event.preventDefault();
	this.isDragged = false;
    }
 
    onDrop(event: any) {
        event.preventDefault();
	this.isDragged = false;
	this.clearAll();
        let files = event.dataTransfer.files;
        this.uploadFileList = files;
        this.setupUpload();
    }

    fileSelectFinish(event: any) {
	this.clearAll();
        let selectedFiles = event.target.files;
        this.uploadFileList = selectedFiles;
        this.setupUpload();
    }

    humanFileSize(size: number) {
        const i: any = Math.floor(Math.log(size) / Math.log(1024));
	let t2:any = size / Math.pow(1024, i);
        let t: any = t2.toFixed(2) * 1;
        const ret: string = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    }
    

    spitStatistics(self:any, idx: number) {
        if (idx == self.uploadFileList.length - 1) {
            let endUploadts = Date.now();
            self.totaltime = endUploadts - self.startUploadts;
            let totalsize: any = self.humanFileSize(self.totalsize);

            var ts = new Date().toLocaleString();
            var tot = self.uploadFileList.length;
            var status = self.totalfiles == tot ?
                '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/success-icon.svg" >' :
                '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" >';
            self.details = self.totalfiles + '/' +  tot 
		+ " files of size " + totalsize +
                " sent in " + self.totaltime + " ms";

            var id = self.statsTable.length + 1;
	    self.statsTable.push({
		id: id,
	        ts: ts,
		status: status,
		details: self.details	
	    });

            self.disableUpload = true;
            self.totalfiles = 0;
            self.totalsize = 0;
            self.totaltime = 0;
            self.startUploadts = 0;
            self.endUploadts = 0;
        }
    }

    saveConfig() {
	console.log(this.form);
    }

    async testUpload() {
        console.log("Uploading using HTML5 File API...");
        let testForm = new FormData();

        const blob = new Blob(['Test upload DELETE'], {
            type: 'plain/text'
        });
        testForm.append(this.form.filesName, blob, 'progress-up-test.txt');
        let options = {};
        if (this.form.authEnabled) {
            var username = 'user';
            var password = 'password';
            var basicAuth = 'Basic ' + btoa(username + ':' + password);
            options = {
                headers: {
                    'Authorization': +basicAuth
                }
            };
        }

        /*
        await axios.post(this.uploadURL, testForm, options).then((resp) => {
            alert("Test succeeded");
        }).catch((error) => {
            alert("Upload failed. Please check endpoint in Setup");
            alert(error);
        });
	*/
    }

    testEP() {
        this.saveConfig();
        this.testUpload();
    }

    setIndicator() {
        console.log(this.form.progType);
        switch (this.form.progType) {
            case "Bubble":
                this.extra = 'data-img-size="100,100"';
                break;
            case "Rainbow":
                this.extra = 'data-stroke="data:ldbar/res,gradient(0,1,#f99,#ff9)"';
                break;
            default:
                break;
        }
    }


    clearAll() {
        this.uploadFileInfos = [];
        this.details = '';
        this.uploadFileList = [];
        this.progressBars = [];
        this.totalfiles = 0;
        this.totalsize = 0;
        this.totaltime = 0;
        this.startUploadts = 0;
        this.endUploadts = 0;

        this.disableUpload = true;
	this.thumbNailsDone = false;
        console.log("Cleared");

    }

applyFilter() {
	filt = this.form.fileFilter.value;
	filtType = this.form.filterAction;
	if(filtType.checked) {
		action = "deny";
	} else {
		action = "allow";
	}
	console.log(filt, action);
	switch(filt) {
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

toggleSizeQ() {
    const sizeLabel = "Single file limit";
    val = this.form.sizeToggle;
    if(val.checked === true) {
    	sizeLabel = "Total limit";
    } else {
    	sizeLabel = "Single file limit";
    }
}

toggleFilterQ() {
    const filterLabel = "Allow file type";
    val = this.form.filterAction;
    if(val.checked === true) {
    	filterLabel = "Deny file type";
    } else {
    	filterLabel = "Allow file type";
    }
}


wordCount(val) {
    var wom = val.match(/\S+/g);
    return {
        chars: val.length,
        words: wom ? wom.length : 0,
        lines: val.split(/\r*\n/).length
    };
}

showThumbnail(f, i) {
    let id = 'a' + i;
    switch (true) {
        case /text/.test(f.type):
            console.log("Text type detected");
            var reader = new FileReader();
            reader.onload = (function(f) {
                return function(e) {
                    txt = e.target.result;
                    wc = this.wordCount(txt);
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
                    setIconImage(f.name, f.type, txt);
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
            break;
        case /audio/.test(f.type):
            console.log("Audio type detected");
            var audioUrl = window.URL.createObjectURL(f);

            var icon = [
                '<audio controls width="125" height="125"><source src="',
                audioUrl,
                '" title="', name,
                '" alt="', name,
                '" class="h-9 w-9" </source> </audio>'
            ].join('');
            document.getElementById(f.name).innerHTML = icon;
            break;
        case /video/.test(f.type):
            console.log("Video type detected");
            var videoUrl = window.URL.createObjectURL(f);

            var icon = [
                '<video controls width="125" height="125"><source src="',
                videoUrl,
                '" title="', name,
                '" alt="', name,
                '" class="h-9 w-9"</source> </video>'
            ].join('');
            document.getElementById(f.name).innerHTML = icon;
            break;
        case /pdf/.test(f.type):
            console.log("PDF type detected");
            var pdfURL = window.URL.createObjectURL(f);
            var loc = document.getElementById(f.name);
            PDFObject.embed(pdfURL, loc);
            break;
        default:
            console.log("default type detected");
            setIconImage(f.name, f.type, f.name);
            break;
    }
}

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
}

checkSize(size) {
    if (size <= (allowedSize * 1024 * 1024)) {
        return true;
    }
    return false;
}

checkTotalSize() {
    if (totalsize <= (allowedTotalSize * 1024 * 1024)) {
        enableUploadButton();
        return true;
    }
    return false;
}


printBannedBanner( id, name, mime, ts, size, msg) {
            this.errInfos.push({
                ts:ts,
                name:name,
                size:size,
                mime:mime,
                id: id,
                msg:msg
            });
}

createBars() {
    for (var i = 0; i < uploadFileList.length; i++) {
        var selector = '#a' + i;
        var bar = new ldBar(selector, {
            preset: progType.toLowerCase()
        });
        bar.set(0);
        progressBars.push(bar);
    }
}

createThumbnails() {
    for (var i = 0; i < uploadFileList.length; i++) {
        f = uploadFileList[i];
        showThumbnail(f, i);
    }
}

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
            printBannedBanner(errHTML, id, name, mime, ts, size, msg);
            delQ.push(i);
            continue;
        }
        if (!checkFilter(mime)) {
            console.log("Hit banned file type:: filter issue");
            msg = `${name} cannot be uploaded due to policy.`;
            printBannedBanner(errHTML, id, name, mime, ts, size, msg);
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

    createThumbnails();
    for (j = 0; j < delQ.length; j++) {
        var item = delQ[j];
        delUploadList(item);
    }
    createBars();
    enableUploadButton();
}

delUploadList(index) {
    let list = [...uploadFileList];
    list.splice(index, 1);
    this.uploadFileList = list;
}
delItem(index) {
    let list = [...this.uploadFileList];
    totalsize -= this.upLoadFileList[index].size;
    list.splice(index, 1);
    this.uploadFileList = list;
    this.uploadFileInfos = list;
    checkTotalSize();
}

/* XXX delete */

    createBars()  { 
	if(!this.thumbNailsDone) {
		return;
	}
	this.progressBars = [];
        for (var i = 0; i < this.uploadFileInfos.length; i++) {
	    let id = 'a' + i;
            let bar = new ldBar('#' + id, {
                preset: this.form.progType.toLowerCase()
            });
            bar.set(0);
	    console.log("Creating progress bar::" + id);
            this.progressBars.push(bar);
	}
	this.thumbNailsDone = false;
   }

   buildThumb(f:File, type:string, cb:Function ) {
        type = type.split('/')[0];
        if (type != "image") {
            var fileIcon = this.fileTypeIcons[type];
            if (fileIcon == undefined) {
                fileIcon = "file.svg";
            }
            cb("https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" + fileIcon);
        } else {
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
		   if(e.target) {
                    cb(e.target.result);
		   }
                };
            })(f);
            reader.readAsDataURL(f);
        }
    }


    setupUpload() {
        for (var i = 0; i < this.uploadFileList.length; i++) {
            let f = this.uploadFileList[i];
            let ts = f.lastModifiedDate.toLocaleDateString();
            let fname = f.name;
            let size = this.humanFileSize(f.size);
            let mime = f.type;
            let id = "a" + i;
	    this.buildThumb(f, mime, (src:string) => {
               let imagesrc = src;
            this.uploadFileInfos.push({
                ts:ts,
                name:fname,
                size:size,
                mime:mime,
                id: id,
                imagesrc:imagesrc
            });
		if(this.uploadFileInfos.length == this.uploadFileList.length) {
			this.thumbNailsDone = true;
		}

	    });

            this.totalsize += f.size;
            this.totalfiles += 1;
        }
        this.disableUpload = false;
    }


}
