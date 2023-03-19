import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, EMPTY, Observable, tap, throwError } from 'rxjs';
import { CreateUser } from '../models/create-user';
import { LoginUser } from '../models/login-user';
import { UpdateUser } from '../models/update-user';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  baseURL = "http://localhost:3000/api/";
  authToken = localStorage.getItem('token');

  private userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  public getHeaders() {
    return new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    })
  }

  constructor(private http: HttpClient, private messageService: MessageService, private router: Router) { }

  registerUser(user: CreateUser): Observable<User>{   
    return this.http.post<User>(this.baseURL+'users',user,{'headers':this.getHeaders()}).pipe(
      tap((response:any) => {
        this.setAuthToken(response.user.token)
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Register', detail: JSON.stringify(error.error.errors) });
        this.clearAuthToken();
        return throwError(() => error);
      })
    )
  }

  loginUser(user: LoginUser): Observable<User> {
    return this.http.post<User>(this.baseURL + 'login', user, { headers: this.getHeaders() }).pipe(
      tap((response:any) => { // CREATE A NEW MODEL
        this.setAuthToken(response.user.token)
        return (response.status === 204) ? {} : response.body
      }),
      catchError((error: HttpErrorResponse) => {
        this.clearAuthToken();
        this.messageService.add({severity:'error', summary:'Login', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }

  updateUser(user: UpdateUser): Observable<UpdateUser> {
    return this.http.put<UpdateUser>(this.baseURL + 'user', user, { headers: this.getHeaders() }).pipe(
      tap((response:any) => {
        return (response.status === 204) ? {} : response.body
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Update', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }

  logout(): void{
    this.clearAuthToken(); 
    this.router.navigate(['/login']);
  }

  deleteUser(user: string): Observable<any> {
    return this.http.delete(this.baseURL+'users/'+user,{'headers':this.getHeaders()}).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Delete', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    )
  }



  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  clearAuthToken(): void {
    localStorage.removeItem('token');
  }
  
  public getUserInfo(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.getAuthToken() });
    return this.http.get(this.baseURL + 'user', { headers: headers });
  }

  public refreshUserInfo(): void {
    this.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfoSubject.next(userInfo);
      },
      error: () => {
        this.userInfoSubject.next(null);
      }
    });
  }
  
}
