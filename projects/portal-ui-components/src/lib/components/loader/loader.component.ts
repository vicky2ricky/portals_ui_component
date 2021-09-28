import { Component, OnInit, OnDestroy, HostBinding, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'puc-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LoaderComponent implements OnInit, OnDestroy {
  private subscription: any;
  state: any = false;
  @HostBinding('class.active') active = false;
  @HostBinding('class.inactive') inactive = true;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.setState();
  }

  setState() {
    this.subscription = this.loaderService.getState().subscribe(message => {
      this.state = message;
      if (this.state) {
        this.active = true;
        this.inactive = false;
      } else {
        this.active = false;
        this.inactive = true;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeErrorDialog() {
    this.state = null;
  }
}
