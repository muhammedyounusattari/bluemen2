import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-sub-exams',
  templateUrl: './sub-exams.component.html',
  styleUrls: ['./sub-exams.component.css']
})
export class SubExamsComponent implements OnInit {

  public coursesForm: FormGroup;

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
    return this.coursesForm = this.fb.group({
        formLayout: ['vertical'],
              useFiltersFromThisPage: [null],
              examName: [null],
              marks1: [null],
              marks2: [null],
              useFiltersFromThisPageToSelectRecord: [null]
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