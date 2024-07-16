import { FormControl } from '@angular/forms';

export type UserForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  passwordConfirmation: FormControl<string>;
};
