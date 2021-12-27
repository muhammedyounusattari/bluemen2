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
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    public configSettingsList: any;
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
      this.configSettingsService.getConfigSettings().subscribe((result: any) => {
        if (result) {
          this.spinner = false;
          this.configSettingsList = result;
        }
      });
    }
}
