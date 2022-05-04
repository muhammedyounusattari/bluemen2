import { NO_ERRORS_SCHEMA, NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { RolesComponent } from './home/roles/roles.component';

import { SharedComponentModule } from '../../shared/components/shared-components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LabSettingsPreferencesComponent } from './customize/lab-settings/lab-settings-preferences.component';
import { TimeClockManagerComponent } from './system-tools/time-clock-mgr/time-clock-manager.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecallStudentsComponent } from './system-tools/recall-students/recall-students.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TeacherClassesComponent } from '../teacher/home/classes/teachers-classes.component';
import { CounselorClassesComponent } from '../counselor/home/classes/counselors-classes.component';
import { TutorClassesComponent } from '../tutor/home/classes/tutor-classes.component';
import { StaffClassesComponent } from '../staff/home/classes/staff-classes.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminCustomizeComponent } from './customize/admin-customize.component';
import { StaffMemberComponent } from 'src/app/component/staff/home/staff-member/staff-member.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { PullTypeComponent } from './home/pull-type/pull-type.component';

import { MoveMergeDialogBoxComponent } from '../../shared/components/move-merge-dialog-box/move-merge-dialog-box.component';
import { ServiceListMoveBoxComponent } from './customize/move-box/service-list-move-box/service-list-move-box.component';
import { ServiceListMergeBoxComponent } from './customize/merge-box/service-list-merge-box/service-list-merge-box.component';
import { ServiceGroupListMoveBoxComponent } from './customize/move-box/service-group-list-move-box/service-group-list-move-box.component';
import { ServiceGroupListMergeBoxComponent } from './customize/merge-box/service-group-list-merge-box/service-group-list-merge-box.component';
import { GradeStandingGroupListMoveBoxComponent } from './customize/move-box/grade-standing-group-list-move-box/grade-standing-group-list-move-box.component';
import { GradeStandingListMoveBoxComponent } from './customize/move-box/grade-standing-list-move-box/grade-standing-list-move-box.component';
import { GradeStandingGroupListMergeBoxComponent } from './customize/merge-box/grade-standing-group-list-merge-box/grade-standing-group-list-merge-box.component';
import { GradeStandingListMergeBoxComponent } from './customize/merge-box/grade-standing-list-merge-box/grade-standing-list-merge-box.component';
import { CollegeSchoolListMergeBoxComponent } from './customize/merge-box/college-school-list-merge-box/college-school-list-merge-box.component';
import { CollegeSchoolListMoveBoxComponent } from './customize/move-box/college-school-list-move-box/college-school-list-move-box.component';
import { PhoneMaskPipe } from 'src/app/shared/mask/phone-mask-pipe';
import { NgxMaskModule , IConfig} from 'ngx-mask'
import { OrganizationComponent } from '../super-admin/organization/organization.component';
import { SecurityQuestionsComponent } from '../super-admin/security-question/security-questions.component';
import { StaffMemberMergeBoxComponent } from './customize/merge-box/staff-member-merge-box/staff-member-merge-box.component';
import { StaffMemberMoveBoxComponent } from './customize/move-box/staff-member-move-box/staff-member-move-box.component';
import { GradeStandingComponent } from './customize/grade-standing/grade-standing.component';
import { GradeComponent } from './customize/grade-standing/grade/grade.component';
import { StandingComponent } from './customize/grade-standing/standing/standing.component';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: true,
  };
};
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
    LabSettingsPreferencesComponent,
    TimeClockManagerComponent,
    RecallStudentsComponent,
    ConfirmDialogComponent,
    TeacherClassesComponent,
    CounselorClassesComponent,
    TutorClassesComponent,
    StaffClassesComponent,
    RolesComponent,
    AdminHomeComponent,
    AdminCustomizeComponent,
    StaffMemberComponent,
    PullTypeComponent,
    MoveMergeDialogBoxComponent,
    ServiceListMoveBoxComponent,
    ServiceListMergeBoxComponent,
    ServiceGroupListMoveBoxComponent,
    ServiceGroupListMergeBoxComponent,
    GradeStandingGroupListMoveBoxComponent,
    GradeStandingListMoveBoxComponent,
    GradeStandingGroupListMergeBoxComponent,
    GradeStandingListMergeBoxComponent,
    CollegeSchoolListMergeBoxComponent,
    CollegeSchoolListMoveBoxComponent,
    PhoneMaskPipe,
    OrganizationComponent,
    SecurityQuestionsComponent,
    StaffMemberMergeBoxComponent,
    StaffMemberMoveBoxComponent,
    GradeStandingComponent,
    GradeComponent,
    StandingComponent
  ],
  imports: [
    AdminRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSelectFilterModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatExpansionModule,
    MatTreeModule,
    DemoNgZorroAntdModule,
    NgxMaskModule.forRoot(maskConfigFunction)
  ],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe
  ]
})
export class AdminModule { }
