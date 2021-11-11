import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceLogsComponent } from './logs/attendance/attendance-logs.component';
import { ExamsLogsComponent } from './logs/exams/exams-log.component';
import { NotesLogsComponent } from './logs/notes/notes-logs.component';
import { StipendLogsComponent } from './logs/stipend-logs/stipend-logs.component';
import { TextMessageLogsComponent } from './logs/text-message/text-message-logs.component';

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
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
