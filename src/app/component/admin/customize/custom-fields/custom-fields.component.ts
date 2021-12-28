import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomFieldService } from 'src/app/services/admin/custom-fields.service';

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

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private customFieldService: CustomFieldService
  ) {
    this.getCustomFieldNameType();
  }

  ngOnInit(): void {
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
      request['id'] = this.selectedRowData.id
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
      if (result) {
        this.spinner = false;
        this.customFields = result;
      }
    });
  }

  /**
   * @method deleteCustomFieldNameType
   */
  public deleteCustomFieldNameType() {
    this.customFieldService.deleteCustomFieldsNameType({customId: this.selectedRowData.customId}).subscribe((result) => {
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
      this.customFieldsForm.get('customId')?.setValue(this.selectedRowData.customId);
      this.customFieldsForm.get('pullDownName')?.setValue(this.selectedRowData.pullDownName);
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
      pullDownName: this.customFieldsForm.value.pullDownName
    }
  }

}
