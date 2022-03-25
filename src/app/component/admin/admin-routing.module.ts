import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CounselorClassesComponent } from '../counselor/home/classes/counselors-classes.component';
import { AssignStudentsToTeacherClassesComponent } from '../teacher/home/assign-student-teacher-classes/assign-student-teacher-classes.component';
import { TeacherClassesComponent } from '../teacher/home/classes/teachers-classes.component';
import { TeacherComponent } from '../teacher/home/teachers/teacher.component';
import { AssignStudentsToTutorClassesComponent } from '../tutor/home/assign-student-tutor-classes/assign-student-tutor-classes.component';
import { TutorsComponent } from '../tutor/home/tutors/tutors.component';
import { ServiceGroupListComponent } from './activity/service-group-list/service-group-list.component';
import { ServicesListComponent } from './activity/services-list/services-list.component';
import { CollegeListComponent } from './customize/college-list/college-list.component';
import { CustomFieldsComponent } from './customize/custom-fields/custom-fields.component';
import { GradeStandingGroupListComponent } from './customize/grade/group/grade-standing-group-list.component';
import { GradeStandingListComponent } from './customize/grade/standing/grade-standing-list.component';
import { LabSettingsPreferencesComponent } from './customize/lab-settings/lab-settings-preferences.component';
import { PulldownListComponent } from './customize/pulldown-list/pulldown-list.component';
import { SchoolListComponent } from './customize/school-list/school-list.component';
import { ConfigSettingsComponent } from './home/config-settings/config-settings.component';
import { SystemPreferencesComponent } from './home/system-preferences/system-preferences.component';
import { UserNamesAndPasswordComponent } from './home/user-names-password/user-names-and-pwd.component';
import { RecallStudentsComponent } from './system-tools/recall-students/recall-students.component';
import { TimeClockManagerComponent } from './system-tools/time-clock-mgr/time-clock-manager.component';
import { TutorClassesComponent } from '../tutor/home/classes/tutor-classes.component';
import { StaffClassesComponent } from '../staff/home/classes/staff-classes.component';
import { RolesComponent } from './home/roles/roles.component';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminCustomizeComponent } from './customize/admin-customize.component';

const routes: Routes = [
  {
    path: 'admin/customize/pulldown-list',
    component: PulldownListComponent,
    data: {
      title: 'Pulldown List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'Pulldown List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/service-group-list',
    component: ServiceGroupListComponent,
    data: {
      title: 'Activity/Service List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'Activity List',
          url: 'admin/customize/services-list'
        },
        {
          label: 'Activity Group List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/services-list',
    component: ServicesListComponent,
    data: {
      title: 'Activity/Service List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'Activity Group List',
          url: 'admin/customize/service-group-list'
        },
        {
          label: 'Activity Service List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/college-list',
    component: CollegeListComponent,
    data: {
      title: 'College List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'School List',
          url: 'admin/customize/school-list'
        },
        {
          label: 'College List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/custom-fields',
    component: CustomFieldsComponent,
    data: {
      title: 'Custom Fields',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'Custom Fields',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/school-list',
    component: SchoolListComponent,
    data: {
      title: 'School List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'College List',
          url: 'admin/customize/college-list'
        },
        {
          label: 'School List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/grade-standing-list',
    component: GradeStandingListComponent,
    data: {
      title: 'Grade Standing List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'Grade Group List',
          url: 'admin/customize/grade-group-list'
        },
        {
          label: 'Grade Standing List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/customize/grade-group-list',
    component: GradeStandingGroupListComponent,
    data: {
      title: 'Grade Group List',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/customize'
        },
        {
          label: 'Grade Standing List',
          url: 'admin/customize/grade-standing-list'
        },
        {
          label: 'Grade Group List',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/home/config-settings',
    component: ConfigSettingsComponent,
    data: {
      title: 'Config Settings',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/home'
        },
        {
          label: 'Config Settings',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/home/user-names-pwd',
    component: UserNamesAndPasswordComponent,
    data: {
      title: 'Usernames & Password',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/home'
        },
        {
          label: 'Usernames & Password',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/home/system-preferences',
    component: SystemPreferencesComponent,
    data: {
      title: 'System Preferences',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/home'
        },
        {
          label: 'System Preferences',
          url: ''
        }
      ]
    }
  },
  {
    path: 'tutor/assign-tutor-student-class',
    component: AssignStudentsToTutorClassesComponent
  },
  {
    path: 'tutor/tutors',
    component: TutorsComponent
  },
  {
    path: 'teacher/assign-student-teacher-class',
    component: AssignStudentsToTeacherClassesComponent
  },
  {
    path: 'teacher/teachers',
    component: TeacherComponent
  },
  {
    path: 'admin/customize/lab-settings',
    component: LabSettingsPreferencesComponent,
    data: {
      title: 'Lab Settings',
      breadcrumb: [
        {
          label: 'Home',
          url: 'admin/home'
        },
        {
          label: 'Lab Settings',
          url: ''
        }
      ]
    }
  },
  {
    path: 'admin/time-clock-manager',
    component: TimeClockManagerComponent
  },
  {
    path: 'admin/recall-students',
    component: RecallStudentsComponent
  },
  {
    path: 'admin/teacher-classes',
    component: TeacherClassesComponent
  },
  {
    path: 'admin/counselors-classes',
    component: CounselorClassesComponent
  },
  {
    path: 'admin/tutor-classes',
    component: TutorClassesComponent
  },
  {
    path: 'admin/staff-classes',
    component: StaffClassesComponent
  },
  {
    path: 'admin/home/roles',
    component: RolesComponent
  },
  {
    path: 'admin/home',
    component: AdminHomeComponent
  },
  {
    path: 'admin/customize',
    component: AdminCustomizeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
