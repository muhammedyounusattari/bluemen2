import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PullDownListService } from "src/app/services/admin/pulldown-list.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../../shared/components/confirm-dialog-box/confirm-dialog-box.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-pulldown-list",
  templateUrl: "./pulldown-list.component.html",
  styleUrls: ["./pulldown-list.component.css"],
})
export class PulldownListComponent {
  @ViewChild("pullDownPopup") pullDownPopup: TemplateRef<any>;
  @ViewChild("nonNumericPullDownPopup")
  nonNumericPullDownPopup: TemplateRef<any>;
  modalRef: BsModalRef;
  modalConfigSM = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-lg",
  };

  public pulldownItem: FormGroup;
  public nonNumericPulldownItem: FormGroup;
  public pulldownListForm: FormGroup;
  public formValues: any;
  public pulldownList: any = [];
  public filteredPulldownList: any = [];
  public pulldownType: string;
  public pulldownItems: any = [];
  public selectedOption: string = "";
  public selectedRow: any = null;
  public spinner: boolean = true;
  public readNumber: boolean = false;
  public addPullDownItem: boolean = false;
  public isEditable: boolean = false;
  public isNonNumericEditable: boolean = false;
  public pulldownNumValidateMsg: string;

  isEdit: boolean = false;
  myElement: any = null;
  public selectedRowIndex: any;
  public selectedStudentList: any[];
  public selectedRowData: any = null;
  public selectedModalRow: any = null;
  public selectedModalRowData: any = null;

  public selectedData: any;
  public pulldownTypeList: any;
  columnsToDisplay: string[] = ["pullId", "name", "active"];
  isLoading: boolean = true;
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

  search(query: any) {
    console.log("query", query.target.value);
    if (query?.target?.value) {
      this.pulldownTypeList = this.select(query.target.value);
    } else {
      this.getPullDownList();
    }
  }

  select(query: string): string[] {
    let result: string[] = [];
    for (let pulldown of this.pulldownTypeList) {
      if (pulldown.name.indexOf(query) > -1) {
        // this.getPullDownItems(pulldown.id);
        result.push(pulldown);
      }
    }
    return result;
  }

  formType = new FormControl("pullType", [Validators.required]);

  myForm = this.builder.group({
    formType: this.formType,
  });

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private builder: FormBuilder,
    private pullDownListService: PullDownListService,
    private dialog: MatDialog
  ) {
    this.getPullDownList();
  }

  ngOnInit(): void {
    this.pulldownItem = this.fb.group({
      pullId: ["", Validators.required],
      pulldownName: [""],
    });
    this.nonNumericPulldownItem = this.fb.group({
      pulldownName: [""],
    });
  }

  getPullItems(id: any) {
    this.pullDownListService.getPullDownItems(id).subscribe((result) => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * @method openModal
   */
  public openModal() {
    const id = this.formType.value;
    this.isEditable = false;
    if (id !== "pullType") {
      this.pullDownListService.getPullDownItem(id).subscribe((result) => {
        this.pulldownType = result.name;
        if (result.editable) {
          this.nonNumericPulldownItem.reset();
          this.modalRef = this.modalService.show(
            this.nonNumericPullDownPopup,
            this.modalConfigSM
          );
          return;
        }
        if (!result.editable && result.pullDownItems.length > 0) {
          this.readNumber = true;
        }
        this.addPullDownItem = false;
        this.pulldownNumValidateMsg = "";
        this.modalRef = this.modalService.show(
          this.pullDownPopup,
          this.modalConfigSM
        );
      });
    } else {
      alert("Please select Pulldown Type");
      return;
    }
  }

  /**
   * @method editPullDownList
   */
  public editPullDownList() {
    this.spinner = true;
    this.isEditable = true;
    const id = this.formType.value;
    if (id !== "pullType") {
      this.pullDownListService.getPullDownItem(id).subscribe((result) => {
        if (result.editable) {
          this.isNonNumericEditable = true;
          this.nonNumericPulldownItem
            .get("pulldownName")
            ?.setValue(this.selectedRow.name);
          this.modalRef = this.modalService.show(
            this.nonNumericPullDownPopup,
            this.modalConfigSM
          );
          return;
        }

        this.pulldownType = result.name;
        this.pulldownItem.get("pullId")?.setValue(this.selectedRow.pullId);
        this.pulldownItem.get("pulldownName")?.setValue(this.selectedRow.name);
        this.pulldownItem.controls.pullId.disable();
        this.addPullDownItem = true;
        this.modalRef = this.modalService.show(
          this.pullDownPopup,
          this.modalConfigSM
        );
      });
    } else {
      alert("Please select Pulldown Type");
      return;
    }
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
        this.pulldownTypeList = result;
        this.filteredPulldownList = this.pulldownTypeList.slice();
      }
    });
  }

  /**
   * @method getSelectedRow
   * @description get selected row data to perform action
   */
  public getSelectedRow(data: any, index: number) {
    this.selectedRow = index;
    this.selectedData = data;
  }

  hideLoader() {
    this.myElement = window.document.getElementById("loading");
    if (this.myElement !== null) {
      this.spinner = false;
      this.isLoading = false;
      this.myElement.style.display = "none";
    }
  }

  showLoader() {
    if (this.myElement !== null) {
      this.spinner = true;
      this.isLoading = true;
      this.myElement.style.display = "block";
    }
  }

  setSelectedRow(selectedRowItem: any, index: Number) {
    this.selectedRowIndex = index;
    this.selectedRow = selectedRowItem;
  }

  getPullIdValidated() {
    this.pullDownListService
      .getPullDownIdValidated(
        this.pulldownItem.value.pullId,
        this.formType.value
      )
      .subscribe((result) => {
        this.pulldownItem.controls.pullId.disable();
        if (result.length == 0) {
          this.addPullDownItem = true;
          this.pulldownNumValidateMsg = "";
        } else {
          this.pulldownItem.controls.pullId.enable();
          this.pulldownNumValidateMsg =
            "Pulldown Id " +
            this.pulldownItem.value.pullId +
            " is already in use";
        }
      });
  }

  closeModal() {
    this.modalRef.hide();
    this.pulldownItem.controls.pullId.enable();
    this.pulldownItem.reset();
  }

  savePulldownItem() {
    const payload = {
      pullId: this.pulldownItem.controls.pullId.value,
      name: this.pulldownItem.controls.pulldownName.value,
      pulldownId: this.formType.value,
      active: true,
    };
    this.pullDownListService
      .addPullDownList(this.formType.value, payload)
      .subscribe((result) => {
        if (result) {
          this.closeModal();
          this.getPullItems(this.formType.value);
        }
      });
  }
  saveNonNumericPulldownItem() {
    const payload = {
      name: this.nonNumericPulldownItem.controls.pulldownName.value,
      pulldownId: this.formType.value,
      active: true,
    };
    this.pullDownListService
      .addNonNumericPullDownList(this.formType.value, payload)
      .subscribe((result) => {
        if (result) {
          this.closeModal();
          this.getPullItems(this.formType.value);
        }
      });
  }

  updatePulldownItem() {
    const payload = {
      pullId: this.pulldownItem.controls.pullId.value,
      name: this.pulldownItem.controls.pulldownName.value,
      pulldownId: this.formType.value,
      id: this.selectedRow.id,
      active: true,
    };
    this.pullDownListService
      .updatePullDownList(this.formType.value, payload)
      .subscribe((result) => {
        if (result) {
          this.closeModal();
          this.getPullItems(this.formType.value);
        }
      });
  }

  updatePulldownItemForNonNumericField() {
    const payload = {
      name: this.nonNumericPulldownItem.controls.pulldownName.value,
      pulldownId: this.formType.value,
      id: this.selectedRow.id,
      active: true,
    };
    this.pullDownListService
      .updatePullDownList(this.formType.value, payload)
      .subscribe((result) => {
        if (result) {
          this.closeModal();
          this.getPullItems(this.formType.value);
        }
      });
  }

  /**
   * @method deletePullDownList
   */
  public deletePullDownList() {
    if (this.selectedRow) {
      //first validate pulldownItem is editable or not

      const id = this.formType.value;
      if (id !== "pullType") {
        this.pullDownListService.getPullDownItem(id).subscribe((result) => {
          if (result.editable) {
            this.deleteNonNumericPullDownList();
          } else {
            this.deleteNumericPullDownList();
          }
        });
      }
    }
  }

  public deleteNumericPullDownList() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Confirm Remove Record",
        message:
          "On Delete operation, record with name " +
          this.selectedRow.name +
          " will be softDeleted (one can restore it by edit) ",
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        const payload = {
          pullId: this.selectedRow.pullId,
          name: this.selectedRow.name,
          pulldownId: this.formType.value,
          id: this.selectedRow.id,
          active: false,
        };

        this.pullDownListService
          .updatePullDownList(this.formType.value, payload)
          .subscribe((result) => {
            if (result) {
              this.closeModal();
              this.getPullItems(this.formType.value);
            }
          });
      } else {
        this.hideLoader();
      }
    });
  }

  /**
   * @method deleteNonNumeric
   */
  public deleteNonNumericPullDownList() {
    if (this.selectedRow) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirm Remove Record",
          message:
            "Are you sure, you want to remove this record: " +
            this.selectedRow.name,
        },
      });

      confirmDialog.afterClosed().subscribe((result) => {
        if (result === true) {
          const payload = {
            pulldownId: this.formType.value,
            id: this.selectedRow.id,
          };
          this.pullDownListService
            .deletePullDownList(this.formType.value, payload)
            .subscribe((result) => {
              if (result) {
                this.getPullItems(this.formType.value);
              }
            });
        } else {
          this.hideLoader();
        }
      });
    }
  }
}
