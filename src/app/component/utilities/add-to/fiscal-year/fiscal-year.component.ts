import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FiscalYearService } from 'src/app/services/utilities/fiscal-year.service';

@Component({
    selector: 'app-fiscal-year',
    templateUrl: './fiscal-year.component.html',
    styleUrls: ['./fiscal-year.component.css']
})
export class FiscalYearComponent implements OnInit {
  @Output() navigateToStudentPage: EventEmitter<any> = new EventEmitter();
  @Input() studentList: any = [];
  @Input() selectedFiscalYear: any = '';
  public fiscalYear = new FormControl();

  constructor(private router: Router, private service: FiscalYearService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fiscalYear.setValue(this.selectedFiscalYear);
  }

  /**
   * @method updateFiscalYearForStudents
   */
  public updateFiscalYearForStudents() {
    this.service.updateFiscalYear(this.requestPayload()).subscribe(resp => {
      if (resp) {
        this.toastr.success(
          `${this.studentList.length} Student added to the fiscal year ${this.fiscalYear.value}`,
          '', {
            timeOut: 1000,
            closeButton: true,
          }
        );
        setTimeout(() => {
          this.navigateToHome();
        }, 1000);
      }
    })
  }

  /**
   * @method navigateToHome
   */
  public navigateToHome() {
    this.router.navigate(['/']);
  }

  /**
   * @method requestPayload
   */
  public requestPayload() {
    return {
      fiscalYear: this.fiscalYear.value,
      ssnoList: this.studentList
    }
  }
}
