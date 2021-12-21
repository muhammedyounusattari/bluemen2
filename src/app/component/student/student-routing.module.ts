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
import {CounselorContactsComponent} from "./contacts/counselor-contacts/counselor-contacts.component";
import {
  DisplayCounselorContactsComponent
} from "./contacts/display-counselor-contacts/display-counselor-contacts.component";
import {DisplayStaffContactsComponent} from "./contacts/display-staff-contacts/display-staff-contacts.component";
import {DisplayTeacherContactsComponent} from "./contacts/display-teacher-contacts/display-teacher-contacts.component";
import {LabContactsComponent} from "./contacts/lab-contacts/lab-contacts.component";
import {StaffContactsComponent} from "./contacts/staff-contacts/staff-contacts.component";
import {DisplayTutorContactsComponent} from "./contacts/display-tutor-contacts/display-tutor-contacts.component";
import { TeacherContactsComponent } from './contacts/teacher-contacts/teacher-contacts.component';
import { PersonalizedLettersComponents } from './home/personalized-letters/personalized-letters.component';
import {TutorContactsComponent} from "./contacts/tutor-contacts/tutor-contacts.component";

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
    },
    {
      path: 'student/counselor-contacts',
      component: CounselorContactsComponent
    }, {
      path: 'student/display-counselor-contacts',
      component: DisplayCounselorContactsComponent
    }, {
      path: 'student/display-staff-contacts',
      component: DisplayStaffContactsComponent
    }, {
      path: 'student/display-teacher-contacts',
      component: DisplayTeacherContactsComponent
    }, {
      path: 'student/display-tutor-contacts',
      component: DisplayTutorContactsComponent
    }, {
      path: 'student/lab-contacts',
      component: LabContactsComponent
    }, {
      path: 'student/staff-contacts',
      component: StaffContactsComponent
    }, {
      path: 'student/teacher-contacts',
      component: TeacherContactsComponent
    },
    {
      path: 'student/tutor-contacts',
      component: TutorContactsComponent
    },
    {
      path: 'home/personalized-letters',
      component: PersonalizedLettersComponents
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
