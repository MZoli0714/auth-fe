import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { UpdateUser } from 'src/app/models/update-user';
import { User } from 'src/app/models/user';
import { RestService } from 'src/app/services/rest.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  
  constructor(private fb: FormBuilder, private apiService: UserAuthService, private restService: RestService,
    private messageService: MessageService) { }

  @Input() userName: string = '';
  updateForm!: FormGroup;
  updateSubscription:any;
  
  // email: string = '';
  // username: string = '';
  // bio: string = '';
  // image: string = '';

  updateUser: UpdateUser | undefined;
  displayModal: boolean = false;

  showModalDialog() {
    if(this.displayModal == false)
      //unsubscribe

    this.apiService.getUserInfo().subscribe({
      next: (data: any) => {
        this.updateForm.get('email')?.setValue(data.user.email)
        this.updateForm.get('username')?.setValue(data.user.username)
        this.updateForm.get('bio')?.setValue(data.user.bio)
        this.updateForm.get('image')?.setValue(data.user.image)
        // this.email = data.user.email;
        // this.username = data.user.username;
        // this.bio = data.user.bio;
        // this.image = data.user.image;
      },
      error: (e) => {
        this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
      },
      complete: () => {
        // this.userProfile = {...this.userProfile} as User
      }
    });
    this.displayModal = true;
  }

  ngOnInit(): void{
    this.updateForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      bio: new FormControl(''),
      image: new FormControl('')
    });
  }

  update(): void{

    this.updateUser = {
      bio: this.updateForm.value['bio'],
      email: this.updateForm.value['email'],
      image: this.updateForm.value['image'],
      username: this.updateForm.value['username']
    }

    this.updateSubscription = this.apiService.updateUser(this.updateUser).subscribe({
      error: (error) =>{
        this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(error.error.errors)});
      },
      complete: () => {
        this.messageService.add({severity:'success', summary:'Update', detail: 'User has been updated'});
        this.userName = this.updateForm.value['username']
        this.apiService.refreshUserInfo();
        this.displayModal=false;
      }
    })

    // Check if the user / email already exists.
    // let isExists: boolean = false;
    // this.restService.getAllUsers().pipe(
    //   filter(users => {
    //     let foundUser = null;
    //     foundUser = users.find(user => (user.username === this.updateForm.value['username'] || user.email === this.updateForm.value['email'] ) );
    //     // isExists = foundUser ? true : false;
    //     if(foundUser) {
    //       console.log(foundUser)
    //       console.log(foundUser.username)
    //       console.log(foundUser.username === this.userName)
    //       return foundUser.username === this.userName ? true : false;
    //     }
    //     return !foundUser && this.updateForm.value['username'];
    //   })
    // ).subscribe({
    //   error: (e) => {
    //     this.messageService.add({severity:'error', summary:'Error', detail: JSON.stringify(e.error.errors)});
    //   },
    //   complete: () => {
    //     if((this.updateUser !== undefined)) {
    //       console.log("teszt")
    //       this.apiService.updateUser(this.updateUser).subscribe({
    //         next:(a)=>{
    //           console.log(a)
    //         }
    //       })
    //       this.displayModal=false;
    //     }
    //   }
    // });
    
  }

  ngOnDestroy(): void{
    if(this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}
