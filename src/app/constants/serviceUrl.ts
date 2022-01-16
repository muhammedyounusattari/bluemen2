import { environment } from '../../environments/environment';

export class ServiceUrls {
    // ACTIVITY GROUP LIST API URL's
    public static FILTER_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/filter/activityGroupList/v1';
    public static GET_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/getActivityGroupList/v1';
    public static DELETE_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/deleteActivityGroupList/v1';
    public static UPDATE_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/updateActivityGroupList/v1';
    public static POST_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/activityGroupList/v1';
    public static GET_ACTIVITY_GROUP_MAX_ID = environment.apiUrl + '/blumen-api/customize/getMaxActivityGroupId/v1';

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

    // Grade Group API URL's
    public static FILTER_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/filter/gradingGroupList/v1';
    public static GET_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/getGradingGroupList/v1';
    public static DELETE_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/deleteGradingGroupList/v1';
    public static UPDATE_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingGroupList/v1';
    public static POST_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/gradingGroupList/v1';
    public static GET_GRADING_GROUP_MAX_ID = environment.apiUrl + '/blumen-api/customize/getGradingGroupListId/v1';

    // Grade Standing API URL's
    public static FILTER_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/filter/gradingList/v1';
    public static GET_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/getGradingList/v1';
    public static DELETE_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/deleteGradingList/v1';
    public static UPDATE_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingList/v1';
    public static POST_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/gradingList/v1';
    public static GET_GRADING_STANDING_MAX_ID = environment.apiUrl + '/blumen-api/customize/getMaxGradingListId/v1';

    // Custom Field API URL's
    public static GET_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/getCustomFieldsNameType/v1';
    public static UPDATE_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/updateCustomFieldsNameType/v1';
    public static ADD_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/customFieldsNameType/v1';
    public static DELETE_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/deleteCustomFieldsNameTypeList/v1';
    public static FILTER_CUSTOM_FIELD_NAME_TYPE = environment.apiUrl + '/blumen-api/customize/filter/customFieldsNameType/v1';

    // Pull Down List API URL's
    public static GET_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/getPullDownList/v1';
    public static UPDATE_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/updatePullDownList/v1';
    public static ADD_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/pullDownList/v1';
    public static DELETE_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/deletePullDownList/v1';
    public static FILTER_PULL_DOWN_LIST = environment.apiUrl + '/blumen-api/customize/filter/filterPullDownList/v1';

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

    // Tutor Contacts API URL's
    public static GET_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentTutorContactsList/v1';
    public static DELETE_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/deleteStudentTutorContactsList/v1';
    public static ADD_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/studentTutorContactsList/v1';
    public static UPDATE_TUTOR_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/updateStudentTutorContactsList/v1';

    // Teacher Contacts API URL's
    public static GET_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentTeacherContactsList/v1';
    public static DELETE_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/deleteStudentTeacherContactsList/v1';
    public static ADD_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/studentTeacherContactsList/v1';
    public static UPDATE_TEACHER_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/updateStudentTeacherContactsList/v1';

    // Staff Contacts API URL's
    public static GET_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/getStudentStaffContactsList/v1';
    public static DELETE_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/deleteStudentStaffContactsList/v1';
    public static ADD_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/studentStaffContactsList/v1';
    public static UPDATE_STAFF_CONTACTS = environment.apiUrl + '/blumen-api/student-contacts/updateStudentStaffContactsList/v1';

    // Staff Contacts API URL's
    public static GET_COUNSELOR_CONTACTS = environment.apiUrl + '/blumen-api/admin/getCounselorContactsList/v1';
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

}
