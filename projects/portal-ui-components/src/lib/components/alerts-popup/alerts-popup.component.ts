import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'puc-alerts-popup',
  templateUrl: './alerts-popup.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./alerts-popup.component.scss']
})
export class AlertsPopupComponent  {

  htmlContent: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
