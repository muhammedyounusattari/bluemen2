export class SystemPreferencesEnum {
    id: number = 0;
    annualPerformance: AnnualPerformance = new AnnualPerformance();
    defaultSetting: DefaultSetting = new DefaultSetting();
    reportSetting: ReportSetting = new ReportSetting();

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
    programType: string = '';
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
}
export class ReportSetting {
    id: number = 0;
    reportTitle: string = '';
    reportTitle2: string = '';
    report_Footer: string = '';
}