import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignStudentsToTeacherClassesComponent } from '../teacher/home/assign-student-teacher-classes/assign-student-teacher-classes.component';
import { TeacherComponent } from '../teacher/home/teachers/teacher.component';
import { AssignStudentsToTutorClassesComponent } from '../tutor/home/assign-student-tutor-classes/assign-student-tutor-classes.component';
import { TutorsComponent } from '../tutor/home/tutors/tutors.component';
import { ServiceGroupListComponent } from './activity/service-group-list/service-group-list.component';
import { ServicesListComponent } from './activity/services-list/services-list.component';
import { CollegeListComponent } from './customize/college-list/college-list.component';
import { CustomFieldsComponent } from './customize/custom-fields/custom-fields.component';
import { GradeStandingGroupListComponent } from './customize/grade/group/grade-standing-group-list.component';
import { GradeStandingListComponent } from './customize/grade/standing/grade-standing-list.component';
import { PulldownListComponent } from './customize/pulldown-list/pulldown-list.component';
import { SchoolListComponent } from './customize/school-list/school-list.component';
import { ConfigSettingsComponent } from './home/config-settings/config-settings.component';
import { SystemPreferencesComponent } from './home/system-preferences/system-preferences.component';
import { UserNamesAndPasswordComponent } from './home/user-names-password/user-names-and-pwd.component';

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
  },
  {
    path: 'admin/config-settings',
    component: ConfigSettingsComponent
  },
  {
    path: 'admin/user-names-pwd',
    component: UserNamesAndPasswordComponent
  },
  {
    path: 'admin/system-preferences',
    component: SystemPreferencesComponent
  },
  {
    path: 'tutor/assign-tutor-student-class',
    component: AssignStudentsToTutorClassesComponent
  },
  {
    path: 'tutor/tutors',
    component: TutorsComponent
  },
  {
    path: 'teacher/assign-student-teacher-class',
    component: AssignStudentsToTeacherClassesComponent
  },
  {
    path: 'teacher/teachers',
    component: TeacherComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
