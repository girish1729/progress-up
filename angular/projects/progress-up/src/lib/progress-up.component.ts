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

@Component({
  selector: 'progress-up',
  template:
`
<div class="progress-up-wrapper">

 <div class='text-center'>
   <button (click)="clearAll()" class="clearButton" role="button">Clear all</button>
 </div>

 <form class='progress-up-form' action="#">
      <input type="file" #fileInput (change)="onChange($event)" multiple hidden />
        <div (dragover)="onDragOver($event)" (drop)="onDropSuccess($event)" (click)="fileInput.click()" >
      <i class="fas fa-8x fa-cloud-upload-alt"></i>
        <h2>Browse Files to Upload</h2>
	</div>
 </form>

 <section *ngIf="showProgress" class='progress-up-area' >
   <div *ngFor="let file of uploadFiles">
    <li class="row">
         <i class="fas fa-3x fa-file-alt"></i>
          <div class="content">
                <div class="details">
                   <span class="name">{{file.name}} </span>
                    <span class="percent">{{progress[file.name]}} %</span>
                 </div>
                 <div class="progress-bar">
                    <div class="progress" style="width: {{progress[file.name]}}%">
		    </div>
                 </div>
                 <span class="size">{{file.size}} Bytes</span>
           </div>
    </li>
    </div>
 </section>

</div>
`
, 
styleUrls: [
	'./progress-up.component.css'
],
encapsulation: ViewEncapsulation.None

})

export class ProgressUpComponent {
    @Input('uploadURL') url:string = '';
    @Input('filesName') fname:string = '';

    progress: any = {};
    showProgress:boolean = true;
    fileLoaded = 0;
    uploadFiles: any = [];

    constructor(private uploadService: ProgressUpService) {}

    uploadOneFile(file: File) {

        this.uploadService.upload(this.url, this.fname, file).subscribe(
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

 onChange(event:any) {
	this.onFileUpload(event.target.files);
}
    onFileUpload(files:FileList) {
        //let files = (event.target as HTMLInputElement).files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                this.uploadOneFile(file);
                this.uploadFiles.push(file);
            }
        }
    }

onDragOver(event:any) {
    event.preventDefault();
}

// From drag and drop
onDropSuccess(event:any) {
    event.preventDefault();
    this.onFileUpload(event.dataTransfer.files);
}
    clearAll() {
        this.showProgress = false;
    }
}
