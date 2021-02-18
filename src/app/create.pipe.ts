import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'create'
})
export class CreatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
