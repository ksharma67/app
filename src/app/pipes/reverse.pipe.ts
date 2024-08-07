import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.slice().reverse();
  }
}
