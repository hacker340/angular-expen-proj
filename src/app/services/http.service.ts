import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public http: HttpClient
  ) { }


  public create(url: string, data: any) {
    return this.http.post(url, data).toPromise();
  }

  public update(url: string, id: any, data: any) {
    return this.http.put(url + '/' + id, data).toPromise();
  }

  public getById(url: string, id: any) {
    return this.http.get(url + '/' + id).toPromise();
  }

  public get(url: string, params?: any) {
    return this.http.get(url, { params }).toPromise();
  }

  public delete(url: string, id: any) {
    return this.http.delete(url + '/' + id).toPromise();
  }
}
