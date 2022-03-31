import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { StudentRoutingModule } from './student-routing.module';

import { AttendanceLogsComponent } from './logs/attendance/attendance-logs.component';
import { ExamsLogsComponent } from './logs/exams/exams-log.component';
import { NotesLogsComponent } from './logs/notes/notes-logs.component';
import { StipendLogsComponent } from './logs/stipend-logs/stipend-logs.component';
import { TextMessageLogsComponent } from './logs/text-message/text-message-logs.component';
import { TextMessageRepliesLogsComponent } from './logs/text-message-replies/text-message-replies.component';
import { WalletLogsComponent } from './logs/wallet/wallet-logs.component';
import { FiscalYearAndFinancialAidComponent } from './data-entry/fiscal-year/fiscal-year-financial-aid.component';
import { GraduatedComponent } from './data-entry/graduated/graduated.component';
import { SemesterAndCoursesComponent } from './data-entry/semester-courses/semester-courses.component';
import { GlobalFilterModule } from '../global-filter/global-filter.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TutorContactsComponent } from './contacts/tutor-contacts/tutor-contacts.component';
import { TeacherContactsComponent } from './contacts/teacher-contacts/teacher-contacts.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffContactsComponent } from './contacts/staff-contacts/staff-contacts.component';
import { CounselorContactsComponent } from './contacts/counselor-contacts/counselor-contacts.component';
import { LabContactsComponent } from './contacts/lab-contacts/lab-contacts.component';
import { DisplayTutorContactsComponent } from './contacts/display-tutor-contacts/display-tutor-contacts.component';
import { DisplayCounselorContactsComponent } from './contacts/display-counselor-contacts/display-counselor-contacts.component';
import { DisplayStaffContactsComponent } from './contacts/display-staff-contacts/display-staff-contacts.component';
import { DisplayTeacherContactsComponent } from './contacts/display-teacher-contacts/display-teacher-contacts.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StudentDataComponent } from 'src/app/component/student/home/studentData/studentData.component';
import { StudentDataTSDEMOComponent } from './home/studentData-TS-DEMO/studentData-tsDemo.component';
import { StudentDataMcnDemoComponent } from './home/studentData-MCN-DEMO/studentData-mcn-demo.component';
import { MatRadioModule } from '@angular/material/radio';
import { StudentDataSSSDemoComponent } from './home/studentData-SSS-DEMO/studentData-sss-demo.component';
import { StudentDataVUBDemoComponent } from './home/studentData-VUB-DEMO/studentData-vub-demo.component';
import { StudentDataUBDemoComponent } from './home/studentData-UB-DEMO/studentData-ub-demo.component';
import { StudentDataUBMSDemoComponent } from './home/studentData-UBMS-DEMO/studentData-ubms-demo.component';

@NgModule({
    declarations: [
        AttendanceLogsComponent,
        ExamsLogsComponent,
        NotesLogsComponent,
        StipendLogsComponent,
        TextMessageLogsComponent,
        TextMessageRepliesLogsComponent,
        WalletLogsComponent,
        FiscalYearAndFinancialAidComponent,
        GraduatedComponent,
        SemesterAndCoursesComponent,
        TutorContactsComponent,
        TeacherContactsComponent,
        StaffContactsComponent,
        CounselorContactsComponent,
        LabContactsComponent,
        DisplayTutorContactsComponent,
        DisplayCounselorContactsComponent,
        DisplayStaffContactsComponent,
        DisplayTeacherContactsComponent,
        StudentDataComponent,
        StudentDataTSDEMOComponent,
        StudentDataMcnDemoComponent,
        StudentDataSSSDemoComponent,
        StudentDataVUBDemoComponent,
        StudentDataUBDemoComponent,
        StudentDataUBMSDemoComponent
    ],
    imports: [
        StudentRoutingModule,
        GlobalFilterModule,
        BrowserModule,
        CommonModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatInputModule,
        TextFieldModule,
        MatDatepickerModule,
        MatRadioModule
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })

  export class StudentModule { }
