import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfigSettingsService } from 'src/app/services/admin/config-settings.service';

@Component({
  selector: 'app-config-settings',
  templateUrl: './config-settings.component.html',
  styleUrls: ['./config-settings.component.css']
})

export class ConfigSettingsComponent {
  @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
  isVisible: boolean = false;
  modalRef: BsModalRef;
  selectedRowIndex: number;
  isEdit: boolean = false;
  description:string;
  id:string;
  configValue:string;
  configType:string;

  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  }
  public configSettingsList: any = [];
  public selectedOption: string = '';
  public selectedRow: any = null;
  public selectedRowData: any = null;
  public spinner: boolean = true;
  constructor(private modalService: BsModalService,
              private configSettingsService: ConfigSettingsService
  ) {
    this.getConfigSettings();
  }

  addNewDropdown() {
    this.openModal(this.addDropDownValueRef);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  /**
   * @method getConfigSettings
   */
  public getConfigSettings() {
    this.spinner = true;
    this.configSettingsService.getConfigSettings().subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.configSettingsList = result;
      }
    });
  }

  setSelectedRow(selectedRowItem: any, index: number) {
    this.selectedRowIndex = index;
    const data = this.configSettingsList.filter((item: any) => item.staffId === selectedRowItem.staffId);
    if (data && data.length > 0) {
      this.selectedRow = selectedRowItem;
    }
  }

  setSelectedRowToUpdate() {
    this.isEdit = true;
    this.id = this.selectedRow.id;
    this.configValue = this.selectedRow.configValue;
    this.configType = this.selectedRow.configType;
    this.description = this.selectedRow.description;

  }
  updateSelectedRow(){
    this.spinner = true;
    let payload = {
      id:this.id,
      configValue:this.configValue,
      configType:this.configType,
      description:this.description
    }

    this.configSettingsService.saveConfigSettings(payload).subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.configSettingsList = result;
        window.location.reload();
      }
    });

  }
}
