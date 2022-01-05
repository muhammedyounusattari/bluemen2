import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AnnualPerformance, DefaultSetting, ReportSetting, SystemPreferencesEnum } from '../../../../constants/enums/system-preferences.enum';
import { SystemPreferencesService } from '../../../../services/admin/system-preferences.service';

@Component({
    selector: 'app-system-preferences',
    templateUrl: './system-preferences.component.html'
})

export class SystemPreferencesComponent implements OnInit {
    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    systemPreferencesEnum : SystemPreferencesEnum = new SystemPreferencesEnum();
    annualPerformance : AnnualPerformance = new AnnualPerformance();    
    defaultSetting: DefaultSetting = new DefaultSetting();
    reportSetting: ReportSetting = new ReportSetting();
    
    constructor(private modalService: BsModalService
        , private _systemPreferencesService: SystemPreferencesService) { 
     
        }

    ngOnInit(): void {
        const date = new FormControl(new Date());
        this.systemPreferencesEnum.annualPerformance = new AnnualPerformance();
        this.systemPreferencesEnum.defaultSetting = new DefaultSetting();
        this.systemPreferencesEnum.reportSetting = new ReportSetting();
        this.annualPerformance.reportingPeriodFrom = date;
        this.annualPerformance.reportingPeriodTo = date;
        this.annualPerformance.expDate = date;
        this.defaultSetting.fiscalYear = date;
        // serializedDate = new FormControl(new Date().toISOString());
        
        this._systemPreferencesService.getSystemPreferencesData().subscribe(result => {
            if (result) {
                this.bindDataToProperties(result[0]);
                this.bindDataToCustomObject(result[0]);
            }
        });
    }

    bindDataToProperties(obj : any) {
        this.systemPreferencesEnum.id = obj.id;
        this.systemPreferencesEnum.annualPerformance.id = obj?.annualPerformance?.id;
        this.systemPreferencesEnum.annualPerformance.address = obj?.annualPerformance?.address;
        this.systemPreferencesEnum.annualPerformance.city = obj?.annualPerformance?.city;
        this.systemPreferencesEnum.annualPerformance.expDate = obj?.annualPerformance?.expDate;
        this.systemPreferencesEnum.annualPerformance.ext = obj?.annualPerformance?.ext;
        this.systemPreferencesEnum.annualPerformance.fax = obj?.annualPerformance?.fax;
        this.systemPreferencesEnum.annualPerformance.fundToServeRatioThreshould = obj?.annualPerformance?.fundToServeRatioThreshould;
        this.systemPreferencesEnum.annualPerformance.fundToServeRatioThreshouldTo = obj?.annualPerformance?.fundToServeRatioThreshouldTo;
        this.systemPreferencesEnum.annualPerformance.fundedToServe = obj?.annualPerformance?.fundedToServe;
        this.systemPreferencesEnum.annualPerformance.institutionName = obj?.annualPerformance?.institutionName;
        this.systemPreferencesEnum.annualPerformance.ombApprNumb = obj?.annualPerformance?.ombApprNumb;
        this.systemPreferencesEnum.annualPerformance.phone1 = obj?.annualPerformance?.phone1;
        this.systemPreferencesEnum.annualPerformance.prAwardNumber = obj?.annualPerformance?.prAwardNumber;
        this.systemPreferencesEnum.annualPerformance.programType = obj?.annualPerformance?.programType;
        this.systemPreferencesEnum.annualPerformance.projectDirector = obj?.annualPerformance?.projectDirector;
        this.systemPreferencesEnum.annualPerformance.reportingPeriodFrom = obj?.annualPerformance?.reportingPeriodFrom;
        this.systemPreferencesEnum.annualPerformance.reportingPeriodTo = obj?.annualPerformance?.reportingPeriodTo;
        this.systemPreferencesEnum.annualPerformance.state = obj?.annualPerformance?.state;
        this.systemPreferencesEnum.annualPerformance.zipCode = obj?.annualPerformance?.zipCode;
        
        
        this.systemPreferencesEnum.defaultSetting.id = obj?.defaultSetting?.id;
        this.systemPreferencesEnum.defaultSetting.component = obj?.defaultSetting?.component;
        this.systemPreferencesEnum.defaultSetting.currentYear = obj?.defaultSetting?.currentYear;
        this.systemPreferencesEnum.defaultSetting.fiscalYear = obj?.defaultSetting?.fiscalYear;
        this.systemPreferencesEnum.defaultSetting.semester = obj?.defaultSetting?.semester;
        this.systemPreferencesEnum.defaultSetting.timeout = obj?.defaultSetting?.timeout;
        
        this.systemPreferencesEnum.reportSetting.id = obj?.reportSetting?.id;
        this.systemPreferencesEnum.reportSetting.reportTitle = obj?.reportSetting?.reportTitle;
        this.systemPreferencesEnum.reportSetting.reportTitle2 = obj?.reportSetting?.reportTitle2;
        this.systemPreferencesEnum.reportSetting.report_Footer = obj?.reportSetting?.report_Footer;
    }

    bindDataToCustomObject(obj: any) {
        this.annualPerformance.id = obj?.annualPerformance?.id;
        this.annualPerformance.address = obj?.annualPerformance?.address;
        this.annualPerformance.city = obj?.annualPerformance?.city;
        this.annualPerformance.expDate = obj?.annualPerformance?.expDate;
        this.annualPerformance.ext = obj?.annualPerformance?.ext;
        this.annualPerformance.fax = obj?.annualPerformance?.fax;
        this.annualPerformance.fundToServeRatioThreshould = obj?.annualPerformance?.fundToServeRatioThreshould;
        this.annualPerformance.fundToServeRatioThreshouldTo = obj?.annualPerformance?.fundToServeRatioThreshouldTo;
        this.annualPerformance.fundedToServe = obj?.annualPerformance?.fundedToServe;
        this.annualPerformance.institutionName = obj?.annualPerformance?.institutionName;
        this.annualPerformance.ombApprNumb = obj?.annualPerformance?.ombApprNumb;
        this.annualPerformance.phone1 = obj?.annualPerformance?.phone1;
        this.annualPerformance.prAwardNumber = obj?.annualPerformance?.prAwardNumber;
        this.annualPerformance.programType = obj?.annualPerformance?.programType;
        this.annualPerformance.projectDirector = obj?.annualPerformance?.projectDirector;
        this.annualPerformance.reportingPeriodFrom = obj?.annualPerformance?.reportingPeriodFrom;
        this.annualPerformance.reportingPeriodTo = obj?.annualPerformance?.reportingPeriodTo;
        this.annualPerformance.state = obj?.annualPerformance?.state;
        this.annualPerformance.zipCode = obj?.annualPerformance?.zipCode;
        
        
        this.defaultSetting.id = obj?.defaultSetting?.id;
        this.defaultSetting.component = obj?.defaultSetting?.component;
        this.defaultSetting.currentYear = obj?.defaultSetting?.currentYear;
        this.defaultSetting.fiscalYear = obj?.defaultSetting?.fiscalYear;
        this.defaultSetting.semester = obj?.defaultSetting?.semester;
        this.defaultSetting.timeout = obj?.defaultSetting?.timeout;
        
        this.reportSetting.id = obj?.reportSetting?.id;
        this.reportSetting.reportTitle = obj?.reportSetting?.reportTitle;
        this.reportSetting.reportTitle2 = obj?.reportSetting?.reportTitle2;
        this.reportSetting.report_Footer = obj?.reportSetting?.report_Footer;
    }
    addSystemPreferences() {
        this.systemPreferencesEnum.id = this.systemPreferencesEnum.id;
        this.systemPreferencesEnum.annualPerformance.id = this.annualPerformance?.id;
        this.systemPreferencesEnum.annualPerformance.address = this.annualPerformance?.address;
        this.systemPreferencesEnum.annualPerformance.city = this.annualPerformance?.city;
        this.systemPreferencesEnum.annualPerformance.expDate = this.annualPerformance?.expDate;
        this.systemPreferencesEnum.annualPerformance.ext = this.annualPerformance?.ext;
        this.systemPreferencesEnum.annualPerformance.fax = this.annualPerformance?.fax;
        this.systemPreferencesEnum.annualPerformance.fundToServeRatioThreshould = this.annualPerformance?.fundToServeRatioThreshould;
        this.systemPreferencesEnum.annualPerformance.fundToServeRatioThreshouldTo = this.annualPerformance?.fundToServeRatioThreshouldTo;
        this.systemPreferencesEnum.annualPerformance.fundedToServe = this.annualPerformance?.fundedToServe;
        this.systemPreferencesEnum.annualPerformance.institutionName = this.annualPerformance?.institutionName;
        this.systemPreferencesEnum.annualPerformance.ombApprNumb = this.annualPerformance?.ombApprNumb;
        this.systemPreferencesEnum.annualPerformance.phone1 = this.annualPerformance?.phone1;
        this.systemPreferencesEnum.annualPerformance.prAwardNumber = this.annualPerformance?.prAwardNumber;
        this.systemPreferencesEnum.annualPerformance.programType = this.annualPerformance?.programType;
        this.systemPreferencesEnum.annualPerformance.projectDirector = this.annualPerformance?.projectDirector;
        this.systemPreferencesEnum.annualPerformance.reportingPeriodFrom = this.annualPerformance?.reportingPeriodFrom;
        this.systemPreferencesEnum.annualPerformance.reportingPeriodTo = this.annualPerformance?.reportingPeriodTo;
        this.systemPreferencesEnum.annualPerformance.state = this.annualPerformance?.state;
        this.systemPreferencesEnum.annualPerformance.zipCode = this.annualPerformance?.zipCode;
        
        
        this.systemPreferencesEnum.defaultSetting.id = this.defaultSetting?.id;
        this.systemPreferencesEnum.defaultSetting.component = this.defaultSetting?.component;
        this.systemPreferencesEnum.defaultSetting.currentYear = this.defaultSetting?.currentYear;
        this.systemPreferencesEnum.defaultSetting.fiscalYear = this.defaultSetting?.fiscalYear;
        this.systemPreferencesEnum.defaultSetting.semester = this.defaultSetting?.semester;
        this.systemPreferencesEnum.defaultSetting.timeout = this.defaultSetting?.timeout;

        
        this.systemPreferencesEnum.reportSetting.id = this.reportSetting?.id;
        this.systemPreferencesEnum.reportSetting.reportTitle = this.reportSetting?.reportTitle;
        this.systemPreferencesEnum.reportSetting.reportTitle2 = this.reportSetting?.reportTitle2;
        this.systemPreferencesEnum.reportSetting.report_Footer = this.reportSetting?.report_Footer;

        this._systemPreferencesService.postSystemPreferences(this.systemPreferencesEnum).subscribe(result => {
            if (result) {
                this.bindDataToProperties(result[0]);
                window.location.assign('');
            }
        });
    }
    cancelClick() {
        window.location.assign('');
    }
    addNewDropdown() {
        this.openModal(this.addDropDownValueRef);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalConfigSM)
    }
}