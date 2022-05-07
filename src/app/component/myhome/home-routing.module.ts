import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import {ShowLoggedUsersComponent} from '../myhome/home/show-logged-users/show-logged-users';
import {ChangePasswordComponent} from '../myhome/home/change-my-password/change-password';
const routes: Routes = [
   {
    path: 'home/logged-user',
    component: ShowLoggedUsersComponent,
    data: {
      title: 'Logged In Password',
      breadcrumb: [
        {
          label: 'My Home',
          url: '/'
        },
        {
          label: 'Home',
          url: '/home'
        },
        {
          label: 'Logged Users',
          url: 'home/logged-user'
        }
      ]
    }
   },
   {
    path: 'home/change-password',
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password',
      breadcrumb: [
        {
          label: 'My Home',
          url: '/'
        },
        {
          label: 'Home',
          url: '/home'
        },
        {
          label: 'Change Password',
          url: 'home/change-password'
        }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {

}
