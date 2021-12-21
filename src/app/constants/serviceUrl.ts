import { environment } from '../../environments/environment';

export class ServiceUrls {
    // ACTIVITY GROUP LIST API URL's
    public static FILTER_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/filter/activityGroupList/v1';
    public static GET_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/getActivityGroupList/v1';
    public static DELETE_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/deleteActivityGroupList/v1';
    public static UPDATE_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/updateActivityGroupList/v1';
    public static POST_ACTIVITY_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/activityGroupList/v1';

    // ACTIVITY SERVICE LIST API URL's
    public static FILTER_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/filter/activityList/v1';
    public static GET_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/getActivityList/v1';
    public static DELETE_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/deleteActivityList/v1';
    public static UPDATE_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/updateActivityList/v1';
    public static POST_ACTIVITY_SERVICE_LIST = environment.apiUrl + '/blumen-api/customize/activityList/v1';

    // COLLEGE API URL's
    public static FILTER_COLLEGE_SCHOOL_LIST = environment.apiUrl + '/blumen-api/customize/filter/collegeSchoolNamelist/v1';
    public static GET_COLLEGE_SCHOOL_LIST = environment.apiUrl + '/blumen-api/customize/getCollegeSchoolNameList/v1';
    public static DELETE_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/deleteCollegeSchoolNameList/v1';
    public static UPDATE_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/updateCollegeSchoolNameList/v1';
    public static POST_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/collegeSchoolNameList/v1';
    public static SEARCH_COLLEGE_SCHOOL_NAME = environment.apiUrl + '/blumen-api/customize/collegeSchoolName/search//v1/{name}/{value}';

    // Grade Group API URL's
    public static FILTER_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/filter/gradingGroupList/v1';
    public static GET_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/getGradingGroupList/v1';
    public static DELETE_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/deleteGradingGroupList/v1';
    public static UPDATE_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingGroupList/v1';
    public static POST_GRADING_GROUP_LIST = environment.apiUrl + '/blumen-api/customize/gradingGroupList/v1';

    // Grade Standing API URL's
    public static FILTER_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/filter/gradingList/v1';
    public static GET_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/getGradingList/v1';
    public static DELETE_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/deleteGradingList/v1';
    public static UPDATE_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/updateGradingList/v1';
    public static POST_GRADING_STANDING_LIST = environment.apiUrl + '/blumen-api/customize/gradingList/v1';
}