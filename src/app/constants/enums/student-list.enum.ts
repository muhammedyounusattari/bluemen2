export class StudentListEnum {
    active: string = '';
    contactDate: string = '';
    contactTime: string = '';
    firstName: string = '';
    fiscalYear: string = '';
    grade: string = '';
    gradeNotes: string = '';
    graduatedInformation: GraduatedInformationEnum = new GraduatedInformationEnum();
    lastName: string = '';
    orgId: string = '';
    phoneNumber: string = '';
    recontactDate: string = '';
    reported: string = '';
    school: string = '';
    served: string = '';
    ssno: number = 0;
    staff: string = '';
    standing: string = '';
}

export class GraduatedInformationEnum {
    addressNotes: AddressNotes = new AddressNotes();
    counselor: string = '';
    degreeIn: string = '';
    employer: string = '';
    employmentType: string = '';
    firstName: string = '';
    graduated: string = '';
    graduatedEducationStatus: string = '';
    graduatedYear: string = '';
    lastName: string = '';
    major: string = '';
    militaryType: string = '';
    phone1: string = '';
    ssno: number = 0;
    titleOrPosition: string = '';
    track: string = '';
}

export class AddressNotes {
    address: string = '';
    city: string = '';
    email: string = '';
    id: number = 0;
    notes: string = '';
    phone1: string = '';
    phone2: string = '';
    state: string = '';
    website: string = '';
    zipcode: string = '';
}