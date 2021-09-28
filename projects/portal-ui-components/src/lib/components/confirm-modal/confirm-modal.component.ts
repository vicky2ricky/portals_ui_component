import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'puc-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>
  ) { }
  htmlContent: any;
  title: any;
  type: 'confirm' | 'dialog' | 'formPendingConfirm' = 'confirm';
  confirmBtnText = 'Confirm';
  warningIconDisplay = false;
  discardText = 'Discard & Leave';
  saveText = 'Save & Leave';
  showConfirmIcon = true;
  rxjsTimer = timer(1000, 1000);
  destroy = new Subject();
  timer = 5;
  showTimer = false;
  countDispaly:number;
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    if(this.showTimer) {
      this.countTimer();
    }
  }

  countTimer() {
    this.countDispaly = this.timer;
    this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe(val => {
      this.countDispaly = this.timer - val;
      if (this.countDispaly <=0) {
        this.destroy.next();
        this.destroy.complete();
        this.showTimer = false;
      }
    })
  }

}
