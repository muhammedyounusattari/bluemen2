import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffMemberComponent } from './home/staff-member/staff-member.component.';
const routes: Routes = [
    {
        path: 'staff/staff-members',
        component: StaffMemberComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
