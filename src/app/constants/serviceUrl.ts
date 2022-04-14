import { environment } from '../../environments/environment';

export class ServiceUrls {

    //HOME
    public static GET_LOGGED_USERS = environment.apiUrl + '/blumen-api/logged-user/getLoggedUsers/v1';
    public static PUT_CHANGE_PASSWORD = environment.apiUrl + '/blumen-api/keycloak/tenant/';

    // ACTIVITY GROUP LIST API URL's
    public static FILTER_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/filter/activityGroupList/v1';
    public static GET_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/getActivityGroupList/v1';
    public static DELETE_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/deleteActivityGroupList/v1';
    public static UPDATE_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/updateActivityGroupList/v1';
    public static POST_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/activityGroupList/v1';
    public static GET_ACTIVITY_GROUP_MAX_ID = environment.apiUrl + '/blumen-api/customize/getMaxActivityGroupId/v1';
    public static GET_ACTIVITY_GROUP_DELETED_ITEM = environment.apiUrl + '/blumen-api/customize/getDeletedItemByOrgId/v1';

    // ACTIVITY SERVICE LIST API URL's
    public static FILTER_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/filter/activityList/v1';
    public static GET_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/getActivityList/v1';
    public static DELETE_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/deleteActivityList/v1';
    public static UPDATE_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/updateActivityList/v1';
    public static POST_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/activityList/v1';
    public static GET_ACTIVITY_SERVICE_MAX_ID = environment.apiUrl + '/blumen-api/customize/getMaxActivityId/v1';

    // COLLEGE API URL's
    public static FILTER_COLLEGE_SCHOOL_LIST = environment.apiUrl + '/blumen-api/customize/filter/collegeSchoolNamelist/v1';
    public static GET_COLLEGE_SCHOOL_LIST = environment.apiUrl + '/blumen-api/customize/getCollegeSchoolNameList/v1';
    public static DELETE_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/deleteCollegeSchoolNameList/v1';
    public static UPDATE_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/updateCollegeSchoolNameList/v1';
    public static POST_COLLEGE_NAME = environment.apiUrl + '/blumen-api/customize/addCollegeNameList/v1';
    public static POST_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/addSchoolNameList/v1'
    public static SEARCH_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/collegeSchoolName/search//v1/{name}/{value}';
    public static GET_COLLEGE_SCHOOL_MOVED_LIST = environment.apiUrl + '/blumen-api/customize/getCollegeSchoolMovedList/v1';
    public static UPDATE_COLLEGE_SCHOOL_DELETED_LIST = environment.apiUrl + '/blumen-api/customize/updateCollegeSchoolDeletedList/v1';
    public static GET_COLLEGE_LIST = environment.apiUrl + '/blumen-api/customize/getCollegeNameList/v1';
    public static GET_SCHOOL_LIST = environment.apiUrl + '/blumen-api/customize/getSchoolNameList/v1';


    // Grade Group API URL's
    public static FILTER_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/filter/gradingGroupList/v1';
    public static GET_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/getGradingGroupList/v1';
    public static DELETE_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/deleteGradingGroupList/v1';
    public static UPDATE_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingGroupList/v1';
    public static POST_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/gradingGroupList/v1';
    public static GET_GRADING_GROUP_MAX_ID = environment.apiUrl + '/blumen-api/customize/getMaxGradingGroupId/v1';
    public static GET_GRADING_GROUP_MOVED_LIST = environment.apiUrl + '/blumen-api/customize/getGradingGroupMovedList/v1';
    public static UPDATE_GRADING_GROUP_DELETED_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingGroupDeletedList/v1';


    // Grade Standing API URL's
    public static FILTER_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/filter/gradingList/v1';
    public static GET_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/getGradingList/v1';
    public static DELETE_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/deleteGradingList/v1';
    public static UPDATE_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingList/v1';
    public static POST_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/gradingList/v1';
    public static GET_GRADING_STANDING_MAX_ID = environment.apiUrl + '/blumen-api/customize/getMaxGradingListId/v1';
    public static GET_GRADING_STANDING_MOVED_LIST = environment.apiUrl + '/blumen-api/customize/getGradingStandingMovedList/v1';
    public static UPDATE_GRADING_STANDING_DELETED_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingStandingDeletedList/v1';
    public static POST_GRADING_STANDING_NAME_AND_GROUP_NAME = environment.apiUrl + '/blumen-api/customize/getGradingByGradingNameAndGradingGroupName/v1';



    // Custom Field API URL's
    public static GET_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/getCustomFieldsNameType/v1';
    public static UPDATE_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/updateCustomFieldsNameType/v1';
    public static ADD_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/customFieldsNameType/v1';
    public static DELETE_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/deleteCustomFieldsNameTypeList/v1';
    public static FILTER_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/filter/customFieldsNameType/v1';

    // Pull Down List API URL's
    public static GET_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/getPullDownList/v1';
    public static UPDATE_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/updatePullDownList/v1';
    public static UPDATE_PULL_DOWN_ITEM = environment.apiUrl + '/blumen-api/customize/updatePullDownItem/v1';
    public static ADD_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/pullDownItems/v1';
    public static ADD_NON_NUMERIC_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/nonNumericPullDownItems/v1';
    public static DELETE_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/deletePullDownList/v1';
    public static FILTER_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/filter/filterPullDownList/v1';
    public static GET_PULL_DOWN_ITEMS = environment.apiUrl + '/blumen-api/customize/pullDownItems/v1/';
    public static GET_PULL_DOWN_ITEM = environment.apiUrl + '/blumen-api/customize/pullDownList/v1/';
    public static GET_PULL_DOWN_ID_VALIDATE = environment.apiUrl + '/blumen-api/customize/getPulldownValidate/v1';
    public static GET_MULTIPLE_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/multiplePulldownList/code';


    // Counselors API URL's
    public static GET_COUNSELORS = environment.apiUrl + '/blumen-api/counselor/getCounselorList/v1';
    public static UPDATE_COUNSELORS_LIST = environment.apiUrl + '/blumen-api/counselor/updateCounselorList/v1';
    public static ADD_COUNSELORS = environment.apiUrl + '/blumen-api/counselor/counselorList/v1';
    public static DELETE_COUNSELORS = environment.apiUrl + '/blumen-api/counselor/deleteCounselorList/v1';
    public static FILTER_COUNSELORS = environment.apiUrl + '/blumen-api/counselor/filter/counselorList/v1';

    // Time Clock Manager API URL's
    public static GET_TIME_CLOCK_MANAGER = environment.apiUrl + '/blumen-api/admin/systemtools/getTimeClockManagerList/v1';
    public static UPDATE_TIME_CLOCK_MANAGER_LIST = environment.apiUrl + '/blumen-api/admin/systemtools/updateTimeClockManagerList/v1';
    public static ADD_TIME_CLOCK_MANAGER = environment.apiUrl + '/blumen-api/admin/systemtools/timeClockManagerList/v1';
    public static DELETE_TIME_CLOCK_MANAGER = environment.apiUrl + '/blumen-api/admin/systemtools/deleteTimeClockManagerList/v1';
    public static FILTER_TIME_CLOCK_MANAGER = environment.apiUrl + '/blumen-api/admin/systemtools/filter/timeClockManagerlist/v1';

    // Staff Members API URL's
    public static GET_STAFF_MEMBERS = environment.apiUrl + '/blumen-api/staff/getStaffList/v1';
    public static UPDATE_STAFF_MEMBERS = environment.apiUrl + '/blumen-api/staff/updateStaffList/v1';
    public static ADD_STAFF_MEMBERS = environment.apiUrl + '/blumen-api/staff/staffList/v1';
    public static DELETE_STAFF_MEMBERS = environment.apiUrl + '/blumen-api/staff/deleteStaffList/v1';
    public static FILTER_STAFF_MEMBERS = environment.apiUrl + '/blumen-api/staff/filter/staffList/v1';

    // Config setting API URL's
    public static GET_CONFIG_SETTINGS = environment.apiUrl + '/blumen-api/admin/getConfigSettingList/v1';
    public static POST_CONFIG_SETTINGS = environment.apiUrl + '/blumen-api/admin/postConfigSettingList/v1';

    // LAB SETTINGS PREFERENCES
    public static POST_LAB_SETTINGS_PREFERENCES = environment.apiUrl + '/blumen-api/customize/labSettingPreferences/v1';
    public static GET_LAB_SETTINGS_PREFERENCES = environment.apiUrl + '/blumen-api/customize/getLabSettingPreferences/v1';

    // Recall Students API URL's
    public static GET_RECALL_STUDENTS_LIST = environment.apiUrl + '/blumen-api/admin/systemtools/recallStudentList/v1';

    // Teacher
    public static GET_TEACHER_LIST = environment.apiUrl + '/blumen-api/teacher/getTeacherList/v1';
    public static POST_TEACHER = environment.apiUrl + '/blumen-api/teacher/teacherList/v1';
    public static DELETE_TEACHER = environment.apiUrl + '/blumen-api/teacher/deleteTeacherList/v1';

    // Tutors
    public static GET_TUTORS_LIST = environment.apiUrl + '/blumen-api/tutor/getTutorList/v1';
    public static POST_TUTORS = environment.apiUrl + '/blumen-api/tutor/tutorList/v1';
    public static DELETE_TUTORS = environment.apiUrl + '/blumen-api/tutor/deleteTutorList/v1';

    // Get Student's
    public static GET_STUDENTS_LIST = environment.apiUrl + '/blumen-api/student/getStudents/v1';
    public static ADD_STUDENTS_LIST = environment.apiUrl + '/blumen-api/student/addStudents/v1';
    public static UPDATE_STUDENTS_LIST = environment.apiUrl + '/blumen-api/student/student/v1';
    public static DELETE_STUDENTS_LIST = environment.apiUrl + '/blumen-api/student/deleteStudents/v1';

    // Tutor Contacts API URL's
    public static GET_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentTutorContactsList/v1';
    public static GET_TUTOR_CONTACTS_REMINDER = environment.apiUrl + '/blumen-api/student-contacts/getStudentDispTutorContReminderList/v1';
    public static DELETE_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/deleteStudentTutorContactsList/v1';
    public static ADD_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/studentTutorContactsList/v1';
    public static UPDATE_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/updateStudentTutorContactsList/v1';

    // Teacher Contacts API URL's
    public static GET_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentTeacherContactsList/v1';
    public static GET_TEACHER_CONTACTS_REMINDER = environment.apiUrl + '/blumen-api/student-contacts/getStudentDispTeacherContRemiList/v1';
    public static DELETE_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/deleteStudentTeacherContactsList/v1';
    public static ADD_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/studentTeacherContactsList/v1';
    public static UPDATE_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/updateStudentTeacherContactsList/v1';

    // Staff Contacts API URL's
    public static GET_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentStaffContactsList/v1';
    public static GET_STAFF_CONTACTS_REMINDER = environment.apiUrl + '/blumen-api/student-contacts/getStudentDispCouContReminList/v1';
    public static DELETE_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentDispStaffContReminderList/v1';
    public static ADD_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/studentStaffContactsList/v1';
    public static UPDATE_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/updateStudentStaffContactsList/v1';

    // Counselor Contacts API URL's
    public static GET_COUNSELOR_CONTACTS = environment.apiUrl + '/blumen-api/admin/getCounselorContactsList/v1';
    public static GET_COUNSELOR_CONTACTS_REMINDER = environment.apiUrl + '/blumen-api/student-contacts/getStudentDispCouContReminList/v1';
    public static DELETE_COUNSELOR_CONTACTS = environment.apiUrl + '/blumen-api/admin/deleteStudentCounselorContactList/v1';
    public static ADD_COUNSELOR_CONTACTS = environment.apiUrl + '/blumen-api/admin/addStudentCounselorContactList/v1';
    public static UPDATE_COUNSELOR_CONTACTS = environment.apiUrl + '/blumen-api/admin/updateStudentCounselorContactList/v1';

    // SYSTEM PREFERENCES
    public static POST_SYSTEM_PREFERENCES = environment.apiUrl + '/blumen-api/admin/postSystemPreferenceData/v1';
    public static GET_SYSTEM_PREFERENCES = environment.apiUrl + '/blumen-api/admin/getSystemPreferenceData/v1';

    // Lab Contacts API URL's
    public static GET_LAB_CONTACTS = environment.apiUrl + '/blumen-api/admin/getLabContacts/v1';
    public static DELETE_LAB_CONTACTS = environment.apiUrl + '/blumen-api/admin/deleteLabContact/v1';
    public static ADD_LAB_CONTACTS = environment.apiUrl + '/blumen-api/admin/addStudentLabContactList/v1';
    public static UPDATE_LAB_CONTACTS = environment.apiUrl + '/blumen-api/admin/updateStudentLabContactList/v1';

    // TEACHER CLASSES URL's
    public static GET_TEACHER_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/getTeacherClassess/v1';
    public static ADD_TEACHER_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/addToTeacherClassesList/v1';
    public static UPDATE_TEACHER_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/updateTeacherClasses/v1';
    public static DELETE_TEACHER_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/deleteTeacherClasses/v1';
    public static FILTER_TEACHER_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/filterTeacherClasses/v1';

    // COUNSELOR CLASSES URL's
    public static GET_COUNSELOR_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/getCounselorClassess/v1';
    public static ADD_COUNSELOR_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/counselorClassesList/v1';
    public static UPDATE_COUNSELOR_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/updateCounselorClasses/v1';
    public static DELETE_COUNSELOR_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/deleteCounselorClasses/v1';
    public static FILTER_COUNSELOR_CLASSES_LIST = environment.apiUrl + '/blumen-api/admin/classes/filterCounselorClasses/v1';

    // Tutor Classes API URL's
    public static POST_TUTOR_CLASSES = environment.apiUrl + '/blumen-api/admin/classes/addToTutorClassesList/v1';
    public static GET_TUTOR_CLASSES = environment.apiUrl + '/blumen-api/admin/classes/getTutorClassess/v1';
    public static GET_TUTOR_CLASSES_PER_RECORD = environment.apiUrl + '/blumen-api/admin/classes/getTutorClass/v1/';
    public static DELETE_TUTOR_CLASSES = environment.apiUrl + '/blumen-api/admin/classes/deleteTutorClasses/v1';

    // STAFF CLASSES API URL'S
    public static POST_STAFF_CLASSES = environment.apiUrl + '/blumen-api/admin/classes/addToStaffClassesList/v1';
    public static GET_STAFF_CLASSES = environment.apiUrl + '/blumen-api/admin/classes/getStaffClasses/v1';
    public static GET_STAFF_CLASSES_PER_RECORD = environment.apiUrl + '/blumen-api/admin/classes/getStaffClass/v1/';
    public static DELETE_STAFF_CLASSES = environment.apiUrl + '/blumen-api/admin/classes/deleteStaffClasses/v1';

    // Student Attendance Log
    public static GET_STUDENT_ATTENDANCE_LOG = environment.apiUrl + '/blumen-api/utilities/generate-similar/attendance/log/v1';
    public static ADD_STUDENT_ATTENDANCE_LOG = environment.apiUrl + '/blumen-api/utilities/generate-similar/attendance/log/v1';
    public static UPDATE_STUDENT_ATTENDANCE_LOG = environment.apiUrl + '/blumen-api/utilities/generate-similar/attendance/log/v1';
    public static DELETE_STUDENT_ATTENDANCE_LOG = environment.apiUrl + '/blumen-api/utilities/generate-similar/attendance/log/v1';

    // Time Clock API URL's
    public static GET_TIME_CLOCK = environment.apiUrl + '/blumen-api/getStaffTimeById/v1';
    public static ADD_TIME_CLOCK = environment.apiUrl + '/blumen-api/postStaffTime/v1';
    public static UPDATE_TIME_CLOCK = environment.apiUrl + '/blumen-api/admin/systemtools/updateTimeClockManagerList/v1';

    // Student Exam Log API URL's
    public static GET_STUDENT_EXAM_LOG = environment.apiUrl + '/blumen-api/student-logs/getStudentExamsLogList/v1';
    public static ADD_STUDENT_EXAM_LOG = environment.apiUrl + '/blumen-api/student-logs/studentExamsLogList/v1';
    public static UPDATE_STUDENT_EXAM_LOG = environment.apiUrl + '/blumen-api/student-logs/updateStudentExamsLogList/v1';
    public static DELETE_STUDENT_EXAM_LOG = environment.apiUrl + '/blumen-api/student-logs/deleteStudentExamsLogList/v1';

    // Student Notes Log API URL's
    public static GET_STUDENT_NOTES_LOG = environment.apiUrl + '/blumen-api/student-logs/getStudentNotesLogList/v1';
    public static ADD_STUDENT_NOTES_LOG = environment.apiUrl + '/blumen-api/student-logs/studentNotesLogList/v1';
    public static UPDATE_STUDENT_NOTES_LOG = environment.apiUrl + '/blumen-api/student-logs/updateStudentNotesLogList/v1';
    public static DELETE_STUDENT_NOTES_LOG = environment.apiUrl + '/blumen-api/student-logs/deleteStudentNotesLogList/v1';

    // Custom Field Value API URL's
    public static GET_CUSTOM_FIELD_VALUE_LIST = environment.apiUrl + '/blumen-api/utilities/generate-similar/getCustomFieldValueList/v1';
    public static GET_CONTINUE_CUSTOM_FIELD_VALUE_LIST = environment.apiUrl + '/blumen-api/utilities/generate-similar/getOkToContinueCustomFieldValueList/v1';
    public static ADD_CUSTOM_FIELD_VALUE = environment.apiUrl + '/blumen-api/utilities/generate-similar/addCustomField/v1';
    public static ADD_FINISH_CUSTOM_FIELD_VALUE = environment.apiUrl + '/blumen-api/utilities/generate-similar/clickFinishCustomFieldValueList/v1';
    public static DELETE_CUSTOM_FIELD_VALUE = environment.apiUrl + '/blumen-api/utilities/generate-similar/deleteCustomField/v1';

    // Utilities Fiscal Year API URL's
    public static GET_STUDENTS_BY_FISCAL_YEAR = environment.apiUrl + '/blumen-api/utilities/addto/getAllStudentsByFiscalYear/v1';
    public static UPDATE_FISCAL_YEAR = environment.apiUrl + '/blumen-api/utilities/addto/moveSelectedStudentListToFiscalYear/v1';

    // Utilities Graduated Year API URL's
    public static GET_STUDENTS_BY_GRADUATED_YEAR = environment.apiUrl + '/blumen-api/utilities/addto/getAllStudentsByFiscalYearForGraduatedList/v1';
    public static UPDATE_GRADUATED_YEAR = environment.apiUrl + '/blumen-api/utilities/addto/moveSelectedStudentListFromFiscalYearToGraduatedYear/v1';
    public static UPDATE_GRADUATION_INFORMATION = environment.apiUrl + '/blumen-api/utilities/addto/updateGraduatedEntryForStudent/v1';
    // public static GET_PULL_DOWN_LIST_BASED_ON_TYPE = environment.apiUrl + '/blumen-api/customize/pulldownlist/code/';
    public static GET_PULL_DOWN_LIST_BASED_ON_CODE = environment.apiUrl + '/blumen-api/customize/pulldownlist/code/';
    // PULL DOWN STATE
    public static GET_PULLDOWN_STATE = environment.apiUrl + '/blumen-api/customize/pulldownlist/code/142';
    // PULL DOWN CITY
    public static GET_PULLDOWN_CITY = environment.apiUrl + '/blumen-api/customize/pulldownlist/code/39';

    public static GET_USER_LIST = environment.apiUrl + '/blumen-api/keycloak/tenant/';


    public static RECOVER_DELETED_ACTIVITY_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/recoverDeletedActivityGroupById/v1';
    public static GET_DELETED_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/getDeletedGroupById/v1/';
    public static UPDATE_ACTIVITY_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/updateActivityGroupById/v1';
    public static MERGE_ACTIVITY_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/mergeActivityGroupById/v1';
    public static GET_ACTIVITY_GROUP_NAME_AND_TYPE_AND_TYPE_NAME = environment.apiUrl + '/blumen-api/customize/getActivityGroupByActivityGroupNameAndActivityGroupType/v1';

    public static RECOVER_DELETED_ACTIVITY_BY_ID = environment.apiUrl + '/blumen-api/customize/recoverDeletedActivityById/v1';
    public static GET_DELETED_ACTIVITY_BY_ID = environment.apiUrl + '/blumen-api/customize/getDeletedActivityById/v1/';
    public static UPDATE_ACTIVITY_BY_ID = environment.apiUrl + '/blumen-api/customize/updateActivityById/v1';
    public static MERGE_ACTIVITY_BY_ID = environment.apiUrl + '/blumen-api/customize/mergeActivityById/v1';
    public static GET_ACTIVITY_BY_ACTIVITY_NAME_AND_GROUP_NAME = environment.apiUrl + '/blumen-api/customize/getActivityByActivityNameAndActivityGroupName/v1';

    public static RECOVER_DELETED_GRADE_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/recoverDeletedGradingGroupById/v1';
    public static GET_DELETED_GRADE_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/getDeletedGradingGroupById/v1/';
    public static UPDATE_GRADE_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/updateGradingGroupById/v1';
    public static MERGE_GRADE_GROUP_BY_ID = environment.apiUrl + '/blumen-api/customize/mergeGradingGroupById/v1';
    public static GET_GRADING_GROUP_BY_NAME_AND_GROUP_TYPE = environment.apiUrl + '/blumen-api/customize/getGradingGroupByGradingGroupNameAndGradingGroupType/v1';


    public static RECOVER_DELETED_GRADING_BY_ID = environment.apiUrl + '/blumen-api/customize/recoverDeletedGradingById/v1';
    public static GET_DELETED_GRADING_BY_ID = environment.apiUrl + '/blumen-api/customize/getDeletedGradingById/v1/';
    public static UPDATE_GRADING_BY_ID = environment.apiUrl + '/blumen-api/customize/updateGradingById/v1';
    public static MERGE_GRADING_BY_ID = environment.apiUrl + '/blumen-api/customize/mergeGradingById/v1';

    public static RECOVER_DELETED_COLLEGE_SCHOOL = environment.apiUrl + '/blumen-api/customize/recoverDeletedCollegeSchool/v1';
    public static GET_DELETED_COLLEGE_SCHOOL_BY_NAME = environment.apiUrl + '/blumen-api/customize/getDeletedCollegeSchoolByName/v1/';
    public static UPDATE_COLLEGE_SCHOOL_NAME_BY_ID = environment.apiUrl + '/blumen-api/customize/updateCollegeSchoolNameById/v1';
    public static MERGE_COLLEGE_SCHOOL_By_NAME = environment.apiUrl + '/blumen-api/customize/mergeCollegeSchoolByName/v1';
    public static GET_COLLEGE_SCHOOL_BY_NAME = environment.apiUrl + '/blumen-api/customize/getCollegeSchoolByName/v1/';
    public static GET_COLLEGE_SCHOOL_BY_CODE = environment.apiUrl + '/blumen-api/customize/getCollegeSchoolByCode/v1/';
    public static GET_DELETED_COLLEGE_SCHOOL_BY_NAME_AND_ORG_ID = environment.apiUrl + '/blumen-api/customize/getDeletedCollegeSchoolByNameAndOrgId/v1/';

    public static GET_ORG_USERS = environment.apiUrl+'/blumen-api/admin/home/getOrganizationList/v1';
    public static RESET_PASSWORD = environment.apiUrl+'/blumen-api/resetPassword/v1/';
    public static UPDATE_PASSWORD = environment.apiUrl+'/blumen-api/updatePassword/v1/';
}


}
