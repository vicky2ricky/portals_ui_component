import { Pipe, PipeTransform, Optional } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'pucSafeHtml'
})
export class PucSafeHtmlPipe implements PipeTransform {

  constructor(@Optional() private sanitized: DomSanitizer) { }

  /**
   * @description sanities the html input
   * @param value object to be sanitized
   * @returns the safe html
   */
  transform(value: string, args?: any): SafeHtml {
    if (value) {
      if (!!this.sanitized) {
        return this.sanitized.bypassSecurityTrustHtml(value);
      } else {
        // Depending on your component´s ability to correctly work
        // without this dependency you can either warn or raise an error
        console.warn('Ensure that the `BrowserModule` is imported in the application´s root module');
      }
    } else {
      return 'Undefined HTML';
    }
  }
}
