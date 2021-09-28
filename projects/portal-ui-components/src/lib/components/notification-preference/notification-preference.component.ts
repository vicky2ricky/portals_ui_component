import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'puc-notification-preference',
  templateUrl: './notification-preference.component.html',
  styleUrls: ['./notification-preference.component.scss']
})
export class NotificationPreferenceComponent implements OnInit {

  constructor(private notificationService:NotificationsService,
    private alertService: AlertService) { }

  @Input() siteId = '';
  @Input() userId = '';
  @Input() alerts;
  columns: Array<any> = [
    {
        key: 'alert',
        label: 'Alert'
    },
    {
        key: 'email',
        label: 'Email'
    }, {
        key: 'sms',
        label: 'SMS'
    }, {
        key: 'mobile',
        label: 'Mobile Push Notifications'
    },
    {
        key: 'browser',
        label: 'Desktop Push Notifications'
    },
    {
        key: 'notify fixed',
        label: 'Notify when fixed'
    }
];

  ngOnInit(): void {
  }

  toggleNotifyWhenFixed(event,alert) {
    let isChanged = false;
    if(event.checked && alert.notificationTypes.length) {
      alert.notifyWhenFixed = event.checked;
      isChanged = true;
    } else {
      if(alert.notifyWhenFixed) {
        isChanged = true
        alert.notifyWhenFixed = false;
      }

    }
    if(isChanged) {
      this.savePrefrences(alert);
    }
  }

  toggleValues(event,type,alert) {
    if(event.checked) {
      alert.notificationTypes.push(type);
    } else {
      alert.notificationTypes.splice(alert.notificationTypes.indexOf(type),1);
    }
    this.checkNotifyWhenFixed(alert);
    this.savePrefrences(alert);

  }

  savePrefrences(alert) {
    const alertId = alert.siteAlertDefinitionId;
    const reqBody = {
      notifyWhenFixed: alert.notifyWhenFixed,
      notificationTypes: alert.notificationTypes
    }
    this.notificationService.setUserNotificationPrefrenece(this.siteId,this.userId,alertId,reqBody).subscribe((res)=>{

      this.alertService.success('Notification Preferences set successfully');
    }, err=>{
      this.alertService.error(err.error||'Something went wrong');
    })
  }

  checkNotifyWhenFixed(alert) {
    if(alert.notificationTypes.length == 0) {
      alert.notifyWhenFixed = false;
    }
  }

  toggleSelection(event,type,alert) {
    switch(type) {
      case 1: this.toggleValues(event,'EMAIL',alert);
            break;
      case 2: this.toggleValues(event,'SMS',alert);
            break;
      case 3: this.toggleValues(event,'MOBILE_PUSH',alert);
            break;
      case 4: this.toggleValues(event,'BROWSER',alert);
            break;
    }
  }
}
