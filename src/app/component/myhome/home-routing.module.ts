import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import {ShowLoggedUsersComponent} from '../myhome/home/show-logged-users/show-logged-users';
import {ChangePasswordComponent} from '../myhome/home/change-my-password/change-password';
const routes: Routes = [
   {
    path: 'home/logged-user',
    component: ShowLoggedUsersComponent
   },
   {
    path: 'home/change-password',
    component: ChangePasswordComponent
   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {

}
