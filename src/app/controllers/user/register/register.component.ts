import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateUser } from 'src/app/models/create-user';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private fb: FormBuilder, private apiService: UserAuthService,
          private router: Router,private messageService: MessageService) { }

  registerForm!: FormGroup;
  registerSubscription: Subscription | undefined;        

  ngOnInit(): void{
    this.registerForm = this.fb.group({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)])
    });
  }

  onSubmit(): void{

    let registerObj: CreateUser = {
      username: this.registerForm.value['username'],
      email: this.registerForm.value['email'],
      password: this.registerForm.value['password']
    };

    this.registerSubscription = this.apiService.registerUser(registerObj)
      .subscribe({
        next: (result) => {
          localStorage.setItem('token', result['token']);
          this.messageService.add({severity:'info', summary:'Register', detail:'User has been created'});
        },
        error: (e) => {
          this.messageService.add({severity:'error', summary:e.error?.message, detail:JSON.stringify(e.error.errors)});
        },
        complete: () => {
          this.router.navigate(['/register']);
        }
    });
  }

  ngOnDestroy(): void {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

}
