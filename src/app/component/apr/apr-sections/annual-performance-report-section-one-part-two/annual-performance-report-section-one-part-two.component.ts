import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-annual-performance-report-section-one-part-two',
  templateUrl: './annual-performance-report-section-one-part-two.component.html',
  styleUrls: ['./annual-performance-report-section-one-part-two.component.css']
})
export class AnnualPerformanceReportSectionOnePartTwoComponent implements OnInit {
  
  studentProfile: boolean = false;
  contact:boolean = false;
  courses:boolean = false;
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    if(this.router.url){
      let url = this.router.url;
       if(this.router.url.split('/')[4]=='student-profile'){
        this.studentProfile = true;
        this.contact = false;
        this.courses = false;
       }else if(this.router.url.split('/')[4]=='contacts'){
        this.studentProfile = false;
        this.contact = true;
        this.courses = false;
       }
    }
   
  }

  navigateToComponent(componentName: string) {
    if (componentName === 'student-profile') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/student-profile'])
    }else if (componentName === 'mark-students') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/mark-students'])
    }else if (componentName === 'semester') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/semester'])
    }else if (componentName === 'courses') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/courses'])
    }else if (componentName === 'contacts') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/contacts'])
    }else if (componentName === 'contact-services') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/contact-services'])
    }else if (componentName === 'notes') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/notes'])
    }else if (componentName === 'exam-log') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/exams-log'])
    }else if (componentName === 'sub-exams') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/sub-exams'])
    }else if (componentName === 'wallet') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/wallet'])
    }else if (componentName === 'attendance-log') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/attendance-log'])
    }else if (componentName === 'stipend') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/stipend'])
    }else if (componentName === 'schedule-classes') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/schedule-classes'])
    }else if (componentName === 'graduated') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/graduated'])
    }else if (componentName === 'staff') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/staff'])
    }else if (componentName === 'custom-lists') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/custom-lists'])
    }else if (componentName === 'yearly-information') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/yearly-information'])
    }else if (componentName === 'custom-fields') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/custom-fields'])
    }else if (componentName === 'text-message') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/text-message'])
    }else if (componentName === 'apr-fields') {
      this.router.navigate(['apr/apr-section/annual-performance-report-section-1-part-2/apr-fields'])
    }
  }

}
