import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceGroupListComponent } from './activity/service-group-list/service-group-list.component';
import { ServicesListComponent } from './activity/services-list/services-list.component';
import { CollegeListComponent } from './customize/college-list/college-list.component';
import { CustomFieldsComponent } from './customize/custom-fields/custom-fields.component';
import { GradeStandingGroupListComponent } from './customize/grade/group/grade-standing-group-list.component';
import { GradeStandingListComponent } from './customize/grade/standing/grade-standing-list.component';
import { PulldownListComponent } from './customize/pulldown-list/pulldown-list.component';
import { SchoolListComponent } from './customize/school-list/school-list.component';

const routes: Routes = [
  {
    path: 'admin/pulldown-list',
    component: PulldownListComponent
  },
  {
    path: 'admin/service-group-list',
    component: ServiceGroupListComponent
  },
  {
    path: 'admin/services-list',
    component: ServicesListComponent
  },
  {
    path: 'admin/college-list',
    component: CollegeListComponent
  },
  {
    path: 'admin/custom-fields',
    component: CustomFieldsComponent
  },
  {
    path: 'admin/school-list',
    component: SchoolListComponent
  },
  {
    path: 'admin/grade-standing-list',
    component: GradeStandingListComponent
  },
  {
    path: 'admin/grade-group-list',
    component: GradeStandingGroupListComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
