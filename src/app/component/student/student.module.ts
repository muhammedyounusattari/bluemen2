import { NgModule } from '@angular/core';
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
        CounselorContactsComponent
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
        ReactiveFormsModule
    ],
    providers: []
  })

  export class StudentModule { }
