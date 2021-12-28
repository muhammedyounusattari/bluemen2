import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  public pulldownList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public spinner: boolean = true;
  public orgTypes = [
    { id: 1, name: 'SSS'},
    { id: 2, name: 'VUB'},
    { id: 3, name: 'UB'},
    { id: 4, name: 'UB_MS'},
    { id: 5, name: 'TS'},
    { id: 6, name: 'RMN'},
    { id: 7, name: 'EOC'}
  ];
  public selectedData: any;

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
      name: [''],
      id: [''],
      apr: [''],
      aprName: [''],
      active: [''],
      orgId: [''],
      selectionType: [''],
      orgType: new FormArray([])
    });
    this.orgTypes.forEach(() => this.orgTypeFormArray.push(new FormControl(false)));
  }

  get orgTypeFormArray() {
    return this.pulldownListModalForm.controls.orgType as FormArray;
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
    let request: any = this.requestPayload();
    if (request['id'] == undefined) {
      request['id'] = this.selectedData.id
    }
    this.pullDownListService
      .editPullDownList(request)
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
    this.spinner = true;
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
      .deletePullDownList({id: Number(this.selectedData.id)})
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
    this.pulldownListModalForm.reset();
    this.pulldownListModalForm.updateValueAndValidity();
    if(this.selectedOption === 'Edit') {
      this.pulldownListModalForm.get('apr')?.setValue(this.selectedData.apr);
      this.pulldownListModalForm.get('orgId')?.setValue(this.selectedData.orgId);
      this.pulldownListModalForm.get('active')?.setValue(this.selectedData.active);
      this.pulldownListModalForm.get('selectionType')?.setValue(this.selectedData.selectionType);
      this.pulldownListModalForm.get('id')?.setValue(this.selectedData.id);
      this.pulldownListModalForm.get('name')?.setValue(this.selectedData.name);
      this.pulldownListModalForm.value.orgType.forEach((item: any, index: any) => {
        this.selectedData.orgType.forEach((element: any) => {
          if (element === this.orgTypes[index].name) {
            this.orgTypeFormArray.controls[index].setValue(true);
          }
        });
      });
    }
  }


  /**
   * @method getSelectedRow
   * @description get selected row data to perform action
   */
  public getSelectedRow(data: any, index: number) {
    this.selectedRow = index;
    this.selectedData = data;
  }

  /**
   * @method handleMethodToCall
   */
  public handleMethodToCall() {
    switch (this.selectedOption) {
      case 'New':
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
    let data: any = [];
    this.pulldownListModalForm.value.orgType.filter((item: any, index: any) => {
      if (item) {
        data.push(this.orgTypes[index].name);
      }
    });
    return {
      apr: this.pulldownListModalForm.value.apr,
      aprName: this.pulldownListModalForm.value.aprName,
      orgId: this.pulldownListModalForm.value.orgId,
      active: this.pulldownListModalForm.value.active,
      orgType: data,
      name: this.pulldownListModalForm.value.name,
      selectionType: this.pulldownListModalForm.value.selectionType
    }
  }
}
