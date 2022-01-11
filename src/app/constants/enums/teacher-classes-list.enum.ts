import { StudentListEnum } from "./student-list.enum";

export class TeacherClassesListEnum {
    id: number = 0;
    classPeriod: string = '';
    currentYear: string = '';
    days: string = 'null';
    duration: string = '';
    maxLimit: string = '';
    meetingTime: string = 'null';
    notes: string = '';
    room: string = 'null';
    semester: string = 'null';
    studentAssigned: string = '';
    studentList: Array<StudentListEnum> = new Array<StudentListEnum>();
    subject: string = 'null';
    teacherName: string = 'null';
}