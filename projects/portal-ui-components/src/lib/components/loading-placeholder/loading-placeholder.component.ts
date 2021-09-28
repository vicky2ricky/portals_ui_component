import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'puc-loading-placeholder',
  templateUrl: './loading-placeholder.component.html',
  styleUrls: ['./loading-placeholder.component.scss']
})
export class LoadingPlaceholderComponent implements OnInit {

  @Input() width = 120;
  @Input() height = 120;
  constructor() {
    const self = this;

  }

  ngOnInit() {
    const self = this;
  }

  get style() {
    const self = this;
    return {
      'min-width': self.width + 'px',
      'max-width': self.width + 'px',
      'min-height': self.height + 'px',
      'max-height': self.height + 'px'
    };
  }
}
