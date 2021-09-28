import {
  Component,
  forwardRef,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter, OnInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

@Component({
  selector: 'puc-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class CheckboxComponent implements OnInit {

  @ViewChild('inputEl', { static: false }) inputEl: ElementRef;
  @Input() value: any = '';
  @Input() name = 'gen-checkbox';
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() id = 'gen-checkbox';
  @Input() fill: any = 0;
  @Input() hasFill = false;
  @Input() emitEvent = false;
  @Input() type: 'checkbox' | 'full' = 'checkbox';
  /* tslint:disable-next-line */
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Input() checked = false;


  onModelChange: any = () => {
  }

  onModelTouched: any = () => {
  }

  writeValue(model: any): void {
    const self = this;
    self.checked = model;
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {

  }

  transform(style) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
  onChange($event) {
    const self = this;
    $event.preventDefault();
    $event.stopPropagation();
    self.onModelChange($event.target.checked);
    self.change.emit({
      originalEvent: $event,
      value: $event.target.checked
    });
  }
}
