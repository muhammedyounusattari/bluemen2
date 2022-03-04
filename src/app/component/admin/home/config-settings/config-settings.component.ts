import {Component, TemplateRef, ViewChild, OnInit} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {ConfigSettingsService} from 'src/app/services/admin/config-settings.service';

import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-config-settings',
  templateUrl: './config-settings.component.html',
  styleUrls: ['./config-settings.component.css']
})

export class ConfigSettingsComponent implements OnInit {
  @ViewChild('confiSettingPopup') confiSettingPopupRef: TemplateRef<any>;
  isVisible: boolean = false;
  modalRef: BsModalRef;
  selectedRowIndex: any;
  isEdit: boolean = false;
  myElement: any = null;
  isLoading: boolean = true;
  description: string;
  id: string;
  configValue: string;
  configType: string;
  userList: any =[];
  userSelected: string;


  columnsToDisplay: string[] = ['id', 'configType', 'configValue', 'description'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

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
   this.configSettingsService.getUserList().subscribe((result:any) => {
        if(result){
        this.userList = result;
          console.log("result", result);
        }
      });
    this.getConfigSettings();
  }

  ngOnInit() {
    this.myElement = window.document.getElementById('loading');



    this.configSettingsService.getConfigSettings().subscribe((result: any) => {
      this.hideLoader();

      if (result) {
        this.configSettingsList = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.selectedRowIndex = null;
        this.dataSource.sort = this.sort;
      }
    });
  }

  addNewDropdown() {
    this.openModal(this.confiSettingPopupRef);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfigSM)
  }

  /**
   * @method getConfigSettings
   */
  public getConfigSettings() {
    this.spinner = true;

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
        this.id = this.selectedRow.id
        this.configValue = this.selectedRow.configValue;
        this.configType = this.selectedRow.configType;
        this.description = this.selectedRow.description;
        this.openModal(this.confiSettingPopupRef);
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

  updateSelectedRow() {
    this.spinner = true;
    let payload = {
      id: this.id,
      configValue: this.configValue,
      configType: this.configType,
      description: this.description
    }

    this.configSettingsService.saveConfigSettings(payload).subscribe((result: any) => {
      if (result) {
        this.spinner = false;
        this.configSettingsList = result;
        window.location.reload();
      }
    });

  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getConfigValues(userEvent:any){
    alert();
  }
}
