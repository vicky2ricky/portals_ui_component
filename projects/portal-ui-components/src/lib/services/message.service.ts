import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {

  private sitesExist = true;
  private subject = new Subject<any>();

  openSidebar(message: boolean) {
    this.subject.next({ isExpanded: message });
  }

  showSidebar(message: boolean) {
    this.subject.next({ isShow: message });
  }

  setSitesExists(message: boolean) {
    // this.subject.next({ isSiteExists: message });
    this.sitesExist = message;
  }

  getSitesExist() {
    return this.sitesExist;
  }

  isTruePrompt(message: boolean) {
    this.subject.next({ isTrue: message });
  }

  closeSidebar() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
