import { Component, Input } from '@angular/core';

@Component({
  selector: 'puc-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
/**
 * @description: Binds title
 */
export class WidgetComponent {
  @Input() title: string;

  constructor() { }
}
