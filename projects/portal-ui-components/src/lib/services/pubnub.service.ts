import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { HelperService } from './hs-helper.service';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PubNubService {
  activeId: any = [];
  pointIdSet = new Set();
  incomingMessage: Subject<any> = new Subject();
  eventSource: EventSourcePolyfill;

  public vacationAdded: Subject<any> = new Subject();
  constructor(
    private dataService: DataService,
    private helperService: HelperService,
    private configService: ConfigurationService,
    private httpClient: HttpClient,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {
  }

  subscribe(channelIds: string[]) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const messagingUrl = this.configService.getConfig('messagingUrl');
    const bearerToken = this.localStorage.getItem('bearer_token');

    this.eventSource = new EventSourcePolyfill(`${messagingUrl}/messages?channels=${channelIds.join(',')}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

    this.eventSource.onerror = err => {
      console.error('Failed to connect to messaging event stream');
    };

    this.eventSource.onmessage = event => {
      const msg = JSON.parse(event.data);
      this.incomingMessage.next(Object.assign({}, msg));
      const dataSericeVals = this.dataService.getId().subscribe(res => {
        this.pointIdSet = res;
        this.activeId = (res) ? Array.from(res) : [];
      });
      dataSericeVals.unsubscribe();

      const activeElem = this.activeId.find(el => el.split('|')[0] === msg.message.id);
      /* istanbul ignore if */
      if (activeElem) {
        const updatedEntry = activeElem.replace('updated', 'update');

        this.activeId.splice(this.activeId.indexOf(activeElem), 1);
        this.activeId.push(updatedEntry);
        this.pointIdSet.clear();
        this.pointIdSet = new Set(this.activeId);
        this.dataService.setId(this.pointIdSet);
        this.helperService.getPointData().subscribe(res => res);
      } else {
        /* istanbul ignore if */
        if (msg.message.command === 'updateSchedule') {
          this.vacationAdded.next(msg.message.id);
        }
        /* istanbul ignore if */
        else if (msg.message.command === 'removeEntity') {
          const idsDeleted = msg.message.ids;
          idsDeleted.forEach(x => {
            // tslint:disable-next-line
            const activeElem = this.activeId.find(el => el.split('|')[0] === x.val);
            /* istanbul ignore if */
            if (activeElem) {
              const removedEntry = activeElem;
              this.helperService.removeDeletedZoneSetting(removedEntry);
              this.activeId.splice(this.activeId.indexOf(activeElem), 1);
              this.pointIdSet.clear();
              this.pointIdSet = new Set(this.activeId);
              this.dataService.setId(this.pointIdSet);
              this.helperService.getPointData().subscribe(res => res);
            }
          });
        }
      }
    };
  }

  fetchHistory(channelId: string) {
    const messagingUrl = this.configService.getConfig('messagingUrl');
    const end = new Date();
    const start = new Date();
    start.setHours(end.getHours() - 24);

    this.httpClient.get<any[]>(`${messagingUrl}/messages/${channelId}/history`, {
      params: {
        start: start.getTime().toString(),
        end: end.getTime().toString()
      }
    }).subscribe(
      messages => {
        messages.forEach(message => this.incomingMessage.next(message));
      },
      () => {
        console.error('Failed to get history for channel ' + channelId);
      }
    );
  }

  publish(channelId: string, message: any) {
    const messagingUrl = this.configService.getConfig('messagingUrl');

    this.httpClient.post(`${messagingUrl}/messages/${channelId}`, message).subscribe(
      () => { },
      () => {
        console.error('Failed to publish message to ' + channelId);
      }
    );
  }

  parsePubnubContent(message: any) {
    let parsedMessage: any;
    switch (message.command) {
      case 'updatePoint':
        parsedMessage = {
          who: message.who,
          id: message.id,
          val: message.val,
          level: message.level
        };
        break;
      case 'updateSchedule':
        parsedMessage = {
          id: message.id
        };
        break;
      case 'sync':
        parsedMessage = {
          siteId: message.siteId
        };
        break;
      /* istanbul ignore next */
      case 'removeEntity':
        parsedMessage = {
          ids: message.ids.map(row => row.val).join(', ')
        };
        break;
      case 'remoteCmdUpdate':
        parsedMessage = {
          who: message.who,
          remoteCmdType: message.remoteCmdType
        };
        break;
        case 'addEntity':
        case 'updateEntity':
        parsedMessage = {
          ids: message.ids.join(', ')
        };
        break;
      default:
        parsedMessage = Object.assign({}, message);
        break;
    }
    // return Object.keys(message).map(r=>`${r.toUpperCase()}: ${message[r]}`).join(' | ');
    return parsedMessage;
  }

  unsubscribe() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
