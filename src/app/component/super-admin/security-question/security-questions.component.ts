import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeService } from 'src/app/services/home/home.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';


@Component({
    selector: 'app-security-question',
    templateUrl: './security-questions.component.html',
    styleUrls: ['./security-questions.component.css'],
})

export class SecurityQuestionsComponent implements OnInit {

    selectedRow: any = '';
    isEdit: boolean = false;
    selectedRowIndex: any;
    public securityQuesLst1: any = [];
    public securityQuesLst2: any = [];
    formGroup: FormGroup;
    securityQuestionsFormGroup:FormGroup;
    securityQuesLst: any = [];
    securityQuesSearchLst: any = [];
    isLoading: boolean = true;
    securityQuestionModalHeader = 'Security Questions';
    securityQuestionListPopupVisiblity = false;
    isSecurityQuestionLoading = false;
    isConfirmSecurityQuestionLoading = false;
    selectedSecurityQuestionName : any = 'Security Questions 1';
    securityQuestionsNameList = [
       
        { key: 'Security Questions 1', value: '1', isSelected: true},
        { key: 'Security Questions 2', value: '2', isSelected: false }
      ];
      defaultSelectedValue: any;

    constructor(private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private homeService: HomeService
        , private notificationService: NotificationUtilities) { }

    ngOnInit(): void {
        this.sharedService.setPageTitle('Security Questions');
        this.createForm();
        this.hideLoader();
        this.getSecurityQuestionList();
        this.createSecurityQuestionsForm();
        this.formGroup.get('securityQuestionsName')?.setValue(this.securityQuestionsNameList[0].value);
        this.defaultSelectedValue = this.securityQuestionsNameList[0].value;
        this.securityQuestionsNameList[0].isSelected = true; 
    }

    applyFilter(search: any) {
        const targetValue: any[] = [];
        this.securityQuesSearchLst.forEach((value: any) => {
          //let keys = Object.keys(value);
          let keys = ["name"];
          for (let i = 0; i < keys.length; i++) {
            if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
              targetValue.push(value);
              break;
            }
          }
        });
        this.securityQuesLst = targetValue;
    }


    resetFields() {
        this.isEdit = false;
        this.createSecurityQuestionsForm();
        this.securityQuestionListPopupVisiblity = true;
    }

    hideLoader() {
        this.isLoading = false;
    }

    showLoader() {
        this.isLoading = true;
    }

    setSelectedRow(selectedRowItem: any, index: Number) {
        this.selectedRowIndex = index;
        this.selectedRow = selectedRowItem;
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
          'id': [''],
          'securityQuestionsName': ['']
        });
      }

      createSecurityQuestionsForm() {
        this.securityQuestionsFormGroup = this.formBuilder.group({
          'id': [''],
          'name': ['', Validators.required]
        });
      }   

    getSecurityQuestionList() {
        this.showLoader();
        this.homeService.getSecurityQuestionList().subscribe((result) => {
            this.hideLoader();
            if (result) {
                this.securityQuesLst1 = result.body.question1;
                this.securityQuesLst2 = result.body.question2;
                if(result.body.question1){
                this.securityQuesLst = result.body.question1;
                this.securityQuesSearchLst = result.body.question1;
                this.securityQuestionsNameList[0].isSelected = true; 
                this.securityQuestionsNameList[1].isSelected = false; 
                }else if(result.body.question2){
                    this.securityQuesLst = result.body.question2;
                    this.securityQuesSearchLst = result.body.question2;
                    this.securityQuestionsNameList[0].isSelected = false; 
                    this.securityQuestionsNameList[1].isSelected = true; 
                }
            }
        });
    }

    selectSecurityQuestions() {
        let securityQuestionsName = this.formGroup?.get('securityQuestionsName')?.value;
        this.selectedSecurityQuestionName = this.formGroup?.get('securityQuestionsName')?.value;
        if(securityQuestionsName == '1'){
        this.securityQuesLst1 = this.securityQuesLst1;
        this.securityQuesLst = this.securityQuesLst1;
        this.securityQuesSearchLst =  this.securityQuesLst1;
        this.selectedSecurityQuestionName = 'Security Questions 1';
        }else{
            this.securityQuesLst2 = this.securityQuesLst2;
            this.securityQuesLst = this.securityQuesLst2;
            this.securityQuesSearchLst =  this.securityQuesLst2;
            this.selectedSecurityQuestionName = 'Security Questions 2';
        }
    }

    addSecurityQuestions(){
        if (this.securityQuestionsFormGroup.valid) {
            this.isEdit = false;
            this.showLoader();
            this.homeService.postSecurityQuestion(this.requestPayload())
              .subscribe((result: any) => {
                if (result) {
                  this.notificationService.createNotificationBasic('success', "success", 'Saved Successfully');
                  this.securityQuestionListPopupVisiblity = false;
                  this.homeService.getSecurityQuestionList().subscribe((result) => {
                    if (result) {
                       let val =  this.formGroup?.get('securityQuestionsName')?.value;
                        if(val == 1){
                        this.securityQuesLst1 = result.body.question1;
                        this.securityQuesLst2 = result.body.question2;
                        this.securityQuesLst =  result.body.question1;
                        this.securityQuesSearchLst =  result.body.question1;

                        }else if(val == 2){
                            this.securityQuesLst1 = result.body.question1;
                            this.securityQuesLst2 = result.body.question2;
                            this.securityQuesLst =  result.body.question2;
                            this.securityQuesSearchLst =  result.body.question2;

                        }
                    }
                });
                  this.hideLoader();
                }else{
                  this.hideLoader();
                }
              });
          } else {
            Object.values(this.securityQuestionsFormGroup.controls).forEach(control => {
                if (control.invalid) {
                  control.markAsDirty();
                  control.updateValueAndValidity({ onlySelf: true });
                }
              });
              return;
          }
    }

      /**
   * @method setValuesToUpdate
   * @description Set the select row values in formgroup
   */
    setValuesToUpdate(selectedRowItem: any, index: any) {
        this.setSelectedRow(selectedRowItem, index);
        if (this.selectedRow) {
            this.isEdit = true;
            this.securityQuestionsFormGroup.get('name') ?.setValue(this.selectedRow.name);
            this.securityQuestionsFormGroup.get('id') ?.setValue(this.selectedRow.id);
            this.formGroup.get('securityQuestionsName') ?.setValue(this.formGroup?.get('securityQuestionsName')?.value);
            this.securityQuestionListPopupVisiblity = true;
        } else {
            this.notificationService.createNotificationBasic('info', "info", 'Please select a row to update');
        }
    }

    /**
    * @method updateSelectedRow
    * @description update the record
    */
     updateSelectedRow() {
        if (this.selectedRow && this.securityQuestionsFormGroup.valid) {
            this.isEdit = true;
            this.showLoader();
            this.homeService.postSecurityQuestion(this.requestPayload()).subscribe(result => {
                if (result) {
                    this.isEdit = false;
                    this.selectedRow = null;
                    this.notificationService.createNotificationBasic('success', "success", 'Updated Successfully');
                    this.homeService.getSecurityQuestionList().subscribe((result) => {
                        if (result) {
                           let val =  this.formGroup?.get('securityQuestionsName')?.value;
                            if(val == 1){
                            this.securityQuesLst1 = result.body.question1;
                            this.securityQuesLst2 = result.body.question2;
                            this.securityQuesLst =  result.body.question1;
                            this.securityQuesSearchLst =  result.body.question1;
                            }else if(val == 2){
                                this.securityQuesLst1 = result.body.question1;
                                this.securityQuesLst2 = result.body.question2;
                                this.securityQuesLst =  result.body.question2;
                                this.securityQuesSearchLst =  result.body.question2;                            }
                        }
                    });
                this.securityQuestionListPopupVisiblity = false;        
                this.hideLoader();
                }else{
                  this.hideLoader();
                }
            });
        } else {
            Object.values(this.securityQuestionsFormGroup.controls).forEach(control => {
                if (control.invalid) {
                  control.markAsDirty();
                  control.updateValueAndValidity({ onlySelf: true });
                }
              });
              return;
        }
    }

     /**
     * @method print
     * @description show print and download the data.
     */
      print() {
        var doc = new jsPDF('l', 'mm', 'a4');
        const head = [['Security Questions Name']]
        let data: any = [];
        this.securityQuesLst.forEach((e: any) => {
            var tempObj = [];
            tempObj.push(e.name);
            data.push(tempObj);
        });
        var name = this.selectedSecurityQuestionName;
        autoTable(doc, {
            head: head,
            body: data,
            theme: "grid",
            showHead: "everyPage",
            margin: { left: 20, right: 20, top: 30, bottom: 40 },
            startY: 25,
            headStyles: {
                fillColor: [0, 57, 107]
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            tableLineColor: [208, 208, 208],
            tableLineWidth: 0.1,
            bodyStyles: {
                fontSize: 12
            },
            styles: {
                cellPadding: 3
            },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.text("Compansol TRIO Security Questions Name Listing", 140, 10, {
                    align: 'center'
                });
                 doc.text(name, 140, 20, {
                    align: 'center'
                });

            },
            didDrawCell: (data) => { },
        });
        doc.setProperties({
            title: "Security Questions Name"
        });
        window.open(doc.output('bloburl').toString(), '_blank');
        //doc.output('dataurlnewwindow', { filename: 'standingGroup.pdf' });
        //doc.save('college.pdf');  
    }



    /**
   * @method requestPayload
   * @description create the request payload for API's
   */
  public requestPayload() {
    return {
      id: this.securityQuestionsFormGroup?.get('id')?.value,
      securityQuestion: this.securityQuestionsFormGroup?.get('name')?.value,
      securityAnswer:  this.formGroup?.get('securityQuestionsName')?.value
    };
  }

      /**
   * @method handleCancel
   * @description this method is used for hide popup and loading
   */
    handleCancel() {
        this.isSecurityQuestionLoading = false;
        this.securityQuestionListPopupVisiblity = false;
    }

     /**
    * @method sorting
    * @description this method is used for asc sorting
    */
      sorting(attr: string) {
        if (this.securityQuesLst.length > 0) {
            this.securityQuesLst = [...this.securityQuesLst].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
        }
    }

    /**
    * @method sorting
    * @description this method is used for desc sorting
    */
    sorting2(attr: string) {
        if (this.securityQuesLst.length > 0) {
            this.securityQuesLst = [...this.securityQuesLst].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
        }
    }
}