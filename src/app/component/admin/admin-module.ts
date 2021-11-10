import { NgModule } from '@angular/core';

import { PulldownListComponent } from './customize/pulldown-list/pulldown-list.component';
import { ServiceGroupListComponent } from './activity/service-group-list/service-group-list.component';
import { ServicesListComponent } from './activity/services-list/services-list.component';
import { CollegeListComponent } from './customize/college-list/college-list.component';
import { CustomFieldsComponent } from './customize/custom-fields/custom-fields.component';
import { SchoolListComponent } from './customize/school-list/school-list.component';
import { GradeStandingGroupListComponent } from './customize/grade/group/grade-standing-group-list.component';
import { GradeStandingListComponent } from './customize/grade/standing/grade-standing-list.component';

@NgModule({
  declarations: [
    PulldownListComponent,
    ServiceGroupListComponent,
    ServicesListComponent,
    CollegeListComponent,
    CustomFieldsComponent,
    SchoolListComponent,
    GradeStandingGroupListComponent,
    GradeStandingListComponent
  ],
  imports: [],
  providers: []
})
export class AdminModule { }
