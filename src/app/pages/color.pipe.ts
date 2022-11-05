import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(index: number): any {
    switch( index) { 
      case 0 : return "#f00"
      case 1 : return "#0f0"
      case 2 : return "#00f"
      default: return "#abc"
    }
  }

}