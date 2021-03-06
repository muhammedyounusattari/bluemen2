import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RolesService } from 'src/app/services/admin/roles.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TimeClockComponent } from '../myhome/home/time-clock/time-clock.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation-component.html',
  styleUrls: ['./navigation-component.css']
})
export class NavigationComponent implements OnInit {
  menus: String[];
  user: any;
  constructor(private router: Router, public sharedService: SharedService, private roleService: RolesService, 
    private modal: NzModalService, private viewContainerRef: ViewContainerRef) {
  }
  ngOnInit(): void {
    this.roleService.getMenuList().subscribe((result: any) => {
      if (result) {
        this.menus = result;
        this.menus.forEach(a => a = a.toLowerCase());
      }
    }, (error: any) => {
      console.log(error);
    });

    this.user = sessionStorage.getItem('state');
    this.user = JSON.parse(this.user);
  }

  showMenu(element: String): boolean {
    return this.menus != null && this.menus.includes(element);
  }

  validate() {
    // alert('hi');
  }

  navigateToComponent(componentName: string, subComponent: string = '') {
    if (componentName === 'logged-user') {
      this.router.navigate(['home/logged-user']);
    } else if (componentName === 'change-password') {
      this.router.navigate(['home/change-password']);
    } else if (componentName === 'pulldown-list') {
      this.router.navigate(['admin/pulldown-list']);
    } else if (componentName === 'service-group-list') {
      this.router.navigate(['admin/service-group-list']);
    } else if (componentName === 'services-list') {
      this.router.navigate(['admin/services-list']);
    } else if (componentName === 'college-list') {
      this.router.navigate(['admin/college-list']);
    } else if (componentName === 'custom-fields') {
      this.router.navigate(['admin/custom-fields']);
    } else if (componentName === 'school-list') {
      this.router.navigate(['admin/school-list']);
    } else if (componentName === 'grade-group-list') {
      this.router.navigate(['admin/grade-group-list']);
    } else if (componentName === 'grade-standing-list') {
      this.router.navigate(['admin/grade-standing-list']);
    } else if (componentName === 'lab-settings') {
      this.router.navigate(['admin/lab-settings']);
    } else if (componentName === 'attendance-log') {
      this.router.navigate(['student/attendance-log'])
    } else if (componentName === 'exams-logs') {
      this.router.navigate(['student/exams-logs']);
    } else if (componentName === 'notes-logs') {
      this.router.navigate(['student/notes-logs']);
    } else if (componentName === 'stipend-logs') {
      this.router.navigate(['student/stipend-logs']);
    } else if (componentName === 'text-message-logs') {
      this.router.navigate(['student/text-message-logs']);
    } else if (componentName === 'text-message-replies') {
      this.router.navigate(['student/text-message-replies']);
    } else if (componentName === 'wallet-logs') {
      this.router.navigate(['student/wallet-logs']);
    } else if (componentName === 'fiscal-year-financial-aid') {
      this.router.navigate(['student/fiscal-year-financial-aid']);
    } else if (componentName === 'graduated') {
      this.router.navigate(['student/graduated']);
    } else if (componentName === 'semester-courses') {
      this.router.navigate(['student/semester-courses']);
    } else if (componentName === 'change-ssno') {
      this.router.navigate(['utilities/change-ssno']);
    } else if (componentName === 'nsch') {
      this.router.navigate(['utilities/nsch']);
    } else if (componentName === 'quick-change-wizard') {
      this.router.navigate(['utilities/quick-change-wizard']);
    } else if (componentName === 'semester-gpa-info') {
      this.router.navigate(['utilities/semester-gpa-info']);
    } else if (componentName === 'student-demographic-info') {
      this.router.navigate(['utilities/student-demographic-info']);
    } else if (componentName === 'yearly-financial-aid-info') {
      this.router.navigate(['utilities/yearly-financial-aid-info']);
    } else if (componentName === 'fiscal-year') {
      this.router.navigate(['utilities/fiscal-year']);
    } else if (componentName === 'graduated-list') {
      this.router.navigate(['utilities/graduated-list']);
    } else if (componentName === 'semester') {
      this.router.navigate(['utilities/semester']);
    } else if (componentName === 'gs-attendance-logs') {
      this.router.navigate(['utilities/gs-attendance-logs']);
    } else if (componentName === 'staff-members') {
      this.router.navigate(['staff/staff-members']);
    } else if (componentName === 'config-settings') {
      this.router.navigate(['admin/home/config-settings']);
    } else if (componentName === 'user-names-pwd') {
      this.router.navigate(['admin/home/user-names-pwd']);
    } else if (componentName === 'custom-field-value') {
      this.router.navigate(['utilities/custom-field-value']);
    } else if (componentName === 'system-preferences') {
      this.router.navigate(['admin/home/system-preferences']);
    } else if (componentName === 'assign-tutor-student-class') {
      this.router.navigate(['tutor/assign-tutor-student-class']);
    } else if (componentName === 'tutors') {
      this.router.navigate(['tutor/tutors']);
    } else if (componentName === 'assign-student-teacher-class') {
      this.router.navigate(['teacher/assign-student-teacher-class']);
    } else if (componentName === 'teachers') {
      this.router.navigate(['teacher/teachers']);
    } else if (componentName === 'lab-contacts') {
      this.router.navigate(['student/lab-contacts'])
    } else if (componentName === 'staff-contacts') {
      this.router.navigate(['student/staff-contacts'])
    } else if (componentName === 'teacher-contacts') {
      this.router.navigate(['student/teacher-contacts'])
    } else if (componentName === 'tutor-contacts') {
      this.router.navigate(['student/tutor-contacts'])
    } else if (componentName === 'counselor-contacts') {
      this.router.navigate(['student/counselor-contacts'])
    } else if (componentName === 'display-counselor-contacts') {
      this.router.navigate(['student/display-counselor-contacts'])
    } else if (componentName === 'display-tutor-contacts') {
      this.router.navigate(['student/display-tutor-contacts'])
    } else if (componentName === 'display-teacher-contacts') {
      this.router.navigate(['student/display-teacher-contacts'])
    } else if (componentName === 'display-staff-contacts') {
      this.router.navigate(['student/display-staff-contacts'])
    } else if (componentName === 'personalized-letters') {
      this.router.navigate(['personalized-letters'])
    } else if (componentName === 'time-clock-manager') {
      this.router.navigate(['admin/time-clock-manager'])
    } else if (componentName === 'counselors') {
      this.router.navigate(['counselor/counselors'])
    } else if (componentName === 'recall-students') {
      this.router.navigate(['admin/recall-students'])
    } else if (componentName === 'teacher-classes') {
      this.router.navigate(['admin/teacher-classes'])
    } else if (componentName === 'counselors-classes') {
      this.router.navigate(['admin/counselors-classes'])
    } else if (componentName === 'tutor-classes') {
      this.router.navigate(['admin/tutor-classes'])
    } else if (componentName === 'staff-classes') {
      this.router.navigate(['admin/staff-classes'])
    } else if (componentName === 'time-clock') {
      //this.router.navigate(['/'], { queryParams: { popup: 'time-clock' } })
      this.openModal("Staff Time Clock" );
      
    } else if (componentName === 'global-filter' && subComponent != '') {
      this.router.navigate(['utilities/global-filter'], { queryParams: { page: subComponent } });
    }else if (componentName === 'annual-performance-report-section-1') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1'])
    }else if (componentName === 'annual-performance-report-section-1-part-2') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/contacts'])
    }else if (componentName === 'annual-performance-report-section-2') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/student-profile'])
    }else if (componentName === 'annual-performance-report-section-2-edit') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/student-profile'])
    }
  }

  openModal(title: string) {
    const modal = this.modal.create({
      nzTitle: title,
      nzWidth: "60%",
      nzContent: TimeClockComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
      },
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: []
    });
    // const instance = modal.getContentComponent();
    // // Return a result when closed
    // modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));

    // // delay until modal instance created
    // setTimeout(() => {
    //   instance.clockLabel = 'sub title is changed';
    // }, 2000);
  }
}
