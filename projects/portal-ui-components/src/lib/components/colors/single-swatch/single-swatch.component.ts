import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

interface ISelection {
  label: string;
  value: string;
  color: string;
}

@Component({
  selector: 'puc-single-swatch',
  templateUrl: './single-swatch.component.html',
  styleUrls: ['./single-swatch.component.scss']
})
export class SingleSwatchComponent implements OnInit {

  @Input() availableColorSet = ['#E95E6F', '#EF9453', '#F7C325', '#1AAE9F', '#92CA4B', '#897A5F',
    '#439AEB', '#9635E2', '#C660D7', '#4B5C6B', '#788896', '#BABABA'];

  @Input() selectionSets: Array<Array<ISelection>>;
  @Input() drag = true;

  @Output() colorSelectionChange: EventEmitter<any> = new EventEmitter();
  @Output() orderChange: EventEmitter<any> = new EventEmitter();

  @Input() isEdit = false;

  showColorSwatchFor;

  workingOnIt = false;

  constructor() { }

  ngOnInit(): void {

  }


  showColorSelector(value) {
    if (this.showColorSwatchFor === value) {
      // user had opened and is now closing this one
      this.showColorSwatchFor = null;
    } else {
      this.showColorSwatchFor = value;
    }
  }


  changeColorSelection(selection, color) {
    selection.color = color;
    this.showColorSwatchFor = null;

    this.colorSelectionChange.emit(this.selectionSets);
  }


  @HostListener('click', ['$event'])
  hostClicked(event: Event) {
    const target = event.target as HTMLElement;
    if (! (target.classList.contains('selected-color-box') || target.classList.contains('color-box')) ) {
      this.showColorSwatchFor = null;
    }
  }


  // @HostListener('mouseenter', ['$event'])
  // mouseEntered(event: Event) {
  //   this.workingOnIt = true;
  // }


  // @HostListener('mouseleave', ['$event'])
  // mouseLeft(event: Event) {
  //   this.workingOnIt = false;
  // }


  handleDragStart(e) {

  }


  drop(event: CdkDragDrop<string[]>, index) {
    moveItemInArray(this.selectionSets[index], event.previousIndex, event.currentIndex);
    this.orderChange.emit(this.selectionSets);
  }

}
