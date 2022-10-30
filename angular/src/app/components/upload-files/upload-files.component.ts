import {
    Component,
    ViewEncapsulation
} from '@angular/core';
import {
    UploadFileService
} from 'src/app/services/upload-file.service';
import {
    HttpEvent,
    HttpEventType,
    HttpResponse
} from '@angular/common/http';
import {
    Observable
} from 'rxjs';

@Component({
    selector: 'app-upload-files',
    encapsulation: viewEncapsulation.None,
    templateUrl: './upload-files.component.html',
    styleUrls: ['https://cdn.jsdelivr.net/gh/girish1729/progress-up/css/progress-up.js']
})

export class UploadFilesComponent {

    progress: any = {};
    fileLoaded = 0;
    uploadFiles: any = [];

    constructor(private uploadService: UploadFileService) {}

    uploadOneFile(file: File) {

        this.uploadService.upload(file).subscribe(
            (event: HttpEvent < any > ) => {
                if (event.type === HttpEventType.UploadProgress) {
                    if (event.total) {
                        const total: number = event.total;
                        this.progress[file.name] = Math.round(100 * event.loaded / total);
                    }
                } else if (event instanceof HttpResponse) {
                    console.log(event);
                }
            },
            err => {
                this.progress[file.name] = 0;
            });
    }

    onFileUpload(event: any) {
        let files = (event.target as HTMLInputElement).files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                this.uploadOneFile(file);
                this.uploadFiles.push(file);
            }
        }
    }

    reloadPage() {
        location.reload();
    }
}
