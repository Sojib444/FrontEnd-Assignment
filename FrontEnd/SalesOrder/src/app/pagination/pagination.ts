import { Component, effect, input, output } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagination',
  imports: [NgbPaginationModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  page = input<number>(1);
  totalLength = input<number>(0);
  selectedPage= output<number>();
  constructor()
  {
    console.log(`page come from pagination page`,this.page());
  }

  onPageChange(newPage: number) {
    this.selectedPage.emit(newPage);
  }
}
