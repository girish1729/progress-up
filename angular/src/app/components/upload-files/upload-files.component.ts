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

  selectedFiles: any;
  currentFile: any;
  progress = 0;
  message = '';

  constructor(private uploadService: UploadFileService) { }

  selectFile(event:any) {
    this.selectedFiles = (event.target as HTMLInputElement).files;
  }

  upload() {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFile).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
	 if(event.total) {
	   const total: number = event.total;
          this.progress = Math.round(100 * event.loaded / total);
	 }
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });

    this.selectedFiles = undefined;
  }
}
