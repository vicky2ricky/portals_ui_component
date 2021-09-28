import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'puc-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.scss']
})
export class ConfirmationBoxComponent implements OnInit {
  @Input() details;
  @Output() userAction = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancel() {
    this.userAction.emit({type: this.details.type, action: 'cancel'});
  }

  confirm() {
    this.userAction.emit({type: this.details.type, action: 'confirm', id: this.details.id});
  }

}
