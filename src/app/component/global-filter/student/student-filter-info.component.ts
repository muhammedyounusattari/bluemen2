import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student-filter',
  templateUrl: './student-filter-info.component.html',
  styleUrls: ['./student-filter-info.component.css']
})
export class StudentFilterComponent implements OnInit {
  @Output() filterStudent: any = new EventEmitter();
  public studentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeFormValues();
  }

  /**
   * @method initializeForm
   */
  public initializeForm() {
    this.studentForm = this.fb.group({
      fiscalYear: ['2017']
    });
  }

  /**
   * @method subscribeFormValues
   */
  public subscribeFormValues() {
    this.studentForm.controls.fiscalYear.valueChanges.subscribe(value => {
      if (value) {
        this.filterStudent.emit({fiscalYear: value})
      }
    })
  }

}
