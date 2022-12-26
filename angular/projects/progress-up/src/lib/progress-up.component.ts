import {
    Input,
    ChangeDetectorRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    Component,
    OnInit,
    ElementRef,
    Renderer2,
    Inject
} from '@angular/core';
import {
    Pipe,
    PipeTransform,
    SecurityContext
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
    SafeStyle,
    SafeScript,
    SafeUrl,
    SafeResourceUrl
} from '@angular/platform-browser';
import {
    catchError
} from 'rxjs/operators';
import {
    DOCUMENT
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
declare var ldBar: any;

import {
    HttpEvent,
    HttpEventType,
    HttpErrorResponse,
    HttpResponse,
    HttpClient
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
    title: string;
    url: string;
    pic: string;
    meta: string;
    bytesSent: string;
    rate: string;
    eta: string;
    size: string;
};

interface errInfo {
    file: File;
    id: string;
    ts: string;
    title: string;
    url: string;
    pic: string;
    meta: string;
    msg: string;
    size: string;
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

    /*
 transform(value: string): SafeUrl {
    return this.sanitize.bypassSecurityTrustUrl(value);
  }
	*/
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
    form = {
        uploadURL: '',
        filesName: "",
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
    uploadFileList: File[] = [];
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

    constructor(private sanitizer: DomSanitizer,

        private ref: ChangeDetectorRef, private http: HttpClient, @Inject(DOCUMENT) document: Document) {}

    openTab = 1;
    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    toggleTabs($tabNumber: number) {
        this.openTab = $tabNumber;
    }

    darkMode() {
        document.body.classList.toggle('dark');
    }

    handleError(error: HttpErrorResponse) {
        alert("Upload failed to (" + this.form.uploadURL +
            "). Please check endpoint in Setup");
        alert(error);
    }

    uploadOneFile(file: fileInfo, idx: number) {
        const formData: FormData = new FormData();
        formData.append(this.form.filesName, file.file);
        console.log("Uploading to " + this.form.uploadURL);
        console.log("Uploading file name" + this.form.filesName);
        var self = this;
        let options = {
            onUploadProgress: function(e: any) {},
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
                Authorization: basicAuth
            };
        }


        console.log(options);
        this.http.post(this.form.uploadURL, formData, {
            reportProgress: true,
            observe: 'events'
        }).subscribe((e: HttpEvent < any > ) => {
                switch (e.type) {
                    case HttpEventType.UploadProgress:
                        if (e.total && e.loaded) {
                            let perc = Number(e.loaded / e.total * 100);
                            console.log("Perc::" + perc);
                            self.progressBars[idx].set(perc);
                            file.bytesSent = self.humanFileSize(e.loaded *
                                file.file.size);

                            var duration = (new Date().getTime() - self.startUploadts) / 1000;
                            var bps = e.loaded / duration;
                            var kbps = bps / 1024;
                            kbps = Math.floor(kbps);
                            file.rate = String(kbps.toFixed(2) + " KBPS");

                            var time = (e.total - e.loaded) / bps;
                            var seconds = time % 60;
                            var minutes = time / 60;

                            let sec = Math.floor(seconds);
                            let min = Math.floor(minutes);

                            file.eta = String(min + ':' + sec);
                            console.log(file.bytesSent, file.eta, file.rate);
                        }
                        break;
                    case HttpEventType.Response:
                        self.spitStatistics(self, idx);
                        break;
                }
            },
            err => {
                self.progressBars[idx].set(0);
            }
        );
    }

    uploadAll() {
        this.startUploadts = Date.now();
        if (this.uploadFileInfos) {
            for (let i = 0; i < this.uploadFileInfos.length; i++) {
                let file = this.uploadFileInfos[i];
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

            var ts = new Date().toLocaleDateString();
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

        await this.http.post(this.form.uploadURL,
            testForm).subscribe((resp: any) => {
                alert("Test succeeded");
            },
            err => {
                this.handleError(err);
            });
    }

    testEP() {
        this.saveConfig();
        this.testUpload();
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

    disableCheck() {
        if ((this.form.uploadURL.length > 3) && (this.form.filesName.length > 3)) {
            console.log('Enable upload button if Files in Q');
            if (this.uploadFileInfos && this.uploadFileInfos.length > 0) {
                console.log('Enabled upload button');
                this.disableUpload = false;
            } else {
                this.disableUpload = true;
            }
        } else {
            console.log('Disable upload without configuration');
            this.disableUpload = true;
        }
    }

    applyFilter() {
        let filt = this.form.fileTypeFilter;
        let action;
        if (this.filterLabel === "Allow file type") {
            action = "allow";
        } else {
            action = "deny";
        }
        console.log("Setting:: mime " + filt + " action " + action);

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
        this.applyFilter();
    }


    wordCount(val: string) {
        var wom = val.match(/\S+/g);
        return {
            chars: val.length,
            words: wom ? wom.length : 0,
            lines: val.split(/\r*\n/).length
        };
    }
    checkFilter(mime: string) {
        /* No filter XXX */
        if (this.filtFiles.type == 'all') {
            console.log("No file type filters active");
            return true;
        }
        if (this.filtFiles.action == "allow" && mime.match(this.filtFiles.type)) {
            return true;
        }
        if (this.filtFiles.action == "deny" && !mime.match(this.filtFiles.type)) {
            return true;
        }
        return false;
    }

    checkSize(size: number) {
        if (this.form.sizeLimitType == "Single file limit") {
            if (size <= (this.form.fileSizeLimit * 1024 * 1024)) {
                return true;
            }
            return false;
        }
        return true;
    }

    checkTotalSize() {
        if (this.form.sizeLimitType == "Total limit") {
            if (this.totalsize <= (this.form.fileSizeLimit * 1024 * 1024)) {
                return true;
            }
            return false;
        }
        return true;
    }

    showThumbnail(f: File, i: number, cb: Function) {
        let self = this;
        let meta = '';
        let pic: any = '';
        let title = '';
        let url: SafeUrl = '';
        let turl = '';
        let ftype = f.type;
        let fkey = ftype.split('/')[0];
        switch (true) {
            case ftype.includes('text'):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
                        let res: any;
                        if (e.target) {
                            res = e.target.result;
                        }
                        let wc = self.wordCount(res);
                        meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = ( < string > res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");
                        var fileIcon = self.fileTypeIcons[fkey];
                        pic = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" + fileIcon;
                        title = txt;
                        url = '';
                        cb(i, title, url, pic, meta);
                    };
                })(f);
                reader.readAsText(f);
                break;
            case ftype.includes('image'):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
                        if (e.target) {
                            pic = e.target.result;
                        }
                        meta = locf.name;
                        title = locf.name;
                        url = '';
                        cb(i, title, url, pic, meta);
                    };
                })(f);
                reader.readAsDataURL(f);
                break;
            case ftype.includes('audio'):
                console.log("Audio type detected");
                turl = window.URL.createObjectURL(f);
                url =
                    this.sanitizer.bypassSecurityTrustUrl(turl);
                meta = f.name;
                title = f.name;
                pic = '';
                cb(i, title, url, pic, meta);
                break;
            case ftype.includes('video'):
                console.log("Video type detected");
                meta = f.name;
                turl = window.URL.createObjectURL(f);
                url =
                    this.sanitizer.bypassSecurityTrustUrl(turl);
                meta = f.name;
                title = f.name;
                pic = '';
                cb(i, title, url, pic, meta);
                break;
            case ftype.includes('pdf'):
                console.log("PDF type detected");
                turl = window.URL.createObjectURL(f);
                let b: any =
                    this.sanitizer.bypassSecurityTrustResourceUrl(turl);
                url = b;
                meta = f.name;
                title = f.name;
                pic = '';
                cb(i, title, url, pic, meta);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[fkey];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                pic = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" + fileIcon;
                meta = f.name;
                title = f.name;
                cb(i, title, url, pic, meta);
                break;
        }
    }


    createBars() {
        if (this.thumbNailsDone) {
            console.log("createBars():: returning immediately");
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
        this.thumbNailsDone = true;
    }

    showErrThumbnail(f: File, cb: Function) {
        let self = this;
        let meta = '';
        let pic: any = '';
        let title = '';
        let url: SafeUrl = '';
        let turl = '';
        let ftype = f.type;
        let fkey = ftype.split('/')[0];
        switch (true) {
            case ftype.includes('text'):
                console.log("Text type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
                        let res: any;
                        if (e.target) {
                            res = e.target.result;
                        }
                        let wc = self.wordCount(res);
                        meta = ` 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
			`;
                        var dataArray = ( < string > res).split("\n");
                        dataArray = dataArray.slice(0, 20);
                        let txt = dataArray.join("\n");
                        var fileIcon = self.fileTypeIcons[fkey];
                        pic = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" + fileIcon;
                        title = txt;
                        url = '';
                        cb(title, url, pic, meta);
                    };
                })(f);
                reader.readAsText(f);
                break;
            case ftype.includes('image'):
                console.log("Image type detected");
                var reader = new FileReader();
                reader.onload = (function(locf) {
                    return function(e) {
                        if (e.target) {
                            pic = e.target.result;
                        }
                        meta = locf.name;
                        title = locf.name;
                        url = '';
                        cb(title, url, pic, meta);
                    };
                })(f);
                reader.readAsDataURL(f);
                break;
            case ftype.includes('audio'):
                console.log("Audio type detected");
                turl = window.URL.createObjectURL(f);
                url =
                    this.sanitizer.bypassSecurityTrustUrl(turl);
                meta = f.name;
                title = f.name;
                pic = '';
                cb(title, url, pic, meta);
                break;
            case ftype.includes('video'):
                console.log("Video type detected");
                meta = f.name;
                turl = window.URL.createObjectURL(f);
                url =
                    this.sanitizer.bypassSecurityTrustUrl(turl);
                meta = f.name;
                title = f.name;
                pic = '';
                cb(title, url, pic, meta);
                break;
            case ftype.includes('pdf'):
                console.log("PDF type detected");
                turl = window.URL.createObjectURL(f);
                let b: any =
                    this.sanitizer.bypassSecurityTrustResourceUrl(turl);
                url = b;
                meta = f.name;
                title = f.name;
                pic = '';
                cb(title, url, pic, meta);
                break;
            default:
                console.log("default type detected");
                var fileIcon = this.fileTypeIcons[fkey];
                if (fileIcon == undefined) {
                    fileIcon = "file.svg";
                }
                pic = "https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/" + fileIcon;
                meta = f.name;
                title = f.name;
                cb(title, url, pic, meta);
                break;
        }
    }


    printBannedBanner(file: File, size: string, id: string, ts: string, msg: string) {
        var self = this;
        this.showErrThumbnail(file, function(title:
            string, url: string, pic: string, meta: string) {
            self.errInfos.push({
                file: file,
                id: id,
                size: size,
                meta: meta,
                title: title,
                url: url,
                pic: pic,
                ts: ts,
                msg: msg
            });
        });
    }

    setupUpload() {
        var delQ: number[] = [];
        for (var i = 0; i < this.uploadFileList.length; i++) {
            let f = this.uploadFileList[i];
            let mime = f.type;
            let name = f.name;
            let ts = new Date(f.lastModified).toLocaleDateString();
            this.totalsize += f.size;
            let size = this.humanFileSize(f.size);
            let id = 'a' + i;
            if (!this.checkSize(f.size)) {
                console.log("Size check:: size is " + f.size);
                let msg = `${name} too big for upload`;
                console.log(msg);
                this.printBannedBanner(f, size, id, ts, msg);
                delQ.push(i);
                continue;
            }
            if (!this.checkFilter(mime)) {
                console.log("Hit banned file type:: filter issue");
                let msg = `${name} cannot be uploaded due to policy.`;
                this.printBannedBanner(f, size, id, ts, msg);
                delQ.push(i);
                continue;
            }
            if (i == this.uploadFileInfos.length - 1) {
                console.log("Total size check:: total size is " + this.totalsize);
                if (!this.checkTotalSize()) {
                    let msg = `Total size exceeds policy, delete some`;
                    this.disableUpload = true;
                }
            }
            this.totalfiles += 1;
        }
        var self = this;

        var tmpFileList = Array.from(this.uploadFileList).filter(function(value, index) {
            return delQ.indexOf(index) == -1;
        });
        console.log(tmpFileList);
        for (var i = 0; i < tmpFileList.length; i++) {
            let f = tmpFileList[i];
            let mime = f.type;
            let name = f.name;
            let ts = f.lastModified.toLocaleString();
            this.totalsize += f.size;
            let size = this.humanFileSize(f.size);
            let id = 'a' + i;

            this.showThumbnail(f, i, function(i: number, title: string, url:
                string, pic: any, meta: string) {
                self.uploadFileInfos.push({
                    file: f,
                    id: id,
                    ts: ts,
                    title: title,
                    url: url,
                    pic: pic,
                    size: size,
                    meta: meta,
                    bytesSent: '0 Bytes',
                    eta: '',
                    rate: '',
                });
            });
        }
        this.disableUpload = false;
    }

    delItem(index: number) {
        this.totalsize -= this.uploadFileInfos[index].file.size;
        let list2 = [...this.uploadFileInfos];
        list2.splice(index, 1);
        this.uploadFileInfos = list2;
        this.checkTotalSize();
    }
}
