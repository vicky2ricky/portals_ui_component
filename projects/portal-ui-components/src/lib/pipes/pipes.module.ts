import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PucDatePipe } from './puc-date.pipe';
import { PucFilterPipe } from './puc-filter.pipe';
import { PucOrderByPipe } from './puc-order-by.pipe';
import { PucSafeHtmlPipe } from './puc-safe-html.pipe';
import { PucSelectFilterPipe } from './puc-select-filter.pipe';

@NgModule({
  declarations: [
    PucDatePipe,
    PucFilterPipe,
    PucOrderByPipe,
    PucSafeHtmlPipe,
    PucSelectFilterPipe
  ],

  imports: [
    CommonModule
  ],

  exports: [
    PucDatePipe,
    PucFilterPipe,
    PucOrderByPipe,
    PucSafeHtmlPipe,
    PucSelectFilterPipe
  ],

  providers: [
    PucOrderByPipe
  ]

})
export class PucPipesModule { }
