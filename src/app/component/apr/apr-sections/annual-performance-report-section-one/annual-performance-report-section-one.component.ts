import { Component, OnInit } from '@angular/core';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultSetting } from 'src/app/constants/enums/system-preferences.enum';

@Component({
  selector: 'app-annual-performance-report-section-one',
  templateUrl: './annual-performance-report-section-one.component.html',
  styleUrls: ['./annual-performance-report-section-one.component.css']
})
export class AnnualPerformanceReportSectionOneComponent implements OnInit {

 //nz- zorro
 public annualPerformanceReportSectionOneFormForm: FormGroup;
 semesterList: any = [];
 componentList:any = [];
 cityList:any = [];
 stateList:any = [];
 gpaScaleList:any = [];
 programTypeList:any = [];
 siteLocationList:any = [];
 dropDownBindingArray:any =[];


 constructor( private sharedService: SharedService
     , private pullDownService: PullDownListService
     , private fb: FormBuilder) {

 }

 ngOnInit(): void {
     this.sharedService.setPageTitle('Annual Performance Report-SSS Program Year 2019 - 2020');
     this.bindDropDownValues();
     this.payload();
 }

  payload(){
    return this.annualPerformanceReportSectionOneFormForm = this.fb.group({
        formLayout: ['vertical'],
              awardNumber: [null],
              typeofInstitution: [null],
              projectType: [null],
              reportingPeriodFrom: [null],
              reportingPeriodTo: [null],
              gpaScale: [null],
              nameOfGranteeInstitution: [null],
              address: [null],
              city: [null],
              state: [null],
              zipCode: [null],
              projectDirector1: [null],
              telephoneNumber: [null],
              extn: [null],
              fax: [null],
              mailAddress1: [null],
              nameOfDataEntryPerson: [null],
              phoneNumber: [null],
              mailAddress2: [null],
              ombApprovalNo: [null],
              expirationDate: [null],
              summerBridgeProgram: [null],
              summerBridgeParticipantsServed: [null],
              usesFederalGrantFundsToProvideGrantAid: [null],
              requiredToProvideMatchingFundsForGrantAid: [null],
              dollarAmount1: [null],
              receivesInstitutional: [null],
              dollarAmoun2: [null],
              reportElectronicallySubmittedOn: [null],
              projectDirector2: [null],
              certifyingOfficial: [null],
              date1: [null],
              date2: [null],
              authority: [null],
              warning: [null]
      });
 }

 addAnnualPerformance() {
 }

 cancelClick() {
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
               this.programTypeList = result?.PROGRAMTYPE; //TODO not pulltype
             }
             if (result['SITE LOCATION']) {
               this.siteLocationList = result['SITE LOCATION'];
             }

           });
  }
}
