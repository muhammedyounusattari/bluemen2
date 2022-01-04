import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomFieldService } from 'src/app/services/admin/custom-fields.service';


import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  // styleUrls: ['./pulldown-list.component.css']
})
export class CustomFieldsComponent implements OnInit {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm',
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
  public id:string;
  public pullDownName:string;
  public isEdit:boolean;

  columnsToDisplay: string[] = ['customId', 'pullDownName'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private customFieldService: CustomFieldService
  ) {
    this.getCustomFieldNameType();
  }

  ngOnInit(): void {
    this.myElement = window.document.getElementById('loading');
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
    this.openModal(this.addDropDownValueRef);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM);
  }

  /**
   * @method addCustomFieldNameType
   */
  public addCustomFieldNameType() {
    this.customFieldService.addToCustomFieldsNameType(this.requestPayload()).subscribe((result) => {
      if (result) {
        this.getCustomFieldNameType();
      }
    });
  }

  /**
   * @method editCustomFieldNameType
   */
  public editCustomFieldNameType() {
    let request: any = this.requestPayload();
    if (request['id'] == undefined) {
      request['id'] = this.selectedRow.customId
    }
    this.customFieldService.editCustomFieldsNameType(request).subscribe((result) => {
      if (result) {
        this.getCustomFieldNameType();
      }
    });
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
    this.customFieldService.deleteCustomFieldsNameType({customId: this.selectedRow.customId}).subscribe((result) => {
      if (result) {
        this.getCustomFieldNameType();
      }
    });
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
      this.customFieldsForm.get('customId')?.setValue(this.selectedRow.customId);
      this.customFieldsForm.get('pullDownName')?.setValue(this.selectedRow.pullDownName);
    } else {
      this.customFieldsForm.reset();
      this.customFieldsForm.updateValueAndValidity();
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
      customId: (this.selectedRow &&this.selectedRow.customId)?this.selectedRow.customId:0,
      pullDownName: this.customFieldsForm.value.pullDownName
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
