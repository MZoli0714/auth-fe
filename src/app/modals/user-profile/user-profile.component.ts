import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProfileUser } from 'src/app/models/profile-user';
import { UpdateUser } from 'src/app/models/update-user';
import { RestService } from 'src/app/services/rest.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {


  constructor(private fb: FormBuilder, private apiService: UserAuthService, private restService: RestService,
    private messageService: MessageService) { }

  @Input() profileUserName: string = '';
  profileUser: ProfileUser = {
    profile: {
      bio: "",
      following: false,
      image: "",
      username: ""
    }
  };

  profileUserSubscription:any;
  displayModal: boolean = false;

  showModalDialog(username: string) {

   this.profileUserSubscription = this.restService.getProfileByUserName(username).subscribe({
      next: (data: ProfileUser) => {
        this.profileUser.profile.bio = data.profile.bio !== '' ? data.profile.bio : 'undefined';
        this.profileUser.profile.following = data.profile.following !== null ? data.profile.following : false;
        this.profileUser.profile.username = data.profile.username !== '' ? data.profile.username : 'undefined';
        this.profileUser.profile.image = data.profile.image !== '' ? data.profile.image : 'undefined';
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
      },
      complete: () => {
      }
    });
    this.displayModal = true;
  }

  unFollowUser(username: string): void{
    this.restService.unFollowUserByUserName(username).subscribe({
      next: (data: ProfileUser) => {
        this.profileUser.profile.following = data.profile.following !== null ? data.profile.following : false;       
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
      },
      complete: () => {
      }
    });
  }

  followUser(username: string): void{
    this.restService.followUserByUserName(username).subscribe({
      next: (data: ProfileUser) => {
        this.profileUser.profile.following = data.profile.following !== null ? data.profile.following : false;       
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void{
    if(this.profileUserSubscription) {
      this.profileUserSubscription.unsubscribe();
    }
  }

}
