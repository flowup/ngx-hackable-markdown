import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myTransformPipe'
})
export class MyTransformPipe implements PipeTransform {
  transform(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\W/g, '-');
  }
}
