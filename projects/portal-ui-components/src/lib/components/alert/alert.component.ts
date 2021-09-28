import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'puc-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.scss']
})

export class AlertComponent implements OnInit, OnDestroy, AfterViewChecked {
  private subscription: Subscription;
  message: any;
  timeOutMessg = [
    'Floor plan uploaded successfully',
    'Please upload a floor plan!',
    'Please select zones to upload!'
  ];
  overlayShow = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.getMessage();
  }

  ngAfterViewChecked() {
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMessage() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
      if (message && message.type === 'success') {
        setTimeout(() => { this.message = false; }, 3000);
      } else {
        this.overlayShow = true;
      }
    });
  }

  closeErrorDialog() {
    this.overlayShow = false;
    this.message = false;
  }
}
