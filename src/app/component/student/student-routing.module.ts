import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceLogsComponent } from './logs/attendance/attendance-logs.component';

const routes: Routes = [
    {
        path: 'student/attendance-log',
        component: AttendanceLogsComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
