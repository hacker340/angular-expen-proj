import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  sub: any;
  user: User = new User();
  constructor(
    private authSrv: AuthService,
  ) { }

  ngOnInit() {
    this.user$ = this.authSrv.user$;
    this.sub = this.user$.subscribe(user => {
      if (user) {
        this.user = user;
        console.log(this.user);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
