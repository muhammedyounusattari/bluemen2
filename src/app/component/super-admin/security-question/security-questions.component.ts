import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeService } from 'src/app/services/home/home.service';


@Component({
    selector: 'app-security-question',
    templateUrl: './security-questions.component.html',
    styleUrls: ['./security-questions.component.css'],
})

export class SecurityQuestionsComponent implements OnInit {
    @ViewChild('securityQuestionPopup') securityQuestionPopupRef: TemplateRef<any>;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-md'
    }
    selectedRow: any = '';
    isEdit: boolean = false;
    myElement: any = null;
    public spinner: boolean = true;
    selectedRowIndex: any;
    public securityQuesLst1: any = [];
    public securityQuesLst2: any = [];
    formGroup: FormGroup;
    securityQuestionsFormGroup:FormGroup;
    columnsToDisplay: string[] = ['name'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        if (this.dataSource && !this.dataSource.sort) {
            this.dataSource.sort = sort;
        }
    }
    isLoading: boolean = true;
    //securityQuestionsNameList = [{ 'name': 'Security Questions 1' }, { 'name': 'Security Questions 2' }];
    securityQuestionsNameList = [
       
        { key: 'Security Questions 1', value: '1', isSelected: true},
        { key: 'Security Questions 2', value: '2', isSelected: false }
      ];
      defaultSelectedValue: any;

    constructor(private modalService: BsModalService
        , private dialog: MatDialog
        , private toastr: ToastrService
        , private formBuilder: FormBuilder
        , private sharedService: SharedService
        , private homeService: HomeService) { }

    ngOnInit(): void {
        this.sharedService.setPageTitle('Security Questions');
        this.myElement = window.document.getElementById('loading');
        this.createForm();
        this.hideLoader();
        this.getSecurityQuestionList();
        this.createSecurityQuestionsForm();
        this.formGroup.get('securityQuestionsName')?.setValue(this.securityQuestionsNameList[0].value);
        this.defaultSelectedValue = this.securityQuestionsNameList[0].value;
        this.securityQuestionsNameList[0].isSelected = true; 
    }

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }

    resetFields() {
        this.isEdit = false;
        this.createSecurityQuestionsForm();
        this.openModal(this.securityQuestionPopupRef);
    }

    hideLoader() {
        this.myElement = window.document.getElementById('loading');
        if (this.myElement !== null) {
            this.spinner = false;
            this.isLoading = false;
            this.myElement.style.display = 'none';
        }
    }

    showLoader() {
        if (this.myElement !== null) {
            this.spinner = true;
            this.isLoading = true;
            this.myElement.style.display = 'block';
        }
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
                if(result.body.question1){
                this.securityQuesLst1 = result.body.question1;
                this.securityQuesLst2 = result.body.question2;
                this.dataSource = new MatTableDataSource(result.body.question1);
                this.dataSource.paginator = this.paginator;
                this.selectedRowIndex = null;
                this.dataSource.sort = this.sort;
                }else if(result.body.question2){
                    this.securityQuesLst1 = result.body.question1;
                    this.securityQuesLst2 = result.body.question2;
                    this.dataSource = new MatTableDataSource(result.body.question2);
                    this.dataSource.paginator = this.paginator;
                    this.selectedRowIndex = null;
                    this.dataSource.sort = this.sort;
                }
            }
        });
    }

    selectSecurityQuestions() {
        let securityQuestionsName = this.formGroup?.get('securityQuestionsName')?.value;
        console.log(securityQuestionsName);
        if(securityQuestionsName == '1'){
        this.securityQuesLst1 = this.securityQuesLst1;
        this.dataSource = new MatTableDataSource(this.securityQuesLst1);
        }else{
            this.securityQuesLst2 = this.securityQuesLst2;
            this.dataSource = new MatTableDataSource(this.securityQuesLst2);
        }
        this.dataSource.paginator = this.paginator;
        this.selectedRowIndex = null;
        this.dataSource.sort = this.sort;
    }

    addSecurityQuestions(){
        if (this.securityQuestionsFormGroup.valid) {
            this.isEdit = false;
            this.showLoader();
            this.homeService.postSecurityQuestion(this.requestPayload())
              .subscribe((result: any) => {
                if (result) {
                  this.toastr.success('Saved Successfully !', '', {
                    timeOut: 5000,
                    closeButton: true
                  });
                  this.modalRef.hide();
                  this.homeService.getSecurityQuestionList().subscribe((result) => {
                    if (result) {
                       let val =  this.formGroup?.get('securityQuestionsName')?.value;
                        if(val == 1){
                        this.securityQuesLst1 = result.body.question1;
                        this.securityQuesLst2 = result.body.question2;
                        this.dataSource = new MatTableDataSource(result.body.question1);
                        this.dataSource.paginator = this.paginator;
                        this.selectedRowIndex = null;
                        this.dataSource.sort = this.sort;
                        }else if(val == 2){
                            this.securityQuesLst1 = result.body.question1;
                            this.securityQuesLst2 = result.body.question2;
                            this.dataSource = new MatTableDataSource(result.body.question2);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRowIndex = null;
                            this.dataSource.sort = this.sort;
                        }
                    }
                });
                  this.hideLoader();
                }else{
                  this.hideLoader();
                }
              });
          } else {
            this.securityQuestionsFormGroup.markAllAsTouched();
          }
    }

      /**
   * @method setValuesToUpdate
   * @description Set the select row values in formgroup
   */
    setValuesToUpdate() {
        console.log(this.selectedRow);
        if (this.selectedRow) {
            this.isEdit = true;
            this.securityQuestionsFormGroup.get('name') ?.setValue(this.selectedRow.name);
            this.securityQuestionsFormGroup.get('id') ?.setValue(this.selectedRow.id);
            this.formGroup.get('securityQuestionsName') ?.setValue(this.formGroup?.get('securityQuestionsName')?.value);
            this.openModal(this.securityQuestionPopupRef);
        } else {
            this.toastr.info('Please select a row to update', '', {
                timeOut: 5000,
                closeButton: true
            });
        }
    }

    /**
    * @method updateSelectedRow
    * @description update the record
    */
     updateSelectedRow() {
        if (this.selectedRow && this.formGroup.valid) {
            this.isEdit = true;
            this.showLoader();
            this.homeService.postSecurityQuestion(this.requestPayload()).subscribe(result => {
                if (result) {
                    this.isEdit = false;
                    this.selectedRow = null;
                    this.toastr.success('Updated successfully!', '', {
                        timeOut: 5000,
                        closeButton: true
                    });

                    this.homeService.getSecurityQuestionList().subscribe((result) => {
                        if (result) {
                           let val =  this.formGroup?.get('securityQuestionsName')?.value;
                            if(val == 1){
                            this.securityQuesLst1 = result.body.question1;
                            this.securityQuesLst2 = result.body.question2;
                            this.dataSource = new MatTableDataSource(result.body.question1);
                            this.dataSource.paginator = this.paginator;
                            this.selectedRowIndex = null;
                            this.dataSource.sort = this.sort;
                            }else if(val == 2){
                                this.securityQuesLst1 = result.body.question1;
                                this.securityQuesLst2 = result.body.question2;
                                this.dataSource = new MatTableDataSource(result.body.question2);
                                this.dataSource.paginator = this.paginator;
                                this.selectedRowIndex = null;
                                this.dataSource.sort = this.sort;
                            }
                        }
                    });    
                this.modalRef.hide();
                this.hideLoader();
                }else{
                  this.hideLoader();
                }
            });
        } else {
            this.formGroup.markAllAsTouched();
        }
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
}