import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProgressUpService {

  constructor(private http: HttpClient) { }

  config = {
	filesArray: string,
	uploadURL:string
  };
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(config.filesArray, file);
    const req = new HttpRequest('POST', config.uploadURL, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}
