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
        }
    }
}
