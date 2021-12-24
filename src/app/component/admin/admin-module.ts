import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import { PulldownListComponent } from './customize/pulldown-list/pulldown-list.component';
import { ServiceGroupListComponent } from './activity/service-group-list/service-group-list.component';
import { ServicesListComponent } from './activity/services-list/services-list.component';
import { CollegeListComponent } from './customize/college-list/college-list.component';
import { CustomFieldsComponent } from './customize/custom-fields/custom-fields.component';
import { SchoolListComponent } from './customize/school-list/school-list.component';
import { GradeStandingGroupListComponent } from './customize/grade/group/grade-standing-group-list.component';
import { GradeStandingListComponent } from './customize/grade/standing/grade-standing-list.component';
import { ConfigSettingsComponent } from './home/config-settings/config-settings.component';
import { UserNamesAndPasswordComponent } from './home/user-names-password/user-names-and-pwd.component';
import { SystemPreferencesComponent } from './home/system-preferences/system-preferences.component';
import { AssignStudentsToTutorClassesComponent } from '../tutor/home/assign-student-tutor-classes/assign-student-tutor-classes.component';
import { HttpClientModule } from '@angular/common/http';
import { TutorsComponent } from '../tutor/home/tutors/tutors.component';
import { AssignStudentsToTeacherClassesComponent } from '../teacher/home/assign-student-teacher-classes/assign-student-teacher-classes.component';
import { TeacherComponent } from '../teacher/home/teachers/teacher.component';
import { SharedComponentModule } from '../../shared/components/shared-components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LabSettingsPreferencesComponent } from './customize/lab-settings/lab-settings-preferences.component';

@NgModule({
  declarations: [
    PulldownListComponent,
    ServiceGroupListComponent,
    ServicesListComponent,
    CollegeListComponent,
    CustomFieldsComponent,
    SchoolListComponent,
    GradeStandingGroupListComponent,
    GradeStandingListComponent,
    ConfigSettingsComponent,
    UserNamesAndPasswordComponent,
    SystemPreferencesComponent,
    AssignStudentsToTutorClassesComponent,
    TutorsComponent,
    AssignStudentsToTeacherClassesComponent,
    TeacherComponent,
    LabSettingsPreferencesComponent
  ],
  imports: [
    AdminRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AdminModule { }
