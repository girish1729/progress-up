import {
    Component,
    Input,
    Inject,
    ViewEncapsulation
} from '@angular/core';
import {
    DOCUMENT
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

import * as PDFObject from 'pdfobject';

import axios from 'axios';

declare var ldBar: any;

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
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    bytesSent: string;
    rate: string;
    eta: string;
};

interface errInfo {
    file: File;
    id: string;
    ts: string;
    thumb: string;
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


    filtFiles = {
        "type": "all",
        "action": "allow"
    };
    /* XXX these are backend variables */
    ///uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
    form = {
        uploadURL: 'https://localhost:2324/uploadmultiple',
        filesName: "uploadFiles",
        authEnabled: false,
        authType: "Basic",
        user: '',
        pass: '',
        progType: 'Line',
        fileSizeLimit: 10,
        sizeLimitType: "Single file limit",
        fileTypeFilter: "All",
        fileTypeAction: "Allow file type"

    };

    darkControls = `
    <span class="hidden dark:inline">&#127774;</span>
    <span class="inline dark:hidden">&#127769; </span>
  `;

    configVals1 = ' &#128202; Progress type ';
    configVals2 = '&#128228; Upload URL ';
    configVals3 = '&#128218; FilesName';

    sizeLabel = "Single file limit";
    filterLabel = "Allow file type";
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

    constructor(@Inject(DOCUMENT) document: Document) {}

    openTab = 1;
    toggleTabs($tabNumber: number) {
        this.openTab = $tabNumber;
    }

    darkMode() {
        document.body.classList.toggle('dark');
    }

    uploadOneFile(file: fileInfo, idx: number) {
        const formData: FormData = new FormData();
        formData.append(this.form.filesName, file.file);
        console.log("Uploading to " + this.form.uploadURL);
        console.log("Uploading file name" + this.form.filesName);
	var self = this;
        let options = {
            onUploadProgress: function(e:any) {
                let perc = Number(e.progress * 100);
                self.progressBars[idx].set(perc);
                file.bytesSent = self.humanFileSize(e.progress *
file.file.size);
                file.eta = String(e.estimated);
		let r:number = Number(e.rate / 1024 / 1024);
                file.rate = String(r.toFixed(2));
            },
	    headers: {
                'Content-Type': "multipart/form-data",
		Authorization: ""
	    } 
        };
        if (this.form.authEnabled) {
            var username = 'user';
            var password = 'password';
            var basicAuth = 'Basic ' + btoa(username + ':' + password);
            options['headers'] = {
                'Content-Type': "multipart/form-data",
		Authorization:  basicAuth
	    };
        }


        axios.create(options);
        axios.post(this.form.uploadURL, formData, options).then((resp) => {
            self.spitStatistics(self, idx);
        }).catch((error) => {
            alert("Upload failed to (" + this.form.uploadURL + "). Please check endpoint in Setup");
            alert(error);
        });
    }

    uploadAll() {
        this.startUploadts = Date.now();
        if (this.uploadFileInfos) {
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
        let t2: any = size / Math.pow(1024, i);
        let t: any = t2.toFixed(2) * 1;
        const ret: string = t + " " + ["B", "kB", "MB", "GB", "TB"][i];
        return (ret);
    }


    spitStatistics(self: any, idx: number) {
        if (idx == self.uploadFileList.length - 1) {
            let endUploadts = Date.now();
            self.totaltime = endUploadts - self.startUploadts;
            let totalsize: any = self.humanFileSize(self.totalsize);

            var ts = new Date().toLocaleString();
            var tot = self.uploadFileList.length;
            var status = self.totalfiles == tot ?
                '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/success-icon.svg" >' :
                '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" >';
            self.details = self.totalfiles + '/' + tot +
                " files of size " + totalsize +
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
        console.log(this.form.uploadURL);
        console.log(this.form.filesName);
        console.log(this.form.progType);

        if (this.form.authEnabled) {
            console.log(this.form.authType);
            console.log(this.form.user, this.form.pass);
        }
        console.log(this.form.fileSizeLimit);
        console.log(this.form.sizeLimitType);
        console.log(this.form.fileTypeFilter);
        console.log(this.form.fileTypeAction);

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

        await axios.post(this.form.uploadURL, testForm, options).then((resp) => {
            alert("Test succeeded");
        }).catch((error) => {
            alert("Upload failed. Please check endpoint in Setup");
            alert(error);
        });
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
        this.details = '';
        this.uploadFileList = [];
        this.uploadFileInfos = [];
        this.errInfos = [];
        this.progressBars = [];
        this.totalfiles = 0;
        this.totalsize = 0;
        this.totaltime = 0;
        this.disableUpload = true;
        this.thumbNailsDone = false;
        console.log("Cleared");
    }

    applyFilter() {
        let filt = this.form.fileTypeFilter;
        let action = this.form.fileTypeAction;
        console.log(filt, action);
        switch (filt) {
            case "All":
                break;
            case "PDF only":
                this.filtFiles = {
                    "type": "application/pdf",
                    "action": action
                };
                break;
            case "Image only":
                this.filtFiles = {
                    "type": "image",
                    "action": action
                };
                break;
            case "Video only":
                this.filtFiles = {
                    "type": "video",
                    "action": action
                };
                break;
            case "Audio only":
                this.filtFiles = {
                    "type": "audio",
                    "action": action
                };
                break;
            case "Zip only":
                this.filtFiles = {
                    "type": "application/zip",
                    "action": action
                };
                break;
            case "Text only":
                this.filtFiles = {
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
        let val = this.form.sizeLimitType;
        if (val) {
            this.sizeLabel = "Total limit";
        } else {
            this.sizeLabel = "Single file limit";
        }
    }

    toggleFilterQ() {
        let val = this.form.fileTypeAction;
        if (val) {
            this.filterLabel = "Deny file type";
        } else {
            this.filterLabel = "Allow file type";
        }
    }


    wordCount(val:string) {
        var wom = val.match(/\S+/g);
        return {
            chars: val.length,
            words: wom ? wom.length : 0,
            lines: val.split(/\r*\n/).length
        };
    }
    checkFilter(mime:string) {
        /* No filter XXX */
        if (this.filtFiles.type == 'all') {
            console.log("No file type filters active");
            return true;
        }
        if (mime.match(this.filtFiles.type) && this.filtFiles.action == "allow") {
            return true;
        }
        if (mime.match(this.filtFiles.type) && this.filtFiles.action == "deny") {
            return true;
        }
        return false;
    }

    checkSize(size:number) {
        if (size <= (this.form.fileSizeLimit * 1024 * 1024)) {
            return true;
        }
        return false;
    }

    checkTotalSize() {
        if (this.form.sizeLimitType == "Total limit") {
            if (this.totalsize <= (this.form.fileSizeLimit * 1024 * 1024)) {
                return true;
            }
            return false;
        }
        return false;
    }

    showThumbnail(f:fileInfo, i: number) {
        let id = 'a' + i;
        let target = id + '-thumb';
	let self = this;
	let type = f.file.type.split('/')[0];
        switch (true) {
            case /text/.test(f.file.type):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let res:any;
			if(e.target) {
                        	res = e.target.result;
			}
                        let wc = self.wordCount(res);
                        f.meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = (<string>res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");

                        var fileIcon = self.fileTypeIcons[type];
                        let pic = "src/assets/icons/filetypes/" +
                            fileIcon;
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                txt,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join('');

                    };
                })(f.file);
                reader.readAsText(f.file);
                break;
            case /image/.test(f.file.type):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let pic:any;
			if(e.target) {
                        	pic = e.target.result;
			}
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                locf.name,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join(''); 
                            f.meta = locf.name;
                    };
                })(f.file);
                reader.readAsDataURL(f.file);
                break;
            case /audio/.test(f.file.type):
                console.log("Audio type detected");
                var audioUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<audio controls class="h-9 w-9" width="125" height="125"> ',
		    '<source src="',
                    audioUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </audio> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /video/.test(f.file.type):
                console.log("Video type detected");
                var videoUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<video controls class="h-9 w-9" width="125" height="125">',
		    '<source src="',
                    videoUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </video> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /pdf/.test(f.file.type):
                console.log("PDF type detected");
                var pdfURL = window.URL.createObjectURL(f.file);
                f.meta = f.file.name;
                PDFObject.embed(pdfURL, target);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[type];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                f.meta = f.file.name;
                let pic = "src/assets/icons/filetypes/" + fileIcon;
                f.thumb = [
                    '<img width="125" height="125" src=',
                    pic,
                    '" title="',
                    f.file.name,
		    '" alt="',
                    f.file.name,
                    '" class="w-12 h-12" />'
                ].join('');
                break;
        }
    }

    showErrThumbnail(f:errInfo, i: number) {
        let id = 'a' + i;
        let target = id + '-thumb';
	let self = this;
	let type = f.file.type.split('/')[0];
        switch (true) {
            case /text/.test(f.file.type):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let res:any;
			if(e.target) {
                        	res = e.target.result;
			}
                        let wc = self.wordCount(res);
                        f.meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = (<string>res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");

                        var fileIcon = self.fileTypeIcons[type];
                        let pic = "src/assets/icons/filetypes/" +
                            fileIcon;
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                txt,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join('');

                    };
                })(f.file);
                reader.readAsText(f.file);
                break;
            case /image/.test(f.file.type):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
			let pic:any;
			if(e.target) {
                        	pic = e.target.result;
			}
                        f.thumb = [
                                '<img width="125" height="125" src="',
                                pic,
                                '" title="',
                                locf.name,
				 '" alt="',
                                locf.name,
                                '" class="w-12 h-12" />'
                            ].join(''); 
                            f.meta = locf.name;
                    };
                })(f.file);
                reader.readAsDataURL(f.file);
                break;
            case /audio/.test(f.file.type):
                console.log("Audio type detected");
                var audioUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<audio controls class="h-9 w-9" width="125" height="125"> ',
		    '<source src="',
                    audioUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </audio> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /video/.test(f.file.type):
                console.log("Video type detected");
                var videoUrl = window.URL.createObjectURL(f.file);
                f.thumb = [
                    '<video controls class="h-9 w-9" width="125" height="125">',
		    '<source src="',
                    videoUrl,
                    '" title="',
                    f.file.name,
                    '" alt="',
                    f.file.name,
                    '" > </source> </video> />'
                ].join('');
                f.meta = f.file.name;
                break;
            case /pdf/.test(f.file.type):
                console.log("PDF type detected");
                var pdfURL = window.URL.createObjectURL(f.file);
                f.meta = f.file.name;
                PDFObject.embed(pdfURL, target);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[type];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                f.meta = f.file.name;
                let pic = "src/assets/icons/filetypes/" + fileIcon;
                f.thumb = [
                    '<img width="125" height="125" src=',
                    pic,
                    '" title="',
                    f.file.name,
		    '" alt="',
                    f.file.name,
                    '" class="w-12 h-12" />'
                ].join('');
                break;
        }
    }

    createBars() {
        if (!this.thumbNailsDone) {
            return;
        }
        this.progressBars = [];
        for (var i = 0; i < this.uploadFileInfos.length; i++) {
            let f = this.uploadFileInfos[i];
            let id = 'a' + i;
            let bar = new ldBar('#' + id, {
                preset: this.form.progType.toLowerCase()
            });
            bar.set(0);
            console.log("Creating progress bar::" + id);
            this.progressBars.push(bar);
            this.showThumbnail(f, i);
        }
        for (var i = 0; i < this.errInfos.length; i++) {
            let f = this.errInfos[i];
            this.showErrThumbnail(f, i);
        }
        this.thumbNailsDone = false;
    }

    printBannedBanner(file:File, id: string, ts:string, msg:string) {
        this.errInfos.push({
            file: file,
            id: id,
            meta: '',
            thumb: '',
            ts: ts,
            msg: msg
        });
    }

    setupUpload() {
        var delQ:number[] = [];
        for (var i = 0; i < this.uploadFileList.length; i++) {
            let f = this.uploadFileList[i];
            let mime = f.type;
            let name = f.name;
            let ts = f.lastModifiedDate.toLocaleDateString();
            this.totalsize += f.size;
            let size = this.humanFileSize(f.size);
            let id = 'a' + i;
            if (!this.checkSize(f.size)) {
                console.log("Size check:: size is " + f.size);
                let msg = `${name} too big for upload`;
                console.log(msg);
                this.printBannedBanner(f, id, ts, msg);
                delQ.push(i);
                continue;
            }
            if (!this.checkFilter(mime)) {
                console.log("Hit banned file type:: filter issue");
                let msg = `${name} cannot be uploaded due to policy.`;
                this.printBannedBanner(f, id, ts, msg);
                delQ.push(i);
                continue;
            }
            if (i == this.uploadFileList.length - 1) {
                console.log("Total size check:: total size is " + this.totalsize);
                if (!this.checkTotalSize()) {
                    let msg = `Total size exceeds policy, delete some`;
                    this.disableUpload = true;
                }
            }
            this.uploadFileInfos.push({
                file: f,
                id: id,
                ts: ts,
                meta: '',
                thumb: '',
                bytesSent: '',
                eta: '',
                rate: '',
            });
            this.totalfiles += 1;
        }
        this.uploadFileList = this.uploadFileList.filter(function(value:
any, index:any) {
            return delQ.indexOf(index) == -1;
        });
        this.disableUpload = false;
    }

    delItem(index:number) {
        let list = [...this.uploadFileList];
        this.totalsize -= this.uploadFileList[index].size;
        list.splice(index, 1);
        this.uploadFileList = list;
        this.uploadFileInfos = list;
        this.checkTotalSize();
    }


}
