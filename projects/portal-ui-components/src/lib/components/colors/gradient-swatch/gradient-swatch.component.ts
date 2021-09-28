import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'puc-gradient-swatch',
  templateUrl: './gradient-swatch.component.html',
  styleUrls: ['./gradient-swatch.component.scss']
})
export class GradientSwatchComponent implements OnInit {

  // Would be an object- with the keys defining the groups - and the value will be the list of colors i.e. stopColor0 and stopColor100
  @Input() availableColorSet;

  @Input() colorLabel;

  // One of the keys fron the colorSet
  @Input() selectedGroup: string;

  showColorSwatch = false;

  @Input() isEdit = false;

  @Output() colorSelectionChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  changeColorSelection(key) {
    this.selectedGroup = key;
    this.showColorSwatch = false;
    const selectedColorset = (this.availableColorSet && (key in this.availableColorSet)) ? this.availableColorSet[key] : '';
    this.colorSelectionChange.emit(selectedColorset);
  }


  linearGradient(stopColor0, stopColor100) {
    return `linear-gradient(to right, ${stopColor0} , ${stopColor100})`;
  }


  @HostListener('click', ['$event'])
  hostClicked(event: Event) {
    const target = event.target as HTMLElement;
    console.log('s', target);
    if (!(target.classList.contains('selected-color-box')
      || target.classList.contains('color-box')
      || target.classList.contains('color-box-list-item'))) {
      this.showColorSwatch = false;
    }
  }


}
