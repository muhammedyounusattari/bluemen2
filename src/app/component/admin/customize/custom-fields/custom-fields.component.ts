import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomFieldService } from 'src/app/services/admin/custom-fields.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {
  @ViewChild('customFieldValuePopup') customFieldValuePopupRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    // class: 'modal-sm',
    class: 'modal-dialog-centered'
  };
  public customFieldsForm: FormGroup;
  public customFields: any;
  public selectedOption: any;
  public selectedRow: any = null;
  public customID: any = 1;
  public spinner: boolean = true;
  public selectedRowData: any;
  public selectedRowIndex: any;
  myElement: any = null;
  isLoading: boolean = true;
  public customFieldList: any = [];
  public id: string;
  public pullDownName: string;
  public isEdit: boolean;

  columnsToDisplay: string[] = ['customId', 'pullDownName'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }
  // customFieldListArray = [{'name': '1 - Best time to call', 'value': 1}, {'name': 'T-shirt size', 'value': 2}]
  constructor(private modalService: BsModalService
    , private fb: FormBuilder
    , private customFieldService: CustomFieldService
    , private dialog: MatDialog
    , private toastr: ToastrService
    , private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.setPageTitle('Custom Fields');
    this.myElement = window.document.getElementById('loading');
    this.getCustomFieldNameType();
    this.initialiseForm();
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.customFieldsForm = this.fb.group({
      customId: [''],
      pullDownName: [''],
    });
  }

  addNewDropdown() {
    this.openModal(this.customFieldValuePopupRef);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
  }

  /**
   * @method addCustomFieldNameType
   */
  public addCustomFieldNameType() {
    if (this.customFieldsForm.valid) {
      this.customFieldService.addToCustomFieldsNameType(this.requestPayload()).subscribe((result) => {
        if (result) {
          this.modalRef.hide();
          this.selectedRow = null;
          this.toastr.success('Saved Successfully !', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.getCustomFieldNameType();
        }
      });
    } else {
      this.customFieldsForm.markAllAsTouched();
    }
  }

  /**
   * @method editCustomFieldNameType
   */
  public editCustomFieldNameType() {
    if (this.selectedRow && this.customFieldsForm.valid) {
      let request: any = this.requestPayload();
      if (request['id'] == undefined) {
        request['id'] = this.selectedRow.customId
      }
      this.customFieldService.editCustomFieldsNameType(request).subscribe((result) => {
        if (result) {
          this.modalRef.hide();
          this.selectedRow = null;
          this.toastr.success('Updated Successfully !', '', {
            timeOut: 5000,
            closeButton: true
          });
          this.getCustomFieldNameType();
        }
      });
    }
  }

  /**
   * @method getCustomFieldNameType
   */
  public getCustomFieldNameType() {
    this.spinner = true;
    this.customFieldService.getCustomFieldsNameType().subscribe((result) => {

      this.hideLoader();
      if (result) {
        this.customFieldList = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.selectedRowIndex = null;
        this.dataSource.sort = this.sort;
      }

    });
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

  /**
   * @method deleteCustomFieldNameType
   */
  public deleteCustomFieldNameType() {
    if (this.selectedRow) {
      this.showLoader();
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm remove record',
          message: 'Are you sure, you want to remove this record: ' + this.customFieldsForm.get('pullDownName')?.value
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.customFieldService.deleteCustomFieldsNameType({ customId: this.selectedRow.customId }).subscribe((result) => {
            if (result) {
              this.selectedRow = null;
              this.getCustomFieldNameType();
            }
          });

        } else {
          this.hideLoader();
        }
      });
    } else {
      this.toastr.info('Please select a row to delete', '', {
        timeOut: 5000,
        closeButton: true
      });
    }
  }

  /**
   * @method filterCustomFieldNameType
   */
  public filterCustomFieldNameType() {
    this.customFieldService.filterCustomFieldsNameType(this.requestPayload()).subscribe((result) => {
      if (result) {
        this.getCustomFieldNameType();
      }
    });
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public getSelectedOption(selectedOption: string) {
    this.selectedOption = selectedOption;
    if (selectedOption === 'Edit') {
      if (this.selectedRow) {
        this.customFieldsForm.get('customId')?.setValue(this.selectedRow.customId);
        this.customFieldsForm.get('pullDownName')?.setValue(this.selectedRow.pullDownName);
        this.openModal(this.customFieldValuePopupRef);
      } else {
        this.toastr.info('Please select a row to update ', '', {
          timeOut: 5000,
          closeButton: true
        });
      }
    } else {
      this.customFieldsForm.reset();
      this.selectedRow = null;
      this.customFieldsForm.updateValueAndValidity();
      this.openModal(this.customFieldValuePopupRef);
    }

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
   * @method handleMethodToCall
   */
  public handleMethodToCall() {
    switch (this.selectedOption) {
      case 'New':
        this.addCustomFieldNameType();
        break;
      case 'Edit':
        this.editCustomFieldNameType()
        break;
      case 'Rename':
        break;
      case 'Move':
        break;
      case 'Merge':
        break;
      case 'Delete':
        this.deleteCustomFieldNameType();
        break;
      case 'Print':
        break;
      case 'Submit':
        break;
      default:
        break;
    }
  }

  /**
   * @method requestPayload
   * @description create request payload for API
   */
  public requestPayload() {
    return {
      customId: (this.selectedRow && this.selectedRow.customId) ? this.selectedRow.customId : 0,
      pullDownName: this.customFieldsForm.get('pullDownName')?.value
    }
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setSelectedRow(selectedRowItem: any, index: number) {
    this.selectedRowIndex = index;
    const data = this.customFieldList.filter((item: any) => item.staffId === selectedRowItem.id);
    if (data && data.length > 0) {
      this.selectedRow = selectedRowItem;
    }
  }

  setSelectedRowToUpdate() {
    this.isEdit = true;
    if (this.dataSource.data[0]) {
      this.id = this.dataSource.data[0].id
      this.pullDownName = this.dataSource.data[0].pullDownName;

    }

  }
}
