import { Component, input } from '@angular/core';

import { Icon } from '@shared/utils/constants';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  template: `
    <svg class="icon">
      <use [attr.xlink:href]="iconName"></use>
    </svg>
  `,
  styles: ``,
})
export class IconComponent {
  icon = input.required<Icon>();

  get iconName(): string {
    return `#${this.icon()}`;
  }
}
