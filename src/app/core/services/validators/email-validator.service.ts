import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService {
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  emailPatternValidator(pattern: RegExp): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      return !pattern.test(control.value)
        ? { emailPattern: { value: control.value } }
        : null;
    };
  }
}
