import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pucFilter',
  pure: false
})
export class PucFilterPipe implements PipeTransform {

  /**
   * @description filters the data set based on key
   * @param items object to be filtered
   * @param term item to be fitlered for
   * @param key specific key to be filtered ofr
   * @returns the filtered data set
   */
  transform(items: any, term: string, key?: string): any {
    if (!term || !items) {
      return items;
    }

    return this.filter(items, term, key);
  }

  filter(items: Array<{ [key: string]: any }>, term: string, key?: string): Array<{ [key: string]: any }> {
    const toCompare = term.toLowerCase();
    return items.filter((item: any) => {
      if (key) {
        if (item[key].toString().toLowerCase().includes(toCompare)) {
          return true;
        }
      } else {
        for (const property in item) {
          if (item[property] === null || item[property] === undefined) {
            continue;
          }
          if (item[property].toString().toLowerCase().includes(toCompare)) {
            return true;
          }
        }
      }
      return false;
    });
  }

}
