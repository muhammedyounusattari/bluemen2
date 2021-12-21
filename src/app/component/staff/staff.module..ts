import { NgModule } from '@angular/core';
import { StaffMemberComponent } from './home/staff-member/staff-member.component.';
import { StaffRoutingModule } from './staff-routing.module';
@NgModule({
    declarations: [
        StaffMemberComponent
    ],
    imports: [
        StaffRoutingModule
    ],
    providers: []
  })

  export class StaffModule { }
  