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
        SemesterAndCoursesComponent
    ],
    imports: [
        StudentRoutingModule
    ],
    providers: []
  })

  export class StudentModule { }
  