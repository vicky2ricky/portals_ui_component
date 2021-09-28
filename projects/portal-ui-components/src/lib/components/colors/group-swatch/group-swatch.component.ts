import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'puc-group-swatch',
  templateUrl: './group-swatch.component.html',
  styleUrls: ['./group-swatch.component.scss']
})
export class GroupSwatchComponent implements OnInit {

  // Would be an object- with the keys defining the groups - and the value will be the list of colors
  @Input() availableColorSet;

  // Array of labels, that the group points to
  @Input() labels = [];
  @Input() showMainLabel = true;

  @Input() colorLabel;

  // For a group data, showing the labels
  @Input() colorData;

  // One of the keys fron the colorSet
  @Input() selectedGroup: string;

  @Input() isEdit = false;

  showColorSwatch = false;

  @Output() colorSelectionChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  changeColorSelection(key) {
    this.selectedGroup = key;

    const colorSet = {};
    const selectedColorset = (this.availableColorSet && (key in this.availableColorSet)) ? this.availableColorSet[key] : '';
    for (let i = 0; i < this.labels.length; i++) {
      colorSet[this.labels[i]] = selectedColorset ? selectedColorset[i] : '';
    }
    this.showColorSwatch = false;
    this.colorSelectionChange.emit({ colorSet, selectedGroup: key });
    if (this.colorData && Array.isArray(this.colorData) && this.colorData.length) {
      for (let i = 0; i < this.colorData.length; i++) {
        const item = this.colorData[i];
        item.color = selectedColorset ? selectedColorset[i] : '';;
      }
    }
  }

  @HostListener('click', ['$event'])
  hostClicked(event: Event) {
    const target = event.target as HTMLElement;
    if (!(target.classList.contains('selected-color-box')
      || target.classList.contains('color-box-part')
      || target.classList.contains('color-box-list-item'))) {
      this.showColorSwatch = false;
    }
  }

}
