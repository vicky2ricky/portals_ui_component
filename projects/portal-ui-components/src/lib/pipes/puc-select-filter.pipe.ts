import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pucSelectFilter'
})
export class PucSelectFilterPipe implements PipeTransform {

  /**
   * @description returns subset from object based on keys and search string
   * @param searchPool object to filter from
   * @param keys set of comma separated keys
   * @param searchString string to search from
   */
  public transform(searchPool: any, keys: string, searchString: string) {
    if (!searchString) { return searchPool; }
    return (searchPool || []).filter((item: any) => keys.split(',').some(key => item.hasOwnProperty(key)
      && new RegExp(searchString, 'gi').test(item[key])));
  }

}
