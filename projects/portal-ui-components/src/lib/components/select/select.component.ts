import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnChanges
} from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'puc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})

export class SelectComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() selectTitle: string;
  @Input() selectedOption: any;
  @Input() optionType: string;
  @Input() selectDisabled: any;
  @Output() optionChange: any = new EventEmitter();
  @ViewChild('select', { static: true }) select: ElementRef;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedOption: SimpleChange = changes.selectedOption;
    if (selectedOption) {
      this.selectedOption = selectedOption.currentValue != undefined?selectedOption.currentValue.toString():'';
    }
  }

  onChange(selectedType, selectedOption: any) {
    const selectedObj = {
      value: Number(selectedOption.value),
      type: selectedType,
    };

    this.optionChange.emit(selectedObj);
  }
}
