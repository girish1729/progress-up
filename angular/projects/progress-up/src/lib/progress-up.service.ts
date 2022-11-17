import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProgressUpService {

  constructor(private http: HttpClient) { }

  upload(idx: number, url: string, fname: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(fname, file);
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

}
