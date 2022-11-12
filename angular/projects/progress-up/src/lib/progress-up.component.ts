import {
    Component,
    Input,
    ViewEncapsulation
} from '@angular/core';


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

interface statsTableType  {
    id: number;
    ts: String;
    status: String;
    details: String;
};

interface progressInfoType  {
    name: String;
    ts: String;
    mime: String;
    size: String;
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


fileTypeIcons: {[key: string]: string} = {
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
    uploadURL = 'https://localhost:2324/uploadmultiple';
    filesName = "uploadFiles";
    authEnabled = false;
    authType = "Basic";
    user = '';
    pass = '';
    progType = 'line';

    uploadFileList:any = [];
    disableUpload = true;

    progressBars:any[] = [];
    progressInfos:progressInfoType[] = [];
    statsTable:statsTableType[] = [];


    totalfiles = 0;
    totalsize = 0;
    totaltime = 0;
    startUploadts = 0;
    endUploadts = 0;


    progress: any = {};
    showProgress: boolean = true;

    constructor(private uploadService: ProgressUpService) {}

    uploadOneFile(file: File, idx: number) {
        let self = this;

	let fname = file.name;
        let options = {
            onUploadProgress: function(e:any) {
                let perc:number = Number(e.progress * 100);
                self.progressBars[idx].set(perc);
            }
        };

        if (this.authEnabled) {
            var username = 'user';
            var password = 'password';
            var basicAuth = 'Basic ' + btoa(username + ':' + password);
            options['headers'] = {
                'Authorization': +basicAuth
            };
        }
	/*
        await axios.post(this.uploadURL, uplFormData, options).then((resp) => {
            this.spitStatistics(idx);
        }).catch((error) => {
            alert("Upload failed. Please check endpoint in Setup");
            alert(error);
        });
	*/

        this.uploadService.upload(this.uploadURL, fname, file).subscribe(
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
    }

    // From drag and drop
    onDropSuccess(event: any) {
        event.preventDefault();
        let files = event.dataTransfer.files;
        this.uploadFileList = files;
        this.setupUpload();
    }

    fileSelectFinish(target:any) {
        let selectedFiles = target.files;
        this.uploadFileList = selectedFiles;
        this.setupUpload();
    }

    humanFileSize(size:number) {
        const i:any = Math.floor(Math.log(size) / Math.log(1024));
	let t:any = size / Number(Math.pow(1024, i).toFixed(2)) * 1;
        const ret:string =   t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    }

    setIconImage(name:string, type:string) {
        type = type.split('/')[0];
        console.log(type);
        var fileIcon = this.fileTypeIcons[type];
        if (fileIcon == undefined) {
            fileIcon = "file.svg";
        }
        var icon = [
            '<img width="125" height="125" src="',
            'https://raw.githubusercontent.com/girish1729/progress-up/tree/main/backend/public/icons/filetypes/' + fileIcon,
            '" title="', name,
            '" alt="', name,
            '" class="h-9 w-9" />'
        ].join('');
        //document.getElementById(name).innerHTML = icon;
    }

    
showThumbnails() {
        for (var i = 0, f; f = this.uploadFileList[i]; i++) {
            if (!f.type.match('image.*')) {
                this.setIconImage(f.name, f.type);
            } else {
                var reader = new FileReader();
                // Closure to capture the file information.  
                reader.onload = (function(theFile) {
                    return function(e) {
                        var thumb = [
                            '<img width="125" height="125" src="',
                            e.target ? e.target.result: '',
                            '" title="', theFile.name,
                            '" alt="', theFile.name,
                            '" class="w-12 h-12" />'
                        ].join('');
                        //document.getElementById(theFile.name).innerHTML = thumb;
                    };
                })(f);
                reader.readAsDataURL(f);
            }
        }
    }

    setupUpload() {
        for (var i = 0; i < this.uploadFileList.length; i++) {
            let f = this.uploadFileList[i];
            let ts = f.lastModifiedDate.toLocaleDateString();
            let name = f.name;
            this.totalsize += f.size;
            let size:any = this.humanFileSize(f.size);
            let mime = f.type;
            let id = 'a' + i;
            this.totalfiles += 1;
        }

        for (var i = 0; i < this.uploadFileList.length; i++) {
            var selector = '#a' + i;
            var bar = new this.uploadService.ldBar(selector, {
                preset: this.preset
            });
            bar.set(0);
            this.progressBars.push(bar);
        }

        this.showThumbnails();

	this.disableUpload = false;
    }

    delItem(index: number) {
        let list = [...this.uploadFileList];
        list.splice(index, 1);
        this.uploadFileList = list;
	/*
        el = document.getElementById('a' + index + '-section');
        el.remove();
	*/

    }

    spitStatistics(idx:number) {
        if (idx == this.uploadFileList.length - 1) {
            let endUploadts = Date.now();
            let totaltime = endUploadts - this.startUploadts;
            let totalsize:any = this.humanFileSize(this.totalsize);

            var ts = new Date().toLocaleString();
            var tot = this.uploadFileList.length;
            var status = this.totalfiles == tot ?
                '<img src="/icons/misc/success-icon.svg" >' :
                '<img src="/icons/misc/failure-icon.svg" >';
            var details = this.totalfiles / tot + "files size " + totalsize +
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
    }

    async testUpload() {
        console.log("Uploading using HTML5 File API...");
        let testForm = new FormData();

        const blob = new Blob(['Test upload DELETE'], {
            type: 'plain/text'
        });
        testForm.append(this.filesName, blob, 'progress-up-test.txt');
        let options = {};
        if (this.authEnabled) {
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
        console.log(this.progType);
        this.progType = this.progType.toLowerCase()
        switch (this.progType) {
            case "line":
                this.preset = this.progType;
                break;
            case "fan":
                this.preset = this.progType;
                break;
            case "bubble":
                this.preset = this.progType;
                this.extra = 'data-img-size="100,100"';
                break;
            case "rainbow":
                this.preset = this.progType;
                this.extra = 'data-stroke="data:ldbar/res,gradient(0,1,#f99,#ff9)"';
                break;
            case "energy":
                this.preset = this.progType;
                break;
            case "stripe":
                this.preset = this.progType;
                break;
            case "text":
                this.preset = this.progType;
                break;
            case "circle":
                this.preset = this.progType;
                break;
            default:
                break;
        }
    }


    clearAll() {
        this.progressInfos = [];
	/*
        this.progressArea.innerHTML = '';
        this.statsArea.innerHTML = '';
        this.configSummary.innerHTML = '';
	*/
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
