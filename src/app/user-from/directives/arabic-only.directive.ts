import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appArabicOnly]'
})
export class ArabicOnlyDirective {
  private arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+$/;

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const trimmed = input.value.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, '');
    if (input.value !== trimmed) {
      input.value = trimmed;
      input.dispatchEvent(new Event('input'));
    }
  }

}
