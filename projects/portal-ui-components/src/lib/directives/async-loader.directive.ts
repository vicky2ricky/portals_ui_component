import { Directive, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[pucAsyncLoader]'
})
export class AsyncLoaderDirective implements OnInit {

  /**
   * It contains data node and property for which
   */
  @Input() pucAsyncLoader: any;

  constructor() {
  }

  ngOnInit() {
    const self = this;
    self.pucAsyncLoader.node = self.pucAsyncLoader.fn();
  }
}
