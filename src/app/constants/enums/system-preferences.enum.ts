export class SystemPreferencesEnum {
    id: number = 0;
    defaultSetting: DefaultSettingTab = new DefaultSettingTab();
    generalSetting: GeneralSettingTab = new GeneralSettingTab();
}

export class GeneralSettingTab {
    annualPerformance: AnnualPerformance = new AnnualPerformance();
    defaultSetting: DefaultSetting = new DefaultSetting();
    reportSetting: ReportSetting = new ReportSetting();
}

export class DefaultSettingTab {
    addStudentToFiscalYear: boolean = true;
    ageCalculator: string = '';
    copyPreviousData: boolean = true;
    gpaScale: number = 1;
    id: number = 0;
    siteLocation: string = '';
    stateTest: string = '';
    studentActive: boolean = true;
    studentReported: boolean = true;
    studentServed: boolean = true;
    updateFirstDateOfService: boolean = true;
    updateLastDateOfService: boolean = true;
}
export class AnnualPerformance {
    address: string = '';
    city: string = '';
    expDate: any;
    ext: string = '';
    fax: string = '';
    fundToServeRatioThreshould: string = '';
    fundToServeRatioThreshouldTo: string = '';
    fundedToServe: string = '';
    id: number = 0;
    institutionName: string = '';
    ombApprNumb: string = '';
    phone1: string = '';
    prAwardNumber: string = '';
    programType: string = 'SSS';
    projectDirector: string = '';
    reportingPeriodFrom: any;
    reportingPeriodTo: any;
    state: string = '';
    zipCode: string = '';
}
export class DefaultSetting {
    component: string = '';
    currentYear: any;
    fiscalYear: any;
    id: number = 0;
    semester: string = '';
    timeout: number = 0;
}
export class ReportSetting {
    id: number = 0;
    reportTitle: string = '';
    reportTitle2: string = '';
    report_Footer: string = '';
}