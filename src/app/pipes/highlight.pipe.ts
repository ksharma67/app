import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, searchTerm: string): string {
    if (!searchTerm || !value) return value;

    return value.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
  }
}
