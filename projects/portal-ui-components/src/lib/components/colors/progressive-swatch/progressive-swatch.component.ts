import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { ColorService } from '../../../services/color.service';

interface ISelection {
  label: string;
  value: string;
  color?: string;
  type: string;
  group?: string;
  progressive: Array<{ label: string; color: string; }>;
}

@Component({
  selector: 'puc-progressive-swatch',
  templateUrl: './progressive-swatch.component.html',
  styleUrls: ['./progressive-swatch.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressiveSwatchComponent implements OnInit, OnChanges {

  @Input() gradientColorSet;
  @Input() availableColorList = ['#E95E6F', '#EF9453', '#F7C325', '#1AAE9F', '#92CA4B', '#897A5F',
    '#439AEB', '#9635E2', '#C660D7', '#4B5C6B', '#788896', '#BABABA'];

  @Input() selections: Array<ISelection>;
  @Input() isEdit = false;

  @Input() lowestOpacity = 0.6;
  @Input() wrapUp? = true;

  @Output() colorSelectionChange: EventEmitter<any> = new EventEmitter();

  showColorSwatchFor;

  constructor(private colorService: ColorService) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.selections) {
      this.updateProgressives();
    }
  }


  updateProgressives() {
    if (this.selections && Array.isArray(this.selections) && this.selections.length) {
      this.selections.map(selection => {
        if (selection.type === 'single') {
          this.interpolateSingleColor(selection, selection.color);
        } else if (selection.type === 'gradient') {
          this.interpolateGradientColor(selection, selection.group);
        }
      });

      // Since the swatch decided the shades, it needs to tell the colors it chose
      this.colorSelectionChange.emit(this.selections);
    }
  }


  showColorSelector(value) {
    if (this.showColorSwatchFor === value) {
      // user had opened and is now closing this one
      this.showColorSwatchFor = null;
    } else {
      this.showColorSwatchFor = value;
    }
  }

  changeColorSelection(type, selection, value) {
    if (type === 'single') {
      selection.color = value;
      delete selection.group;

      this.interpolateSingleColor(selection, selection.color);

    } else if (type === 'gradient') {
      selection.group = value;
      delete selection.color;

      this.interpolateGradientColor(selection, selection.group);
    }
    selection.type = type;
    this.showColorSwatchFor = null;
    // Also make the call for getting the progressive colors
    this.colorSelectionChange.emit(this.selections);
  }


  linearGradient(stopColor0, stopColor100) {
    return `linear-gradient(to right, ${stopColor0} , ${stopColor100})`;
  }

  interpolateSingleColor(selection, baseColor) {
    const hexColorRepr = this.colorService.hexTorgb(baseColor);
    const len = (selection && selection.progressive && Array.isArray(selection.progressive)) ? selection.progressive.length : 0;

    // there is just a single floor, ccu etc, so it should be of the same color as the starting color.
    const spreadOutColorSet = len === 1 ? [hexColorRepr] : this.colorService.generateOpacityArray(hexColorRepr, this.lowestOpacity, len);
    console.log(spreadOutColorSet);

    for (let i = 0; i < spreadOutColorSet.length; i++) {
      selection.progressive[i].color = spreadOutColorSet[i];
    }
  }

  interpolateGradientColor(selection, group) {
    const selectedGradient = (this.gradientColorSet && (group in this.gradientColorSet)) ? this.gradientColorSet[group] : '';
    const stopColor0 = selectedGradient ? selectedGradient['stopColor0'] : '#0000fc';
    const stopColor100 = selectedGradient ? selectedGradient['stopColor100'] : '#00ff1d';
    const stopColor0Repr = this.colorService.hexTorgb(stopColor0);
    const stopColor100Repr = this.colorService.hexTorgb(stopColor100);
    const len = (selection && selection.progressive && Array.isArray(selection.progressive)) ? selection.progressive.length : 0;
    const interpolatedColorArray =
      this.colorService.generateInterpolatedColors(stopColor0Repr, stopColor100Repr, len);
    for (let i = 0; i < interpolatedColorArray.length; i++) {
      selection.progressive[i].color = interpolatedColorArray[i];
    }
  }

  @HostListener('click', ['$event'])
  hostClicked(event: Event) {
    const target = event.target as HTMLElement;
    if (!(target.classList.contains('selected-color-box')
      || target.classList.contains('color-box')
      || target.classList.contains('color-box-list-item'))) {
      this.showColorSwatchFor = null;
    }
  }

}
