import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  template: `
    <p [attr.data-type]="type()" role="alert">
      <ng-content />
    </p>
  `,
  styles: `
    [role='alert'] {
      position: relative;
      margin-bottom: 1em;
      border: 2px solid var(--alert-border-color);
      border-radius: 0.75rem;
      padding: 1em 2em;
      background-color: var(--alert-background-color);
    }

    [data-type='error'] {
      border-color: #f06048;
      background-color: #861d13;
    }
  `,
})
export class AlertComponent {
  type = input<string>('error');
}
