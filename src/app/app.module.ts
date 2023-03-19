import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserAuthService } from './services/user-auth.service';
import { RegisterComponent } from './controllers/user/register/register.component';
import { LoginComponent } from './controllers/user/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { PrimengModule } from './shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AboutProjectComponent } from './shared/about-project/about-project.component';
import { ArticleComponent } from './controllers/article/article.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UserListComponent } from './controllers/user/user-list/user-list.component';
import { RestService } from './services/rest.service';
import { ProfileComponent } from './modals/profile/profile.component';
import { UserProfileComponent } from './modals/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    PageNotFoundComponent,
    AboutProjectComponent,
    ArticleComponent,
    UserListComponent,
    ProfileComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [UserAuthService, RestService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
