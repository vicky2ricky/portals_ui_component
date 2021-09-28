
import {
  Component,
  Input,
  SimpleChanges,
  SimpleChange,
  ChangeDetectionStrategy, OnChanges
} from '@angular/core';

@Component({
  selector: 'puc-graph-xaxis',
  templateUrl: './graph-xaxis.component.html',
  styleUrls: ['./graph-xaxis.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GraphXaxisComponent implements OnChanges {
  @Input() xCords: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const xCords: SimpleChange = changes.xCords;
    if (xCords) {
      this.xCords = xCords.currentValue;
    }
  }
}
