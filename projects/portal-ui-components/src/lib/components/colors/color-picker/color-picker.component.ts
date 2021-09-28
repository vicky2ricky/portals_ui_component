import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'puc-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() availableColorSet = ['#E95E6F', '#EF9453', '#F7C325', '#1AAE9F', '#92CA4B', '#897A5F',
    '#439AEB', '#9635E2', '#C660D7', '#4B5C6B', '#788896', '#BABABA'];
  @Input() selectedColor: any = '#E95E6F';
  @Output() colorSelectionChange: EventEmitter<any> = new EventEmitter();
  showColorContainer = false;
  constructor() { }



  onSelectColor(color) {
      this.selectedColor = color;
      this.showColorContainer = false;
      this.colorSelectionChange.emit(this.selectedColor);
  }

  ngOnInit(): void {

  }


}