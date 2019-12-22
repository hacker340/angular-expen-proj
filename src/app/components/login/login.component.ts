import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  user$: Observable<any>;
  sub: any;
  constructor(
    private appSrv: AppService,
    private authSrv: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user$ = this.authSrv.user$;
    this.sub = this.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async logIn() {
    await this.authSrv.googleSignIn();
    if (this.authSrv.user) {
      this.appSrv.showSuccess('User logged in');
      this.router.navigate(['/']);
    }
  }
}
