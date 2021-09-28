import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pucOrderBy',
  pure: true
})
export class PucOrderByPipe implements PipeTransform {

  /**
   * @description sorts the data based on propeorty and order
   * @param value object to be sorted
   * @param propertyName field to be sorted in object
   * @param direction asc or desc
   * @returns the sorted object
   */
  transform(value: any[], propertyName: string, direction?: 'asc' | 'desc'): any[] {
    let directionVal = -1;
    if (direction && direction === 'desc') {
      directionVal = 1;
    }
    if (propertyName) {
      return value.sort((a: any, b: any) => {
        return b[propertyName].toString().localeCompare(a[propertyName].toString()) * directionVal;
      });
    } else {
      return value;
    }
  }

}
