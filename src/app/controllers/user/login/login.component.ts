import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginUser } from 'src/app/models/login-user';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  
  constructor(private fb: FormBuilder, private apiService: UserAuthService,
    private router: Router,private messageService: MessageService) { }
    
    loginForm!: FormGroup;
    loginSubscription:any;

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
  }

  login(): void{

    let loginObj: LoginUser = {
      email: this.loginForm.value['email'],
      password: this.loginForm.value['password']
    };

    this.loginSubscription = this.apiService.loginUser(loginObj)
      .subscribe({
        next: () => {
          this.messageService.add({severity:'info', summary:'Login', detail:'Successfully login'});
        },
        error: (e) => {
          this.messageService.add({severity:'error', summary:'Error', detail:JSON.stringify(e.error.errors)});
        },
        complete: () => {
          this.router.navigate(['/']);
        }
    })
  }

  ngOnDestroy(): void {
    this.loginSubscription ? this.loginSubscription.unsubscribe() : '';
  }

}
