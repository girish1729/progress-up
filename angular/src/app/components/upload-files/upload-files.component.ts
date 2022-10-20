import { Component} from '@angular/core';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})

export class UploadFilesComponent {

  progress:any = [];
  fileLoaded = 0;
  files:any = [];

  constructor(private uploadService: UploadFileService) { }

  uploadOneFile(file:File) {
	
  this.uploadService.upload(file).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
	 if(event.total) {
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

  onFileUpload(event:any) {

    this.files = (event.target as HTMLInputElement).files;
     if(this.files) {
     for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        if (file) {
            this.uploadOneFile(file);
        }
    }
	}
  }


  reloadPage() {
	location.reload();
  }
}
