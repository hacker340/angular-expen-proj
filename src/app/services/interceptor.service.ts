import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private authSrv: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authSrv.token;
    let newHeaders = req.headers;
    if (token) {
      newHeaders = newHeaders.append('Authentication', 'Bearer ' + token);
      newHeaders = newHeaders.append('uid', this.authSrv.userId);
    }
    const authReq = req.clone({ headers: newHeaders });
    return next.handle(authReq);
  }
}
