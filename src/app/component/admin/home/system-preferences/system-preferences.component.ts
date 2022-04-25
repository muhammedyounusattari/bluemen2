import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AnnualPerformance, DefaultSetting, DefaultSettingTab, GeneralSettingTab, ReportSetting, SystemPreferencesEnum } from '../../../../constants/enums/system-preferences.enum';
import { SystemPreferencesService } from '../../../../services/admin/system-preferences.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-system-preferences',
    templateUrl: './system-preferences.component.html',
    styleUrls: ['./system-preferences.component.css']
})

export class SystemPreferencesComponent implements OnInit {
    //nz- zorro
    public systemPreferenceForm!: FormGroup;
    public staffAddressForm!: FormGroup;

    @ViewChild('addDropDownValue') addDropDownValueRef: TemplateRef<any>;
    isVisible: boolean = false;
    modalRef: BsModalRef;
    modalConfigSM = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-lg'
    }
    systemPreferencesEnum: SystemPreferencesEnum = new SystemPreferencesEnum();
    annualPerformance: AnnualPerformance = new AnnualPerformance();
    defaultSetting: DefaultSetting = new DefaultSetting();
    reportSetting: ReportSetting = new ReportSetting();
    defaultSettingTab: DefaultSettingTab = new DefaultSettingTab();
    semisterList: [{'name': ''}];
    componentsList: [{'name': ''}]
    constructor(private modalService: BsModalService
        , private _systemPreferencesService: SystemPreferencesService
        , private sharedService: SharedService,
        private fb: FormBuilder) {

    }

    ngOnInit(): void {
        this.sharedService.setPageTitle('System Preferences');
        const date = new FormControl(new Date());
        this.systemPreferencesEnum.generalSetting = new GeneralSettingTab();
        this.systemPreferencesEnum.defaultSetting = new DefaultSettingTab();
        this.systemPreferencesEnum.generalSetting.annualPerformance = new AnnualPerformance();
        this.systemPreferencesEnum.generalSetting.defaultSetting = new DefaultSetting();
        this.systemPreferencesEnum.generalSetting.reportSetting = new ReportSetting();

        this.bindDropDownValues();
        this._systemPreferencesService.getSystemPreferencesData().subscribe(result => {
            this.activeTab('generalTab');
            if (result && result.length > 0) {
                this.bindDataToProperties(result[0]);
                this.bindDataToCustomObject(result[0]);
            }
        });

        this.systemPreferenceForm = this.fb.group({
			formLayout: ['vertical'],
            fiscalYear: [null],
            currentYear: [null],
            semFall: [null],
            component: [null],
            timeout: [null],
            title1: [null],
            title2: [null],
            reportFooter: [null],
            projectDirector: [null],
            institutionName: [null],
            reportingPeriodFrom: [null],
            reportingPeriodTo: [null],
            address: [null],
            city: [null],
            state: [null],
            zipCode: [null],
            phone1: [null],
            ext: [null],
            fax: [null],
            prAwardNumber: [null],
            ombApprovalNumber: [null],
            programType: [null],
            expirationDate: [null],
            fundedToServe: [null],
            serveRatioThreshold: [null],
            rationThreshouldTo: [null],
            previousData: [null],
            studentActive: [null],
            studentServed: [null],
            studentReported: [null],
            addStudentToFiscalYear: [null],
            updateFirstDateOfService: [null],
            updateLastDateOfService: [null],
            gpaScale: [null],
            stateTest: [null],
            ageCalculator: [null],
            siteLocation: [null]
		});

    }

    bindDropDownValues() {
        this._systemPreferencesService.getPullDownList().subscribe((result: any) => {
            if (result) {
                if (result.filter((item: any) => item.code === 'SemesterType')
                    && result.filter((item: any) => item.code === 'SemesterType').length > 0) {
                    this._systemPreferencesService.getPullDownItems(result.filter((item: any) => item.code === 'SemesterType')[0].id)
                        .subscribe(data => {
                            if (data) {
                                this.semisterList = data;
                            }
                        });
                }
                if (result.filter((item: any) => item.code === 'ComponentType')
                && result.filter((item: any) => item.code === 'ComponentType').length > 0) {
                this._systemPreferencesService.getPullDownItems(result.filter((item: any) => item.code === 'ComponentType')[0].id)
                    .subscribe(data => {
                        if (data) {
                            this.componentsList = data;
                        }
                    });
            }
            }
        });
    }

    activeTab(tabName: string) {
        const element = window.document.getElementById(tabName);
        let activeTab = null;
        if (tabName === 'generalTab') {
            activeTab = window.document.getElementById('defaultTab');
            if (activeTab !== null) {
                activeTab.style.borderBottom = '';
            }
        } else if (tabName === 'defaultTab') {
            activeTab = window.document.getElementById('generalTab');
            if (activeTab !== null) {
                activeTab.style.borderBottom = '';
            }
        }
        if (element !== null) {
            element.style.borderBottom = "3px solid #1366A0";
        }
    }

    bindDataToProperties(obj: any) {
        this.systemPreferencesEnum.id = obj?.id;

        // General Setting Tab Values
        this.systemPreferencesEnum.generalSetting.annualPerformance.id = obj?.generalSetting.annualPerformance?.id;
        this.systemPreferencesEnum.generalSetting.annualPerformance.address = obj?.generalSetting.annualPerformance?.address;
        this.systemPreferencesEnum.generalSetting.annualPerformance.city = obj?.generalSetting.annualPerformance?.city;
        this.systemPreferencesEnum.generalSetting.annualPerformance.expDate = obj?.generalSetting.annualPerformance?.expDate;
        this.systemPreferencesEnum.generalSetting.annualPerformance.ext = obj?.generalSetting.annualPerformance?.ext;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fax = obj?.generalSetting.annualPerformance?.fax;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fundToServeRatioThreshould = obj?.generalSetting.annualPerformance?.fundToServeRatioThreshould;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fundToServeRatioThreshouldTo = obj?.generalSetting.annualPerformance?.fundToServeRatioThreshouldTo;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fundedToServe = obj?.generalSetting.annualPerformance?.fundedToServe;
        this.systemPreferencesEnum.generalSetting.annualPerformance.institutionName = obj?.generalSetting.annualPerformance?.institutionName;
        this.systemPreferencesEnum.generalSetting.annualPerformance.ombApprNumb = obj?.generalSetting.annualPerformance?.ombApprNumb;
        this.systemPreferencesEnum.generalSetting.annualPerformance.phone1 = obj?.generalSetting.annualPerformance?.phone1;
        this.systemPreferencesEnum.generalSetting.annualPerformance.prAwardNumber = obj?.generalSetting.annualPerformance?.prAwardNumber;
        this.systemPreferencesEnum.generalSetting.annualPerformance.programType = obj?.generalSetting.annualPerformance?.programType;
        this.systemPreferencesEnum.generalSetting.annualPerformance.projectDirector = obj?.generalSetting.annualPerformance?.projectDirector;
        this.systemPreferencesEnum.generalSetting.annualPerformance.reportingPeriodFrom = obj?.generalSetting.annualPerformance?.reportingPeriodFrom;
        this.systemPreferencesEnum.generalSetting.annualPerformance.reportingPeriodTo = obj?.generalSetting.annualPerformance?.reportingPeriodTo;
        this.systemPreferencesEnum.generalSetting.annualPerformance.state = obj?.generalSetting.annualPerformance?.state;
        this.systemPreferencesEnum.generalSetting.annualPerformance.zipCode = obj?.generalSetting.annualPerformance?.zipCode;


        this.systemPreferencesEnum.generalSetting.defaultSetting.id = obj?.generalSetting.defaultSetting?.id;
        this.systemPreferencesEnum.generalSetting.defaultSetting.component = obj?.generalSetting.defaultSetting?.component;
        this.systemPreferencesEnum.generalSetting.defaultSetting.currentYear = obj?.generalSetting.defaultSetting?.currentYear;
        this.systemPreferencesEnum.generalSetting.defaultSetting.fiscalYear = obj?.generalSetting.defaultSetting?.fiscalYear;
        this.systemPreferencesEnum.generalSetting.defaultSetting.semester = obj?.generalSetting.defaultSetting?.semester;
        this.systemPreferencesEnum.generalSetting.defaultSetting.timeout = obj?.generalSetting.defaultSetting?.timeout;

        this.systemPreferencesEnum.generalSetting.reportSetting.id = obj?.generalSetting.reportSetting?.id;
        this.systemPreferencesEnum.generalSetting.reportSetting.reportTitle = obj?.generalSetting.reportSetting?.reportTitle;
        this.systemPreferencesEnum.generalSetting.reportSetting.reportTitle2 = obj?.generalSetting.reportSetting?.reportTitle2;
        this.systemPreferencesEnum.generalSetting.reportSetting.report_Footer = obj?.generalSetting.reportSetting?.report_Footer;
        // General Setting Tab Values End

        // Default Setting Tab Values
        this.systemPreferencesEnum.defaultSetting.addStudentToFiscalYear = obj?.defaultSetting.addStudentToFiscalYear;
        this.systemPreferencesEnum.defaultSetting.id = obj?.defaultSetting.id;
        this.systemPreferencesEnum.defaultSetting.siteLocation = obj?.defaultSetting.siteLocation;
        this.systemPreferencesEnum.defaultSetting.stateTest = obj?.defaultSetting.stateTest;
        this.systemPreferencesEnum.defaultSetting.studentActive = obj?.defaultSetting.studentActive;
        this.systemPreferencesEnum.defaultSetting.studentReported = obj?.defaultSetting.studentReported;
        this.systemPreferencesEnum.defaultSetting.studentServed = obj?.defaultSetting.studentServed;
        this.systemPreferencesEnum.defaultSetting.updateFirstDateOfService = obj?.defaultSetting.updateFirstDateOfService;
        this.systemPreferencesEnum.defaultSetting.updateLastDateOfService = obj?.defaultSetting.updateLastDateOfService;
        this.systemPreferencesEnum.defaultSetting.ageCalculator = obj?.defaultSetting.ageCalculator;
        this.systemPreferencesEnum.defaultSetting.copyPreviousData = obj?.defaultSetting.copyPreviousData;
        this.systemPreferencesEnum.defaultSetting.gpaScale = obj?.defaultSetting.gpaScale;
        // Default Setting Tab Values End
    }

    bindDataToCustomObject(obj: any) {
        // General Setting Tab Values
        this.annualPerformance.id = obj?.generalSetting.annualPerformance?.id;
        this.annualPerformance.address = obj?.generalSetting.annualPerformance?.address;
        this.annualPerformance.city = obj?.generalSetting.annualPerformance?.city;
        this.annualPerformance.expDate = obj?.generalSetting.annualPerformance?.expDate;
        this.annualPerformance.ext = obj?.generalSetting.annualPerformance?.ext;
        this.annualPerformance.fax = obj?.generalSetting.annualPerformance?.fax;
        this.annualPerformance.fundToServeRatioThreshould = obj?.generalSetting.annualPerformance?.fundToServeRatioThreshould;
        this.annualPerformance.fundToServeRatioThreshouldTo = obj?.generalSetting.annualPerformance?.fundToServeRatioThreshouldTo;
        this.annualPerformance.fundedToServe = obj?.generalSetting.annualPerformance?.fundedToServe;
        this.annualPerformance.institutionName = obj?.generalSetting.annualPerformance?.institutionName;
        this.annualPerformance.ombApprNumb = obj?.generalSetting.annualPerformance?.ombApprNumb;
        this.annualPerformance.phone1 = obj?.generalSetting.annualPerformance?.phone1;
        this.annualPerformance.prAwardNumber = obj?.generalSetting.annualPerformance?.prAwardNumber;
        this.annualPerformance.programType = obj?.generalSetting.annualPerformance?.programType;
        this.annualPerformance.projectDirector = obj?.generalSetting.annualPerformance?.projectDirector;
        this.annualPerformance.reportingPeriodFrom = obj?.generalSetting.annualPerformance?.reportingPeriodFrom;
        this.annualPerformance.reportingPeriodTo = obj?.generalSetting.annualPerformance?.reportingPeriodTo;
        this.annualPerformance.state = obj?.generalSetting.annualPerformance?.state;
        this.annualPerformance.zipCode = obj?.generalSetting.annualPerformance?.zipCode;


        this.defaultSetting.id = obj?.generalSetting.defaultSetting?.id;
        this.defaultSetting.component = obj?.generalSetting.defaultSetting?.component;
        this.defaultSetting.currentYear = obj?.generalSetting.defaultSetting?.currentYear;
        this.defaultSetting.fiscalYear = obj?.generalSetting.defaultSetting?.fiscalYear;
        this.defaultSetting.semester = obj?.generalSetting.defaultSetting?.semester;
        this.defaultSetting.timeout = obj?.generalSetting.defaultSetting?.timeout;

        this.reportSetting.id = obj?.generalSetting.reportSetting?.id;
        this.reportSetting.reportTitle = obj?.generalSetting.reportSetting?.reportTitle;
        this.reportSetting.reportTitle2 = obj?.generalSetting.reportSetting?.reportTitle2;
        this.reportSetting.report_Footer = obj?.generalSetting.reportSetting?.report_Footer;
        // General Setting Tab Values End

        // Default Setting Tab Values
        this.defaultSettingTab.addStudentToFiscalYear = obj?.defaultSetting.addStudentToFiscalYear;
        this.defaultSettingTab.id = obj?.defaultSetting.id;
        this.defaultSettingTab.siteLocation = obj?.defaultSetting.siteLocation;
        this.defaultSettingTab.stateTest = obj?.defaultSetting.stateTest;
        this.defaultSettingTab.studentActive = obj?.defaultSetting.studentActive;
        this.defaultSettingTab.studentReported = obj?.defaultSetting.studentReported;
        this.defaultSettingTab.studentServed = obj?.defaultSetting.studentServed;
        this.defaultSettingTab.updateFirstDateOfService = obj?.defaultSetting.updateFirstDateOfService;
        this.defaultSettingTab.updateLastDateOfService = obj?.defaultSetting.updateLastDateOfService;
        this.defaultSettingTab.ageCalculator = obj?.defaultSetting.ageCalculator;
        this.defaultSettingTab.copyPreviousData = obj?.defaultSetting.copyPreviousData;
        this.defaultSettingTab.gpaScale = obj?.defaultSetting.gpaScale;
        // Default Setting Tab Values End
    }
    addSystemPreferences() {
        this.systemPreferencesEnum.id = this.systemPreferencesEnum.id;
        // General Setting Tab Values
        this.systemPreferencesEnum.generalSetting.annualPerformance.id = this.annualPerformance?.id;
        this.systemPreferencesEnum.generalSetting.annualPerformance.address = this.annualPerformance?.address;
        this.systemPreferencesEnum.generalSetting.annualPerformance.city = this.annualPerformance?.city;
        this.systemPreferencesEnum.generalSetting.annualPerformance.expDate = this.annualPerformance?.expDate;
        this.systemPreferencesEnum.generalSetting.annualPerformance.ext = this.annualPerformance?.ext;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fax = this.annualPerformance?.fax;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fundToServeRatioThreshould = this.annualPerformance?.fundToServeRatioThreshould;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fundToServeRatioThreshouldTo = this.annualPerformance?.fundToServeRatioThreshouldTo;
        this.systemPreferencesEnum.generalSetting.annualPerformance.fundedToServe = this.annualPerformance?.fundedToServe;
        this.systemPreferencesEnum.generalSetting.annualPerformance.institutionName = this.annualPerformance?.institutionName;
        this.systemPreferencesEnum.generalSetting.annualPerformance.ombApprNumb = this.annualPerformance?.ombApprNumb;
        this.systemPreferencesEnum.generalSetting.annualPerformance.phone1 = this.annualPerformance?.phone1;
        this.systemPreferencesEnum.generalSetting.annualPerformance.prAwardNumber = this.annualPerformance?.prAwardNumber;
        this.systemPreferencesEnum.generalSetting.annualPerformance.programType = this.annualPerformance?.programType;
        this.systemPreferencesEnum.generalSetting.annualPerformance.projectDirector = this.annualPerformance?.projectDirector;
        this.systemPreferencesEnum.generalSetting.annualPerformance.reportingPeriodFrom = this.annualPerformance?.reportingPeriodFrom;
        this.systemPreferencesEnum.generalSetting.annualPerformance.reportingPeriodTo = this.annualPerformance?.reportingPeriodTo;
        this.systemPreferencesEnum.generalSetting.annualPerformance.state = this.annualPerformance?.state;
        this.systemPreferencesEnum.generalSetting.annualPerformance.zipCode = this.annualPerformance?.zipCode;


        this.systemPreferencesEnum.generalSetting.defaultSetting.id = this.defaultSetting?.id;
        this.systemPreferencesEnum.generalSetting.defaultSetting.component = this.defaultSetting?.component;
        this.systemPreferencesEnum.generalSetting.defaultSetting.currentYear = this.defaultSetting?.currentYear;
        this.systemPreferencesEnum.generalSetting.defaultSetting.fiscalYear = this.defaultSetting?.fiscalYear;
        this.systemPreferencesEnum.generalSetting.defaultSetting.semester = this.defaultSetting?.semester;
        this.systemPreferencesEnum.generalSetting.defaultSetting.timeout = this.defaultSetting?.timeout;


        this.systemPreferencesEnum.generalSetting.reportSetting.id = this.reportSetting?.id;
        this.systemPreferencesEnum.generalSetting.reportSetting.reportTitle = this.reportSetting?.reportTitle;
        this.systemPreferencesEnum.generalSetting.reportSetting.reportTitle2 = this.reportSetting?.reportTitle2;
        this.systemPreferencesEnum.generalSetting.reportSetting.report_Footer = this.reportSetting?.report_Footer;
        // General Setting Tab Values End

        // Default Setting Tab Values
        this.systemPreferencesEnum.defaultSetting.addStudentToFiscalYear = this.defaultSettingTab.addStudentToFiscalYear;
        this.systemPreferencesEnum.defaultSetting.id = this.defaultSettingTab.id;
        this.systemPreferencesEnum.defaultSetting.siteLocation = this.defaultSettingTab.siteLocation;
        this.systemPreferencesEnum.defaultSetting.stateTest = this.defaultSettingTab.stateTest;
        this.systemPreferencesEnum.defaultSetting.studentActive = this.defaultSettingTab.studentActive;
        this.systemPreferencesEnum.defaultSetting.studentReported = this.defaultSettingTab.studentReported;
        this.systemPreferencesEnum.defaultSetting.studentServed = this.defaultSettingTab.studentServed;
        this.systemPreferencesEnum.defaultSetting.updateFirstDateOfService = this.defaultSettingTab.updateFirstDateOfService;
        this.systemPreferencesEnum.defaultSetting.updateLastDateOfService = this.defaultSettingTab.updateLastDateOfService;
        this.systemPreferencesEnum.defaultSetting.ageCalculator = this.defaultSettingTab.ageCalculator;
        this.systemPreferencesEnum.defaultSetting.copyPreviousData = this.defaultSettingTab.copyPreviousData;
        this.systemPreferencesEnum.defaultSetting.gpaScale = Number(this.defaultSettingTab.gpaScale);
        // Default Setting Tab Values End

        this._systemPreferencesService.postSystemPreferences(this.systemPreferencesEnum).subscribe(result => {
            if (result) {
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