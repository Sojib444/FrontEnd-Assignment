import { Component, effect, input, output } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagination',
  imports: [NgbPaginationModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  pageNumerInput = input<number>(1);
  pageSize = input<number>(10);
  totalLength = input<number>(20);
  selectedPage= output<number>();
  constructor()
  {
  }

  onPageChange(newPage: number) {
    this.selectedPage.emit(newPage);
  }
}
