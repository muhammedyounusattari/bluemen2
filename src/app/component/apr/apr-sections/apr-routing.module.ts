import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradeComponent } from '../../admin/customize/grade-standing/grade/grade.component';
import { AprAprSectionsComponent } from '../apr-apr-sections.component';
import { AnnualPerformanceReportSectionOnePartTwoComponent } from './annual-performance-report-section-one-part-two/annual-performance-report-section-one-part-two.component';
import { AnnualPerformanceReportSectionOneComponent } from './annual-performance-report-section-one/annual-performance-report-section-one.component';
import { AprFieldsComponent } from './apr-fields/apr-fields.component';
import { AttendanceLogComponent } from './attendance-log/attendance-log.component';
import { ContactServicesComponent } from './contact-services/contact-services.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CoursesComponent } from './courses/courses.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { CustomListsComponent } from './custom-lists/custom-lists.component';
import { ExamsLogComponent } from './exams-log/exams-log.component';
import { GraduatedComponent } from './graduated/graduated.component';
import { MarkStudentsComponent } from './mark-students/mark-students.component';
import { NotesComponent } from './notes/notes.component';
import { ScheduleClassesComponent } from './schedule-classes/schedule-classes.component';
import { SemesterComponent } from './semester/semester.component';
import { StaffComponent } from './staff/staff.component';
import { StipendComponent } from './stipend/stipend.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { SubExamsComponent } from './sub-exams/sub-exams.component';
import { TextMessageComponent } from './text-message/text-message.component';
import { WalletComponent } from './wallet/wallet.component';
import { YearlyInformationComponent } from './yearly-information/yearly-information.component';

const routes: Routes = [
  {
    path: 'apr/apr-section/annual-performance-report-section-1',
    component: AnnualPerformanceReportSectionOneComponent,
    data: {
      title: 'Annual Performance',
      breadcrumb: [
        {
          label: 'Apr',
          url: 'apr/apr-section'
        },
        {
          label: 'Annual Performance',
          url: ''
        }
      ]
    }
  },
  {
    path: 'apr/apr-section/annual-performance-report-section-1-part-2',
    component: AnnualPerformanceReportSectionOnePartTwoComponent,
    children: [
      {
        path:'student-profile', component: StudentProfileComponent
      },
      {
        path:'mark-students', component: MarkStudentsComponent
      },
      {
        path:'semester', component: SemesterComponent
      },
      {
        path:'courses', component: CoursesComponent
      },
      {
        path:'contacts', component: ContactsComponent
      },
      {
        path:'contact-services', component: ContactServicesComponent
      },
      {
        path:'notes', component: NotesComponent
      },
      {
        path:'exams-log', component: ExamsLogComponent
      },
      {
        path:'sub-exams', component: SubExamsComponent
      },
      {
        path:'wallet', component: WalletComponent
      },
      {
        path:'attendance-log', component: AttendanceLogComponent
      },
      {
        path:'stipend', component: StipendComponent
      },
      {
        path:'schedule-classes', component: ScheduleClassesComponent
      },
      {
        path:'graduated', component: GraduatedComponent
      },
      {
        path:'staff', component: StaffComponent
      },
      {
        path:'custom-lists', component: CustomListsComponent
      },
      {
        path:'yearly-information', component: YearlyInformationComponent
      },
      {
        path:'custom-fields', component: CustomFieldsComponent
      },
      {
        path:'text-message', component: TextMessageComponent
      },
      {
        path:'apr-fields', component: AprFieldsComponent
      },
      
    ]
    
  },
  {
    path: 'apr/apr-section',
    component: AprAprSectionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprRoutingModule { }
