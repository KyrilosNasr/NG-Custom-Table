import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smartFormat'
})
export class SmartFormatPipe implements PipeTransform {
    transform(value: any): any {
        if (value instanceof Date) {
          return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(value);
        }
        return value;
      }
    
}
