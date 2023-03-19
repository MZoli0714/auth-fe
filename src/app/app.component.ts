import { Component } from '@angular/core';
import { CreateUser } from './models/create-user';
import { LoginUser } from './models/login-user';
import { UserAuthService } from './services/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Auth | CRUD project';

  constructor(private apiService:UserAuthService) {}

  ngOnInit() {


    // this.apiService.registerUser(tmpUser)
    //   .subscribe({
    //     next: (result) => console.log(result),
    //     error: (e) => console.error(e),
    //     complete: () => console.info('complete') 
    // })

    // this.apiService.loginUser(tmpLogin)
    //   .subscribe({
    //     next: (result) => {
    //       localStorage.setItem('token',result.user['token'])
    //     },
    //     error: (e) => console.error(e),
    //     complete: () => console.info('complete') 
    //   })


      // this.apiService.deleteUser('tmp1@tmp.com')
      // .subscribe({
      //   next: (result) => console.log(result),
      //   error: (e) => console.error(e),
      //   complete: () => console.info('complete') 
      // })



  }

}
