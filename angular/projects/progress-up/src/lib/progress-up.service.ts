import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProgressUpService {

  constructor(private http: HttpClient) { }

  config = {
	filesArray: "mFiles",
	uploadURL: "https://localhost:2324/uploadmultiple"
  };

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(this.config.filesArray, file);
    const req = new HttpRequest('POST', this.config.uploadURL, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}
