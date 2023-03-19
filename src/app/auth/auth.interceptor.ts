import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public userAuthService: UserAuthService, public messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {          
          this.messageService.add({severity:'error', summary:'Interceptor', detail:'Authorization failed!'});
          this.userAuthService.logout();
        } else if (error.status === 404) {
          this.messageService.add({severity:'error', summary:'Interceptor', detail:'Page is not found!'});
        } else if (error.status === 500) {
          this.messageService.add({severity:'error', summary:'Interceptor', detail:'Internal server error!'});
        }
        return throwError(() => error);
      })
    );
  }
}
