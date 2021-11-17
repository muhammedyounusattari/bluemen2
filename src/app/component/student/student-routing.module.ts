import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiscalYearAndFinancialAidComponent } from './data-entry/fiscal-year/fiscal-year-financial-aid.component';
import { GraduatedComponent } from './data-entry/graduated/graduated.component';
import { SemesterAndCoursesComponent } from './data-entry/semester-courses/semester-courses.component';
import { AttendanceLogsComponent } from './logs/attendance/attendance-logs.component';
import { ExamsLogsComponent } from './logs/exams/exams-log.component';
import { NotesLogsComponent } from './logs/notes/notes-logs.component';
import { StipendLogsComponent } from './logs/stipend-logs/stipend-logs.component';
import { TextMessageRepliesLogsComponent } from './logs/text-message-replies/text-message-replies.component';
import { TextMessageLogsComponent } from './logs/text-message/text-message-logs.component';
import { WalletLogsComponent } from './logs/wallet/wallet-logs.component';

const routes: Routes = [
    {
        path: 'student/attendance-log',
        component: AttendanceLogsComponent
    },
    {
        path: 'student/exams-logs',
        component: ExamsLogsComponent
    },
    {
        path: 'student/notes-logs',
        component: NotesLogsComponent
    },
    {
        path: 'student/stipend-logs',
        component: StipendLogsComponent
    },
    {
        path: 'student/text-message-logs',
        component: TextMessageLogsComponent
    },
    {
        path: 'student/text-message-replies',
        component: TextMessageRepliesLogsComponent
    },  
    {
        path: 'student/wallet-logs',
        component: WalletLogsComponent
    },  
    {
        path: 'student/fiscal-year-financial-aid',
        component: FiscalYearAndFinancialAidComponent
    },  
    {
        path: 'student/graduated',
        component: GraduatedComponent
    },  
    {
        path: 'student/semester-courses',
        component: SemesterAndCoursesComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
