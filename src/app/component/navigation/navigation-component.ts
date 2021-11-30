import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation-component.html',
    styleUrls: ['./navigation-component.css']
})
export class NavigationComponent {
    constructor(private router: Router) { }

    navigateToComponent(componentName: string) {
        if (componentName === 'pulldown-list') {
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
        }
    }
}
