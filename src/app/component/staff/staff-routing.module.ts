import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffMemberComponent } from './home/staff-member/staff-member.component';
const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
