import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import UserAppComponent from './modules/users/user-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserAppComponent],
  template: ` <router-outlet /> `,
  styles: ``,
})
export class AppComponent {}
