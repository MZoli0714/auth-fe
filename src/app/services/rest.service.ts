import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Article } from '../models/article';
import { ProfileUser } from '../models/profile-user';
import { User } from '../models/user';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  authToken: string='';

  constructor(private http: HttpClient, private messageService: MessageService, private userAuthService: UserAuthService) { 
    this.authToken = localStorage.getItem('token') ?? '';
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userAuthService.baseURL+"users", {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      tap((response:User[]) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Get Users', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }

  getProfileByUserName(username: string): Observable<ProfileUser> {
    return this.http.get<any>(this.userAuthService.baseURL+"profiles/"+username, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Get Profil', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }

  // Authorization issue only with this
  followUserByUserName(username: string): Observable<any> {
    return this.http.post<any>(this.userAuthService.baseURL+"profiles/"+username+"/follow", {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Follow Profil', detail:JSON.stringify(error.error)});
        return throwError(() => error);
      })
    );
  }

  unFollowUserByUserName(username: string): Observable<ProfileUser> {
    return this.http.delete<any>(this.userAuthService.baseURL+"profiles/"+username+"/follow", {
      headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Unfollow Profil', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }


  getAllArticles(): Observable<Article> {
    return this.http.get<Article>(this.userAuthService.baseURL+"articles", {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      tap((response:Article) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Get Articles', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }

  getArticleBySlug(slug: string): Observable<any> {
    return this.http.get<any>(this.userAuthService.baseURL+"articles/"+slug, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      tap((response:any) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Get Articles', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    );
  }
  
  
  updateArticle(articleObj: Article, slug: string): Observable<Article> {
    return this.http.put<Article>(this.userAuthService.baseURL+"articles/"+slug,articleObj,{
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Update Article', detail:JSON.stringify(error.error)});
        return throwError(() => error);
      })
    );
  }

  createArticle(articleObj: Article): Observable<any> {
    return this.http.post<any>(this.userAuthService.baseURL+"articles",articleObj,{
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Create Article', detail:JSON.stringify(error.error)});
        return throwError(() => error);
      })
    );
  }

  favoriteArticle(slug: string): Observable<any> {
    return this.http.post<any>(this.userAuthService.baseURL+"articles/"+slug+"/favorite",{
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Favorite Article', detail:JSON.stringify(error.error)});
        return throwError(() => error);
      })
    );
  }

  deleteArticle(slug: string): Observable<any> {
    return this.http.delete(this.userAuthService.baseURL+"articles/"+slug,{
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary:'Delete', detail:JSON.stringify(error.error.errors)});
        return throwError(() => error);
      })
    )
  }

}
