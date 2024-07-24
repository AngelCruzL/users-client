import { FormControl } from '@angular/forms';

export type CreateUserForm = Omit<UpdateUserForm, 'id'> & {
  password: FormControl<string>;
  passwordConfirmation: FormControl<string>;
};

export interface UpdateUserForm {
  id: FormControl<number>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
}

export interface UpdatePasswordForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  passwordConfirmation: FormControl<string>;
}
