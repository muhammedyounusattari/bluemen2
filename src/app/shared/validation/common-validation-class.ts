export class ValidationClass {
    // To check value is null or undefined
    isNullOrUndefined(fieldValue: any) {
        if (fieldValue === null || fieldValue === undefined) {
            return true;
        }
        return false;
    }

    // To check value is empty
    isEmpty(fieldValue: any) {
        if (fieldValue.trim() === '') {
            return true;
        }
        return false;
    }

    // To check value is of type numeric
    // isNumber(fieldValue: any) {
    // }

    // To check value is of type charectors only not number
    // isChar(fieldValue: any) {
    // }
}