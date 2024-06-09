import { DatePipe, formatDate } from '@angular/common';
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private datePipe = new DatePipe('en-US');
  @Input() format: string = 'D, MMMM, YYYY';  // Default format
  constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.control.control) {
      this.control.control.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(value => {
          if (value) {

            // const formattedDate = this.datePipe.transform(new Date(value), 'dd MMMM yyyy');
            const formattedDate = formatDate(value,'d MMM yyyy','en')
            if (formattedDate) {
              this.renderer.setProperty(this.el.nativeElement, 'value', formattedDate);
            }
          }
        });
    }
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatDateForInput(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }
}