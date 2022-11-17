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

    /* XXX Globals */

    preset = "line";
    extra = '';

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
    progType : 'line'
    };
    progType = 'line';


    configVals = '<h2 class="leading-tight pb-2"> &#128202; Progress type <span class="text-sm">' 
	+ this.preset + '</span>  &#128228; Upload URL <span class="text-sm">' 
	+ this.form.uploadURL + "</span> &#128218; FilesName <span class='text-sm'>" 
	+ this.form.filesName + "</span> </h2> ";

    uploadFileList: any = [];
    uploadFileInfos: fileInfo[] = [];
    disableUpload = true;
    isDragged = false;

    progressBars: any[] = [];
    details = '';
    statsTable: statsTableType[] = [];


    totalfiles = 0;
    totalsize = 0;
    totaltime = 0;
    startUploadts = 0;
    endUploadts = 0;


    progress: any = {};
    showProgress: boolean = true;

    constructor(private el:ElementRef, private uploadService: ProgressUpService) {}

  openTab = 1;
  toggleTabs($tabNumber: number){
    this.openTab = $tabNumber;
  }
   darkMode() {
   }
    uploadOneFile(file: File, idx: number) {
        let self = this;

        let fname = file.name;
        let options = {
            onUploadProgress: function(e: any) {
                let perc: number = Number(e.progress * 100);
                self.progressBars[idx].set(perc);
            }
        };

        if (this.form.authEnabled) {
            var username = 'user';
            var password = 'password';
            var basicAuth = 'Basic ' + btoa(username + ':' + password);
		/*
            options['headers'] = {
                'Authorization': +basicAuth
            };
		*/
        }
        /*
        await axios.post(this.uploadURL, uplFormData, options).then((resp) => {
            this.spitStatistics(idx);
        }).catch((error) => {
            alert("Upload failed. Please check endpoint in Setup");
            alert(error);
        });
	*/

        this.uploadService.upload(this.form.uploadURL, fname, file).subscribe(
            (event: HttpEvent < any > ) => {
                if (event.type === HttpEventType.UploadProgress) {
                    if (event.total) {
                        const total: number = event.total;
                        //this.progress[file.name] = 
                        let perc = Math.round(100 * event.loaded / total);
                        self.progressBars[idx].set(perc);
                    }
                } else if (event instanceof HttpResponse) {
                    console.log(event);
                }
            },
            err => {
                this.progress[file.name] = 0;
            });
    }

    uploadAll() {
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
        let files = event.dataTransfer.files;
        this.uploadFileList = files;
        this.setupUpload();
    }

    fileSelectFinish(event: any) {
        let selectedFiles = event.target.files;
        this.uploadFileList = selectedFiles;
        this.setupUpload();
    }

    humanFileSize(size: number) {
        const i: any = Math.floor(Math.log(size) / Math.log(1024));
        let t: any = size / Number(Math.pow(1024, i).toFixed(2)) * 1;
        const ret: string = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    }

     buildThumb(f:File, type:string, cb:Function ) {
        type = type.split('/')[0];
	//console.log(type);
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

    createBar(id:string)  { 
            let bar = new ldBar('#' + id, {
                preset: this.form.progType
            });
            bar.set(0);
            this.progressBars.push(bar);
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

            this.totalsize += f.size;
            this.totalfiles += 1;

	    });
        }
        this.disableUpload = false;
    }

    delItem(index: number) {
        let list = [...this.uploadFileList];
        list.splice(index, 1);
        this.uploadFileList = list;
    }

    spitStatistics(idx: number) {
        if (idx == this.uploadFileList.length - 1) {
            let endUploadts = Date.now();
            let totaltime = endUploadts - this.startUploadts;
            let totalsize: any = this.humanFileSize(this.totalsize);

            var ts = new Date().toLocaleString();
            var tot = this.uploadFileList.length;
            var status = this.totalfiles == tot ?
                '<img src="/icons/misc/success-icon.svg" >' :
                '<img src="/icons/misc/failure-icon.svg" >';
            this.details = this.totalfiles / tot + "files size " + totalsize +
                "sent in " + totaltime + " ms";

            var id = this.statsTable.length + 1;

            this.disableUpload = true;
            this.progressBars = [];
            this.totalfiles = 0;
            this.totalsize = 0;
            this.totaltime = 0;
            this.startUploadts = 0;
            this.endUploadts = 0;
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
        this.preset = this.form.progType.toLowerCase()
        switch (this.progType) {
            case "bubble":
                this.extra = 'data-img-size="100,100"';
                break;
            case "rainbow":
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
        console.log("Cleared");

    }
}
