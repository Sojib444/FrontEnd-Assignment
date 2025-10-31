import { Directive, ElementRef, output } from '@angular/core';
import { debounceTime, fromEvent, map, NEVER } from 'rxjs';

@Directive({
  selector: '[canNotLessThanZero]'
})
export class CanNotLessThanZero {

  islessthanZero = output<boolean>();

  constructor(private el: ElementRef) {
    this.initListener();
  }
  private initListener() {
    fromEvent(this.el.nativeElement, 'input')
      .pipe(
        debounceTime(200),
        map((e: any) => e.target.value),
        map(value => {
          if(value <1 )
            return true;
          return false;
        })
      )
      .subscribe(res => {
        this.islessthanZero.emit(res)
        console.log(res);
      });
  }
}
