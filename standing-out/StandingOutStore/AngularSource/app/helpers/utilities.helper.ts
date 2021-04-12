import { FormGroup, AbstractControl } from "@angular/forms";

export class UtilitiesHelper {    
    checkValidDatePart(part: string, formSubmitted: Boolean, formInvalid: Boolean, formGroup: FormGroup, yearControl: string, monthControl: string, dayControl: string): Boolean {
        var valid: Boolean = null;

        if (formSubmitted === true) {

            if (part == 'year') {
                if (formGroup.value.dateOfBirthYear === undefined || formGroup.value.dateOfBirthYear == null || formGroup.value.dateOfBirthYear == '') {
                    valid = false;
                }
                else if (formGroup.value.dateOfBirthYear > new Date().getFullYear() ||
                    formGroup.value.dateOfBirthYear < new Date(new Date().getFullYear() - 120, new Date().getMonth(), new Date().getDate()).getFullYear() ||
                    formGroup.controls[yearControl].errors) {
                    valid = false;
                }
                else {
                    valid = true;
                }

            } else if (part == 'month') {
                console.log('EH?', formGroup.controls[monthControl].value);
                if ((formInvalid == true || formGroup.controls[monthControl].errors) && (formGroup.controls[monthControl].value <= 0 || formGroup.controls[monthControl].value > 12)) {
                    valid = false;
                } else {
                    valid = true;
                }

            } else {
                if (formGroup.value.dateOfBirthDay === undefined || formGroup.value.dateOfBirthDay == null || formGroup.value.dateOfBirthDay == '') {
                   valid = false;
                }
                else if ((formInvalid == true || formGroup.controls[dayControl].errors) &&
                    ((this.checkValidDatePart('year', formSubmitted, formInvalid, formGroup, yearControl, monthControl, dayControl) && this.checkValidDatePart('month', formSubmitted, formInvalid, formGroup, yearControl, monthControl, dayControl)) ||
                        formGroup.value.dateOfBirthDay > 31)) {
                    valid = false;
                } else {
                    valid = true;
                }
            }
        }

        return valid;
    };

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    lettersOnly(event): boolean {
        //this should allow spaces and hypens

        const charCode = (event.which) ? event.which : event.keyCode;

        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z- ]/.test(inp)) {
            return true;
        } else {
            return false;
        }
    };
}
