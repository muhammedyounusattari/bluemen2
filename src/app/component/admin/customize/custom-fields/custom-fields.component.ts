import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomFieldService } from 'src/app/services/admin/custom-fields.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/services/shared.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { NotificationUtilities } from 'src/app/shared/utilities/notificationUtilities';
import { ValidationClass } from 'src/app/shared/validation/common-validation-class';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {

  public customFieldsForm: FormGroup;
  public customFieldsSearchForm: FormGroup;
  public customFields: any;
  public customID: any = 1;
  public selectedRowData: any;
  public selectedRow: any = null;
  public isEdit: boolean;
  public customFieldSearchList: any = [];
  public customFieldList: any = [];
  public customFieldsModalVisible: boolean = false;
  public customFieldsModalHeader: string = 'Custom Fields';
  public isConfirmCustomFieldsLoading: boolean = false;
  public dataLoading: boolean = false;
  public customFieldParentSearchList: any = [];
  public customFieldChildSearchList: any = [];

  customFieldsNameTypeList = [
    { key: '1 - Best time to call', value: '1', isSelected: true },
    { key: 'T-shirt size', value: '2', isSelected: false }
  ];

  validationClass: ValidationClass = new ValidationClass();
  constructor(private fb: FormBuilder
    , private customFieldService: CustomFieldService
    , private sharedService: SharedService,
    private notificationService: NotificationUtilities) { }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Custom Fields');
    // this.customID = this.customFieldsNameTypeList[0].value;
    // this.customFieldsNameTypeList[0].isSelected = true;
    this.getCustomFieldNameType();
    this.initialiseForm();
    this.searchValue();
    
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.customFieldsForm = this.fb.group({
      customId: [''],
      pullDownName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * @method searchValue
   */
  public searchValue() {
    this.customFieldsSearchForm = this.fb.group({
      name: ['']
    });
  }

  /**
  * @method addCustomFieldNameType
  * @description this method is used for show the custome field name type popup
  */
  openModal() {
    this.customFieldsModalVisible = true;
  }

  /**
  * @method addCustomFieldNameType
  * @description this method is used for hide the custome field name type popup
  */

  hideModel() {
    this.customFieldsModalVisible = false;

  }

  /**
 * @method addCustomFieldNameType
 * @description this method is used for add the custome field name type
 */
  public addCustomFieldNameType() {
    if (this.customFieldsForm.valid) {
      this.isConfirmCustomFieldsLoading = true;
      this.customFieldService.addToCustomFieldsNameType(this.requestPayload()).subscribe((result) => {
        if (result) {
          this.hideModel();
          this.isConfirmCustomFieldsLoading = false;
          this.selectedRow = null;
          this.selectedRowData = null;
          this.notificationService.createNotificationBasic('success', "Custom Fields", 'Custom Fields Data Added Successfully!');
          this.getCustomFieldNameType();
        }
      });
    } else {
      this.customFieldsForm.markAllAsTouched();
      Object.values(this.customFieldsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  /**
  * @method showCustomFieldsModel
  * @description this method is used for show the model
  */
  showCustomFieldsModel(): void {
    this.isEdit = false;
    this.initialiseForm();
    this.customFieldsModalVisible = true;
  }

  /**
  * @method editCustomFieldNameType
  * @description this method is used for edit the custome field name type data
  */
  public editCustomFieldNameType() {
    if (this.selectedRowData && this.customFieldsForm.valid) {
      let request: any = this.requestPayload();
      if (request['id'] == undefined) {
        request['id'] = this.selectedRowData.customId
      }
      this.isConfirmCustomFieldsLoading = true;
      this.customFieldService.editCustomFieldsNameType(request).subscribe((result) => {
        if (result) {
          this.hideModel();
          this.isConfirmCustomFieldsLoading = false;
          this.selectedRow = null;
          this.selectedRowData = null;
          this.notificationService.createNotificationBasic('success', "Custom Fields", 'Custom Fields Data Updated Successfully!');
          this.getCustomFieldNameType();
        }
      });
    } else {
      this.customFieldsForm.markAllAsTouched();
      Object.values(this.customFieldsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  /**
 * @method getCustomFieldNameType
 * @description this method is used for get the custome field name type list
 */
  public getCustomFieldNameType() {
    this.showLoader();
    this.customFieldService.getCustomFieldsNameType().subscribe((result) => {
      this.hideLoader();
      if (result) {
        this.customFieldList = result;
        this.customFieldSearchList = result;
        this.customFieldParentSearchList = result;
        this.customFieldChildSearchList = result;
        this.customFieldsSearchForm.get('name')?.setValue('all');
      }

    });
  }

  /**
  * @method hideLoader
  * @description this method is used for hide the loading process
  */
  hideLoader() {
    this.dataLoading = false;
  }

  /**
    * @method showLoader
    * @description this method is used for show the loading process
    */
  showLoader() {
    this.dataLoading = true;

  }

  /**
  * @method deleteCustomFieldNameType
  * @description this method is used for delete the records
  */
  public deleteCustomFieldNameType(data: any, index: number) {
    this.getSelectedRow(data, index);
    this.customFieldService.deleteCustomFieldsNameType({ customId: this.selectedRowData.customId }).subscribe((result) => {
      if (result) {
        this.selectedRow = null;
        this.selectedRowData = null;
        this.notificationService.createNotificationBasic('success', "Custom Fields", 'Custom Fields Data Deleted Successfully!');
        this.getCustomFieldNameType();
      }
    });
  }

  /**
  * @method cancelDelete
  * @description this method is used for cancel the delted popup
  */
  cancelDelete(): void {
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public editCustomFields(data: any, index: number) {
    this.isEdit = true;
    this.getSelectedRow(data, index);
    this.customFieldsForm.get('customId')?.setValue(this.selectedRowData.customId);
    this.customFieldsForm.get('pullDownName')?.setValue(this.selectedRowData.pullDownName);
    this.openModal();

  }

  /**
   * @method getSelectedRow
   * @description get selected row data to perform action
   */
  public getSelectedRow(data: any, index: number) {
    this.selectedRow = index;
    this.selectedRowData = data;
  }


  /**
   * @method requestPayload
   * @description create request payload for API
   */
  public requestPayload() {
    return {
      customId: (this.selectedRowData && this.selectedRowData.customId) ? this.selectedRowData.customId : 0,
      pullDownName: this.customFieldsForm.get('pullDownName')?.value
    }
  }

  /**
   * @method filterCustomFieldsNameType
   * @description serching according parameters
   */
  filterCustomFieldsNameType() {
    let name = this.customFieldsSearchForm?.get('name')?.value;
    if (name && name != 'all') {
      const data = this.customFieldChildSearchList.filter((item: any) => item && (item.pullDownName.trim().toLowerCase() === name.trim().toLowerCase()));
      if (data && data.length > 0) {
        this.customFieldList = data;
      } else {
        this.customFieldList = this.customFieldParentSearchList;
      }
      return;
    } else {
      this.customFieldList = this.customFieldParentSearchList;
    }
  }

  /**
    * @method verifyCustomeFiledsNameType
    * @description verifying custome fileds name type already exist or not.
    */
   verifyCustomeFiledsNameType(event: any) {
    if (!this.validationClass.isNullOrUndefined(event)) {
      let pullDownName = this.customFieldsForm.get('pullDownName')?.value;
      const data = this.customFieldParentSearchList.filter((item: any) => (item.pullDownName).toLowerCase().trim() === pullDownName.toLowerCase().trim());
      if (data && data.length > 0) {
        this.notificationService.createNotificationBasic('info', "info", 'Pull down name is already exist!');
        this.customFieldsForm.get('pullDownName')?.setValue('');
        return;
      } else {
        this.customFieldsForm.get('staffMaillingName')?.setValue(pullDownName);
        return;
      }
    }
  }

  /**
   * @method applyFilter
   * @description search the text from list
   */
  applyFilter(search: any) {
    const targetValue: any[] = [];
    this.customFieldSearchList.forEach((value: any) => {
      let keys = ["customId", "pullDownName"];
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search)) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.customFieldList = targetValue;
  }

  /**
  * @method print
  * @description print the list
  */
  print() {
    var doc = new jsPDF('l', 'mm', 'a4');
    const head = [['Id', 'Pull Down Name']]
    let data: any = [];
    this.customFieldList.forEach((e: any) => {
      var tempObj = [];
      tempObj.push(e.customId);
      tempObj.push(e.pullDownName);
      data.push(tempObj);
    });
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
        doc.text("Compansol TRIO Custom Fields Listing", 140, 15, {
          align: 'center'
        });

      },
      didDrawCell: (data) => { },
    });
    doc.setProperties({
      title: "Custom Fields"
    });
    window.open(doc.output('bloburl').toString(), '_blank');
  }

  /**
  * @method handleCancel
  * @description reset the object and hide the model
  */
  handleCancel(): void {
    this.initialiseForm();
    this.customFieldsModalVisible = false;
  }

  /**
 * @method sorting
 * @description this method is used for asc sorting
 */
  sorting(attr: string) {
    if (this.customFieldList.length > 0) {
      this.customFieldList = [...this.customFieldList].sort((a, b) => (a[attr] > b[attr]) ? 1 : -1)
    }
  }

  /**
  * @method sorting
  * @description this method is used for desc sorting
  */
  sorting2(attr: string) {
    if (this.customFieldList.length > 0) {
      this.customFieldList = [...this.customFieldList].sort((a, b) => (a[attr] < b[attr]) ? 1 : -1)
    }
  }
}
