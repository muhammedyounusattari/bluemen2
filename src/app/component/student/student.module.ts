import { NgModule } from '@angular/core';
import { StudentRoutingModule } from './student-routing.module';

import { AttendanceLogsComponent } from './logs/attendance/attendance-logs.component';
import { ExamsLogsComponent } from './logs/exams/exams-log.component';
import { NotesLogsComponent } from './logs/notes/notes-logs.component';
import { StipendLogsComponent } from './logs/stipend-logs/stipend-logs.component';
import { TextMessageLogsComponent } from './logs/text-message/text-message-logs.component';

@NgModule({
    declarations: [
        AttendanceLogsComponent,
        ExamsLogsComponent,
        NotesLogsComponent,
        StipendLogsComponent,
        TextMessageLogsComponent
    ],
    imports: [
        StudentRoutingModule
    ],
    providers: []
  })

  export class StudentModule { }
  