import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  SimpleChanges,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'puc-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss']
})
/**
 * @description: returns state of button
 */
export class ButtonGroupComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() selectedOption: any;
  @Input() id: any;
  @Output() optionClick: any = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    const selectedOption: SimpleChange = changes.selectedOption;
    const id: SimpleChange = changes.id;
    this.id = id ? id.currentValue : undefined;
    this.selectedOption = Math.floor(selectedOption.currentValue);
  }

  onClick(selectedType, selectedOption) {
    const selectedObj = {
      value: Number(selectedOption),
      type: selectedType,
    };
    this.optionClick.emit(selectedObj);
  }

  determineClass(option) {
    if (option.name === 'Named') {
      return 'disabled';
    } else if (option.value === Math.trunc(Number(this.selectedOption)).toString()) { return 'active'; }

  }
}
