import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileComponent } from 'src/app/modals/profile/profile.component';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  userName: string = '';
  userAthSubscription:any;
  @ViewChild('profile') profile: ProfileComponent | undefined;

  constructor(private userAuth: UserAuthService) { }

  openModal() {
    if(this.profile != undefined) {
      this.profile.showModalDialog();
    }
  }

  ngOnInit(): void {
    this.userAthSubscription = this.userAuth.userInfo$.subscribe(
      userInfo => {
        this.userName = userInfo ? userInfo.user.username : '';
      }
    );
    if(this.userName === '') {
      this.userAuth.refreshUserInfo();
    }
  }

  logout() {
    this.userAuth.logout;
  }

  ngOnDestroy(): void {
    this.userAthSubscription ? this.userAthSubscription.unsubscribe() : '';
  }
}
