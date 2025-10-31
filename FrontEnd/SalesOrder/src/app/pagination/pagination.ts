import { Component, input, output } from '@angular/core';
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
    console.log(this.totalLength());
  }

  onPageChange(newPage: number) {
    this.selectedPage.emit(newPage);
  }
}
