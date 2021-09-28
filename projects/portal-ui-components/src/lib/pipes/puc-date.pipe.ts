import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

@Pipe({
  name: 'pucDate'
})
export class PucDatePipe implements PipeTransform {

  /**
   * @description transforms the date to valid moment format else returns the val as is
   * @param value object to be transformed
   * @param format the format the date is to be transformed
   * @returns the formatted date object or the val as is
   */
  transform(value: any, format: string = ''): string {
    // Try and parse the passed value.
    const momentDate = moment(value);

    // If moment didn't understand the value, return it unformatted.
    if (!momentDate.isValid()) { return value; }

    // Otherwise, return the date formatted as requested.
    return momentDate.format(format);
  }

}
