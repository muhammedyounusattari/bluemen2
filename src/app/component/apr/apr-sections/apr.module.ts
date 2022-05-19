import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AprRoutingModule } from './apr-routing.module';
import { AnnualPerformanceReportSectionOneComponent } from './annual-performance-report-section-one/annual-performance-report-section-one.component';
import { AnnualPerformanceReportSectionOnePartTwoComponent } from './annual-performance-report-section-one-part-two/annual-performance-report-section-one-part-two.component';
import { AnnualPerformanceReportSectionTwoComponent } from './annual-performance-report-section-two/annual-performance-report-section-two.component';
import { AnnualPerformanceReportSectionTwoEditComponent } from './annual-performance-report-section-two-edit/annual-performance-report-section-two-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from 'src/app/shared/components/shared-components.module';
import { DemoNgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ContactsComponent } from './contacts/contacts.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { SemesterComponent } from './semester/semester.component';
import { NotesComponent } from './notes/notes.component';
import { ExamsLogComponent } from './exams-log/exams-log.component';
import { SubExamsComponent } from './sub-exams/sub-exams.component';
import { WalletComponent } from './wallet/wallet.component';
import { AttendanceLogComponent } from './attendance-log/attendance-log.component';
import { StipendComponent } from './stipend/stipend.component';
import { ScheduleClassesComponent } from './schedule-classes/schedule-classes.component';
import { GraduatedComponent } from './graduated/graduated.component';
import { CustomListsComponent } from './custom-lists/custom-lists.component';
import { AprFieldsComponent } from './apr-fields/apr-fields.component';
import { StaffComponent } from './staff/staff.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { MarkStudentsComponent } from './mark-students/mark-students.component';
import { ContactServicesComponent } from './contact-services/contact-services.component';
import { YearlyInformationComponent } from './yearly-information/yearly-information.component';
import { TextMessageComponent } from './text-message/text-message.component';
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: true,
  };
};

@NgModule({
  declarations: [
    AnnualPerformanceReportSectionOneComponent,
    AnnualPerformanceReportSectionOnePartTwoComponent,
    AnnualPerformanceReportSectionTwoComponent,
    AnnualPerformanceReportSectionTwoEditComponent,
    ContactsComponent,
    CoursesComponent,
    StudentProfileComponent,
    SemesterComponent,
    NotesComponent,
    ExamsLogComponent,
    SubExamsComponent,
    WalletComponent,
    AttendanceLogComponent,
    StipendComponent,
    ScheduleClassesComponent,
    GraduatedComponent,
    CustomListsComponent,
    AprFieldsComponent,
    StaffComponent,
    CustomFieldsComponent,
    MarkStudentsComponent,
    ContactServicesComponent,
    YearlyInformationComponent,
    TextMessageComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    DemoNgZorroAntdModule,
    AprRoutingModule,
    NgxMaskModule.forRoot(maskConfigFunction) 
  ],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA  ],
  providers: [
    DatePipe
  ]
})
export class AprModule { }
