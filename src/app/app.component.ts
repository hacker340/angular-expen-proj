import { Component } from '@angular/core';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Expences';
  user$: any;
  menuList: any[] = [
    { name: 'Home', link: '/' },
    { name: 'Settings', link: '/settings' },
    { name: 'Profile', link: '/profile' }

  ];
  constructor(
    private authSrv: AuthService,
    private appSrv: AppService
  ) {
    this.user$ = this.authSrv.user$;
  }

  async logOut() {
    if (await this.authSrv.signOut()) {
      this.appSrv.showSuccess('User logged in');
    }
  }
}
