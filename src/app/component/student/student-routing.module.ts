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
import { CounselorContactsComponent } from "./contacts/counselor-contacts/counselor-contacts.component";
import { DisplayCounselorContactsComponent } from "./contacts/display-counselor-contacts/display-counselor-contacts.component";
import { DisplayStaffContactsComponent } from "./contacts/display-staff-contacts/display-staff-contacts.component";
import { DisplayTeacherContactsComponent } from "./contacts/display-teacher-contacts/display-teacher-contacts.component";
import { LabContactsComponent } from "./contacts/lab-contacts/lab-contacts.component";
import { StaffContactsComponent } from "./contacts/staff-contacts/staff-contacts.component";
import { DisplayTutorContactsComponent } from "./contacts/display-tutor-contacts/display-tutor-contacts.component";
import { TeacherContactsComponent } from './contacts/teacher-contacts/teacher-contacts.component';
import { PersonalizedLettersComponents } from './home/personalized-letters/personalized-letters.component';
import { TutorContactsComponent } from "./contacts/tutor-contacts/tutor-contacts.component";

import { StudentDataEOCDemoComponent } from './home/studentData-EOC-DEMO/studentData-eoc-demo.component';
import { StudentDataTSDEMOComponent } from './home/studentData-TS-DEMO/studentData-tsDemo.component';
import { StudentDataMcnDemoComponent } from './home/studentData-MCN-DEMO/studentData-mcn-demo.component';
import { StudentDataSSSDemoComponent } from './home/studentData-SSS-DEMO/studentData-sss-demo.component';
import { StudentDataVUBDemoComponent } from './home/studentData-VUB-DEMO/studentData-vub-demo.component';
import { StudentDataUBDemoComponent } from './home/studentData-UB-DEMO/studentData-ub-demo.component';
import { StudentDataUBMSDemoComponent } from './home/studentData-UBMS-DEMO/studentData-ubms-demo.component';

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
  {
    path: 'student/home/student-data-eocdemo',
    component: StudentDataEOCDemoComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For EOC_DEMO',
          url: ''
        }
      ]
    }
  },
  {
    path: 'student/home/student-data-tsdemo',
    component: StudentDataTSDEMOComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For TS_DEMO',
          url: ''
        }
      ]
    }
  },
  {
    path: 'student/home/student-data-mcnDemo',
    component: StudentDataMcnDemoComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For MCN_DEMO',
          url: ''
        }
      ]
    }
  },
  {
    path: 'student/home/student-data-sssDemo',
    component: StudentDataSSSDemoComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For SSS_DEMO',
          url: ''
        }
      ]
    }
  },
  {
    path: 'student/home/student-data-vubDemo',
    component: StudentDataVUBDemoComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For VUB_DEMO',
          url: ''
        }
      ]
    }
  },
  {
    path: 'student/home/student-data-ubDemo',
    component: StudentDataUBDemoComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For UB_DEMO',
          url: ''
        }
      ]
    }
  },
  {
    path: 'student/home/student-data-ubmsDemo',
    component: StudentDataUBMSDemoComponent,
    data: {
      title: 'Student Data',
      breadcrumb: [
        {
          label: 'Home',
          url: 'student/home'
        },
        {
          label: 'Student Data For UBMS_DEMO',
          url: ''
        }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
