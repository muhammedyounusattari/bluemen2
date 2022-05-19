import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  public studentProfileForm: FormGroup;

  semesterList: any = [];
  componentList:any = [];
  cityList:any = [];
  stateList:any = [];
  gpaScaleList:any = [];
  programTypeList:any = [];
  siteLocationList:any = [];
  dropDownBindingArray:any =[];
 
   constructor(private sharedService: SharedService
     , private pullDownService: PullDownListService
     , private fb: FormBuilder) { }
 
   ngOnInit(): void {
     this.sharedService.setPageTitle('');
      this.bindDropDownValues();
      this.payload();
   }
 
   payload(){
     return this.studentProfileForm = this.fb.group({
         formLayout: ['vertical'],
               reportHeader: [null],
               fiscalYear: [null],
               active: [null],
               served: [null],
               reported: [null],
               ethnicity: [null],
               eligibility: [null],
               gender: [null],
               zipCode: [null],
               incomeSource: [null],
               entryDateFrom: [null],
               entryDateTo: [null],
               dob: [null],
               referredBy: [null],
               cohortYear: [null],
               school: [null],
               counselor: [null],
               standing: [null],
               entrySchool: [null],
               entryCollege: [null],
               collegeType: [null],
               collegeName: [null],
               major: [null],
               siteLocation: [null],
               collegeReady: [null],
               participantStatus: [null],
               codes: [null],
               advisor: [null],
               tutor: [null],
               custom1: [null],
               custom2: [null],
               custom3: [null],
               custom4: [null],
               graduationCohortYear: [null],
               gpaEntry1: [null],
               gpaEntry2: [null],
               gpaStart1: [null],
               gpaEnd1: [null],
               gpaStart2: [null],
               gpaEnd2: [null]
       });
  }
 
  bindDropDownValues() {
   let data: any = ['SEMESTER','COMPONENT','CITY','STATE','GPASCALE','PROGRAMTYPE','SITE LOCATION'];
   this.pullDownService.getMultiPullDownMaster(data).subscribe((result: any) => {
       if (result?.SEMESTER) {
           this.semesterList = result?.SEMESTER;
       }
       if (result?.COMPONENT) {
           this.componentList = result?.COMPONENT;
       }
    if (result?.CITY) {
        this.cityList = result?.CITY;
      }
    if (result?.STATE) {
        this.stateList = result?.STATE;
      }
     if (result?.GPASCALE) {
        this.gpaScaleList = result?.GPASCALE;
      }
     if (result?.PROGRAMTYPE) {
        this.programTypeList = result?.PROGRAMTYPE;
      }
      if (result['SITE LOCATION']) {
        this.siteLocationList = result['SITE LOCATION'];
      }
 
    });
 }
 
 addAnnualPerformance() {
 }
 
 cancelClick() {
 }

}
