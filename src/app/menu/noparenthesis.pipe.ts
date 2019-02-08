import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noparenthesis'
})
export class NoParenthesisPipe implements PipeTransform {

  transform(value: string) {
    return value.replace('\"','');
  }
}
