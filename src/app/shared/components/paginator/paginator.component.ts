import { Component, input, output } from '@angular/core';

import { IconComponent } from '@shared/components/icon/icon.component';
import { Icon, PAGE_SIZE_OPTIONS } from '@shared/utils/constants';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [IconComponent],
  templateUrl: 'paginator.component.html',
  styles: `
    .caption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 1rem 0.5rem;
    }

    .size-selector {
      display: flex;
    }
  `,
})
export class PaginatorComponent {
  currentPage = input.required<number>();
  lastPage = input.required<number>();
  pageSize = input.required<number>();
  pageChange = output<number>();
  pageSizeChange = output<number>();
  firstPage = 1;
  protected readonly Icon = Icon;
  protected readonly PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;

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

  goToPreviousPage(): void {
    if (this.currentPage() > this.firstPage) {
      this.pageChange.emit(+this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.lastPage()) {
      this.pageChange.emit(+this.currentPage() + 1);
    }
  }

  goToLastPage(): void {
    if (this.currentPage() < this.lastPage()) {
      this.pageChange.emit(+this.lastPage());
    }
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(+selectElement.value);
  }
}
