import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent {
  $users = input.required<User[]>();
}
