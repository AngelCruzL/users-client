import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidatorService {
  static passwordPattern: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';

  passwordPatternValidator(pattern: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      return !pattern.test(control.value)
        ? { passwordPattern: { value: control.value } }
        : null;
    };
  }

  passwordsMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const password = formGroup.get(controlName)?.value;
      const passwordConfirmation = formGroup.get(matchingControlName)?.value;

      if (password !== passwordConfirmation) {
        formGroup.get(matchingControlName)?.setErrors({ passwordsMatch: true });
        return { passwordsMatch: true };
      }

      formGroup.get(matchingControlName)?.setErrors(null);
      return null;
    };
  }
}
