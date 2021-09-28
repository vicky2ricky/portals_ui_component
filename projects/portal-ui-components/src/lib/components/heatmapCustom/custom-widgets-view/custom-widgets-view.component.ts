import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'puc-custom-widgets-view',
  templateUrl: './custom-widgets-view.component.html',
  styleUrls: ['./custom-widgets-view.component.scss']
})
export class CustomWidgetsViewComponent implements OnInit {

  @Input() customWidgets;
  @Input() scope;
  @Input() actionUsed;
  @Input() heatmapConfigId;
  @Input() customDateRange;

  @Output() dataRecievedEvt: EventEmitter<any> = new EventEmitter();
  @Output() accordionHiddenEvent: EventEmitter<any> = new EventEmitter();
  scopeLabel;
  hiddenAccordions = 0;

  constructor() { }

  ngOnInit(): void {
    this.scopeLabel = this.scope === 'zone' ? 'Zone' : 'System';
    this.hiddenAccordions = 0;
  }

  accordionHiddenEvt(event) {
    this.hiddenAccordions += 1;
    this.accordionHiddenEvent.emit(this.hiddenAccordions);
  }

  dataRecieved(event) {
    this.dataRecievedEvt.emit(event);
  }
}
