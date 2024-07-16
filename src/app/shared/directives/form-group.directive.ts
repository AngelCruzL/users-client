import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective as NgFormGroupDirective,
} from '@angular/forms';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[form-group]',
  standalone: true,
})
export class FormGroupDirective implements OnInit, OnDestroy {
  #htmlElement = inject(ElementRef<HTMLDivElement>);
  #formGroupDirective = inject(NgFormGroupDirective);
  #unsubscribeAll$ = new Subject<void>();

  ngOnInit(): void {
    const inputElements = this.#htmlElement.nativeElement.querySelectorAll(
      'input[formControlName]',
    );
    inputElements.forEach((inputElement: HTMLInputElement) => {
      const formControlName = inputElement.getAttribute('formControlName');
      if (formControlName) {
        const control = this.#formGroupDirective.form.get(formControlName);
        if (control) {
          this.#subscribeToControl(control, inputElement);
          this.#markAsTouchedOnBlur(inputElement, control);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }

  #subscribeToControl(
    control: AbstractControl,
    inputElement: HTMLInputElement,
  ): void {
    control.statusChanges
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(() => {
        this.#setAriaInvalid(inputElement, control.invalid);
        const errorLabel = inputElement.nextElementSibling;
        if (control.invalid && errorLabel && errorLabel.tagName === 'SMALL') {
          const errors = control.errors;
          if (errors) {
            errorLabel.textContent = this.#getErrorMessage(errors);
          }
        } else if (errorLabel && errorLabel.tagName === 'SMALL') {
          errorLabel.textContent = '';
        }
      });
  }

  #markAsTouchedOnBlur(
    inputElement: HTMLInputElement,
    control: AbstractControl,
  ): void {
    fromEvent(inputElement, 'blur')
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(() => {
        control.markAsTouched();
        if (control.invalid) {
          const errorLabel = inputElement.nextElementSibling;
          if (errorLabel && errorLabel.tagName === 'SMALL') {
            const errors = control.errors;
            if (errors) {
              errorLabel.textContent = this.#getErrorMessage(errors);
            }
          }
        }
      });
  }

  #getErrorMessage(errors: any): string {
    const errorKeys = Object.keys(errors);
    if (errorKeys.includes('required')) {
      return 'Este campo es obligatorio.';
    }
    if (errorKeys.includes('emailPattern')) {
      return 'El correo electrónico no es válido.';
    }
    if (errorKeys.includes('passwordPattern')) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    }
    if (errorKeys.includes('passwordsMatch')) {
      return 'Las contraseñas no coinciden.';
    }
    if (errorKeys.includes('minlength')) {
      return 'Este campo debe tener al menos 6 caracteres.';
    }
    if (errorKeys.includes('maxlength')) {
      return 'Este campo debe tener como máximo 12 caracteres.';
    }
    return 'Error en el campo.';
  }

  #setAriaInvalid(element: HTMLInputElement, isInvalid: boolean): void {
    element.setAttribute('aria-invalid', String(isInvalid));
  }
}
