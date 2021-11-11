import { NgModule } from '@angular/core';
import { StudentRoutingModule } from './student-routing.module';

import { AttendanceLogsComponent } from './logs/attendance/attendance-logs.component';

@NgModule({
    declarations: [
        AttendanceLogsComponent
    ],
    imports: [
        StudentRoutingModule
    ],
    providers: []
  })

  export class StudentModule { }
  