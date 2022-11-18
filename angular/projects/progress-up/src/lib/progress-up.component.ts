import {
    Component,
    Input,
    ElementRef,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    imagesrc: string;
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


    progress: any = {};
    showProgress: boolean = true;

    constructor(private el:ElementRef, private uploadService: ProgressUpService) {}

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
            cb("assets/icons/filetypes/" + fileIcon);
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

    delItem(index: number) {
        let list = [...this.uploadFileList];
        list.splice(index, 1);
        this.uploadFileList = list;
        this.uploadFileInfos = list;
    }

    spitStatistics(self:any, idx: number) {
        if (idx == self.uploadFileList.length - 1) {
            let endUploadts = Date.now();
            self.totaltime = endUploadts - self.startUploadts;
            let totalsize: any = self.humanFileSize(self.totalsize);

            var ts = new Date().toLocaleString();
            var tot = self.uploadFileList.length;
            var status = self.totalfiles == tot ?
                '<img src="assets/icons/misc/success-icon.svg" >' :
                '<img src="assets/icons/misc/failure-icon.svg" >';
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
}
