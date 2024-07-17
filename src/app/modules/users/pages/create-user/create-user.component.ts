import { Component } from '@angular/core';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [UserFormComponent],
  template: ` <user-form />`,
  styles: ``,
})
export default class CreateUserComponent {}
