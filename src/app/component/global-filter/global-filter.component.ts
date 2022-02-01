import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-global-filter',
  templateUrl: './global-filter.component.html',
  // styleUrls: ['./global-filter.component.css']
})
export class GlobalFilterComponent {
  @Output() openSelectedPage: EventEmitter<any> = new EventEmitter();
  public isVisible: boolean = false;
  public selectedFilter: string;
  public isGlobalFilter: boolean = true;
  public isStudentEdit: boolean = false;
  public studentList: any = [];
  public selectedScreen: string = 'Student';
  public filter = {
    fiscalYear: '2017',
  };

  constructor(
    private route: ActivatedRoute,
    private service: StudentService,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.selectedFilter && this.selectedFilter !== params?.page) {
        location.reload();
      }
      this.selectedFilter = params?.page;
      this.isStudentEdit = this.selectedFilter === 'yearly-financial-aid-info';
    });
  }

  /**
   * @method openSelectedFilter
   */
  public openSelectedFilter(event: any, page: any) {
    this.selectedScreen = page;
    this.openSelectedPage.emit({ event, page });
  }

  /**
   * filterStudent
   */
  public filterStudent(event: any) {
    this.filter.fiscalYear = event?.fiscalYear;
  }

  /**
   * getFilteredStudents
   */
  public getFilteredStudents() {
    this.service.getStudentByFiscalYear(this.filter.fiscalYear)
      .subscribe((result) => {
        if (result) {
          if (result.length > 0) {
            this.studentList = result;
            this.toastr.success(
              `${this.studentList?.length} student records found for year ${this.filter.fiscalYear}`,
              '', {
                timeOut: 1000,
                closeButton: true,
              }
            );
          } else {
            this.toastr.error(
              `No student records found for year ${this.filter.fiscalYear}`,
              '', {
                timeOut: 5000,
                closeButton: true,
              }
            );
          }
        }
      });
  }

  /**
   * @method continueToUpdate
   */
  public continueToUpdate() {
    if (this.studentList && this.studentList.length > 0) {
      this.setGlobalFilter();
    } else {
      this.service.getStudentByFiscalYear(this.filter.fiscalYear)
        .subscribe((result) => {
          if (result) {
            if (result.length > 0) {
              this.studentList = result;
              this.toastr.success(
                `${this.studentList?.length} student records found for year ${this.filter.fiscalYear}`,
                '', {
                  timeOut: 1000,
                  closeButton: true,
                }
              );
              setTimeout(() => {
                this.setGlobalFilter();
              }, 1000);
            } else {
              this.toastr.error(
                `No student records found for year ${this.filter.fiscalYear}`,
                '', {
                  timeOut: 5000,
                  closeButton: true,
                }
              );
            }
          }
        });
    }
  }

  /**
   * @method setGlobalFilter
   */
  public setGlobalFilter() {
    if (this.selectedFilter) {
      this.isGlobalFilter = false;
    }
  }
}
