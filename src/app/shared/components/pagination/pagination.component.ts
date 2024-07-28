import { Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { Icon } from '@shared/utils/constants';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div role="group">
      @if (displayFirst) {
        <button (click)="goToFistPage()">
          <app-icon [$icon]="Icon.FIRST_PAGE" />
        </button>
      }
      <button (click)="previousPage()" [disabled]="disablePrevious">
        Previous
      </button>
      <button (click)="nextPage()" [disabled]="disableNext">Next</button>
      @if (displayLast) {
        <button (click)="goToLastPage()">
          <app-icon [$icon]="Icon.LAST_PAGE" />
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class PaginationComponent {
  currentPage = input.required<number>();
  lastPage = input.required<number>();
  pageChange = output<number>();
  firstPage = 1;
  protected readonly Icon = Icon;

  get displayFirst(): boolean {
    return +this.currentPage() !== this.firstPage;
  }

  get disablePrevious(): boolean {
    return +this.currentPage() === this.firstPage;
  }

  get disableNext(): boolean {
    return +this.currentPage() === this.lastPage();
  }

  get displayLast(): boolean {
    return +this.currentPage() !== this.lastPage();
  }

  goToFistPage(): void {
    if (this.currentPage() > this.firstPage) {
      this.pageChange.emit(this.firstPage);
    }
  }

  previousPage(): void {
    if (this.currentPage() > this.firstPage) {
      this.pageChange.emit(+this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.lastPage()) {
      this.pageChange.emit(+this.currentPage() + 1);
    }
  }

  goToLastPage(): void {
    if (this.currentPage() < this.lastPage()) {
      this.pageChange.emit(+this.lastPage());
    }
  }
}
