import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/app/component/myhome/home/home.component';
import { PendingChangesGuard } from './shared/components/canDeactivate/can-deactivate.component';
import { LoginComponent } from './component/login/login.component';
import { ResetPasswordComponent } from 'src/app/component/reset-password/reset-password.component';
import { OrgUserLoginComponent } from './component/org-user-login/org-user-login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'user-login',
    component: OrgUserLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
