import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutProjectComponent } from './shared/about-project/about-project.component';
import { ArticleComponent } from './controllers/article/article.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LoginComponent } from './controllers/user/login/login.component';
import { RegisterComponent } from './controllers/user/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { UserListComponent } from './controllers/user/user-list/user-list.component';

const routes: Routes = [
  { path: '', component: ArticleComponent,  canActivate: [AuthGuard]  },
  { path: 'about', component: AboutProjectComponent, canActivate: [AuthGuard] },
  { path: 'user/list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
