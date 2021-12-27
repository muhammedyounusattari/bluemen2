import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PullDownListService } from 'src/app/services/admin/pulldown-list.service';

@Component({
  selector: 'app-pulldown-list',
  templateUrl: './pulldown-list.component.html',
})
export class PulldownListComponent {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
  };
  public pulldownListModalForm: FormGroup;
  public pulldownListForm: FormGroup;
  public formValues: any;
  public pulldownList: any;
  public selectedOption: string = '';
  public selectedRow: any = null;
  public spinner: boolean = true;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private pullDownListService: PullDownListService
  ) {
    this.getPullDownList();
  }

  ngOnInit(): void {
    this.initialiseForm();
  }

  /**
   * @method initialiseForm
   */
  public initialiseForm() {
    this.pulldownListForm = this.fb.group({
      apr: ['1'],
      orgId: [''],
      active: [''],
      orgType: ['']
    });

    this.pulldownListModalForm = this.fb.group({
      id: [1],
      name: [''],
      apr: ['1'],
      orgId: [''],
      active: [''],
      orgType: ['']
    });
  }

  /**
   * @method openModal
   */
  public openModal() {
    this.modalRef = this.modalService.show(
      this.addDropDownValueRef,
      this.modalConfigSM
    );
  }

  /**
   * @method addPullDownList
   */
  public addPullDownList() {
    this.pullDownListService
      .addPullDownList(this.requestPayload())
      .subscribe((result) => {
        if (result) {
          this.getPullDownList();
        }
      });
  }

  /**
   * @method editPullDownList
   */
  public editPullDownList() {
    this.pullDownListService
      .editPullDownList(this.requestPayload())
      .subscribe((result) => {
        if (result) {
          this.getPullDownList();
        }
      });
  }

  /**
   * @method getPullDownList
   */
  public getPullDownList() {
    this.pullDownListService.getPullDownList().subscribe((result) => {
      if (result) {
        this.spinner = false;
        this.pulldownList = result;
      }
    });
  }

  /**
   * @method deletePullDownList
   */
  public deletePullDownList() {
    this.pullDownListService
      .deletePullDownList({id: Number(this.pulldownListModalForm.value.id)})
      .subscribe((result) => {
        if (result) {
          this.getPullDownList();
        }
      });
  }

  /**
   * @method filterPullDownList
   */
  public filterPullDownList() {
    this.pullDownListService
      .filterPullDownList(this.requestPayload())
      .subscribe((result: any) => {
        if (result && result.length > 0) {
          result.forEach((data: any) => {
            data.orgType = data.orgType.toString();
          });
          this.getPullDownList();
        }
      });
  }

  /**
   * @method getSelectedOption
   * @description get the requested modal type
   */
  public getSelectedOption(selectedOption: string) {
    this.selectedOption = selectedOption;
  }


  /**
   * @method getSelectedRow
   * @description get selected row data to perform action
   */
  public getSelectedRow(data: any, index: number) {
    this.selectedRow = index;
    this.pulldownListForm.get('apr')?.setValue(data.apr);
    this.pulldownListForm.get('orgId')?.setValue(data.orgId);
    this.pulldownListForm.get('active')?.setValue(data.active);
    this.pulldownListForm.get('orgType')?.setValue(data.orgType.toString());
    this.pulldownListModalForm.get('id')?.setValue(data.id);
    this.pulldownListModalForm.get('name')?.setValue(data.name);
  }

  /**
   * @method handleMethodToCall
   */
  public handleMethodToCall() {
    switch (this.selectedOption) {
      case 'New':
        this.pulldownListModalForm.get('id')?.setValue('');
        this.pulldownListModalForm.get('name')?.setValue('');
        this.pulldownListModalForm.updateValueAndValidity();
        this.addPullDownList();
        break;
      case 'Edit':
        this.editPullDownList()
        break;
      case 'Rename':
        break;
      case 'Move':
        break;
      case 'Merge':
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
   * @description create the request payload for API's
   */
  public requestPayload() {
    return {
      apr: this.pulldownListForm.value.apr,
      orgId: this.pulldownListForm.value.orgId,
      active: this.pulldownListForm.value.active,
      orgType: [this.pulldownListForm.value.orgType],
      id: this.pulldownListModalForm.value.id,
      name: this.pulldownListModalForm.value.name,
      selectionType: 'Signle Selection'
    }
  }
}
