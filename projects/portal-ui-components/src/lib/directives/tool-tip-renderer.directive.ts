import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef
} from '@angular/core';
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef
} from '@angular/cdk/overlay';

import { ComponentPortal } from '@angular/cdk/portal';
import { take } from 'rxjs/operators';
import { CustomToolTipComponent } from '../components/custom-tooltip/custom-tool-tip.component';

@Directive({
  selector: '[customToolTip]'
})
export class ToolTipRendererDirective implements OnInit, OnDestroy {
  /**
   * This will be used to show tooltip or not
   * This can be used to show the tooltip conditionally
   */
  @Input() showToolTip = true;
  @Input() isHandlePos = true;
  @Input() showExtraOption = false;

  // If this is specified then specified text will be showin in the tooltip
  @Input(`customToolTip`) text: string;

  // If this is specified then specified template will be rendered in the tooltip
  @Input() contentTemplate: TemplateRef<any>;

  private _overlayRef: OverlayRef;
  private _tooltipInstance;
  private _mouseInTooltip = false;
  private _hasListeners = false;
  eventSubscription;

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private _r2: Renderer2
  ) { }

  /**
   * Init life cycle event handler
   */
  ngOnInit() {
    if (!this.showToolTip) {
      return;
    }
    this._overlayRef = this._overlay.create();
  }

  ngOnDestroy() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter', ['$event'])
  show(e) {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      // set tooltip instance
      this._tooltipInstance = this._overlayRef.attach(
        new ComponentPortal(CustomToolTipComponent)
      ).instance;
      this._overlayRef.updatePositionStrategy(this._overlayPositionBuilder
        .flexibleConnectedTo(this._elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: this.getOriginY(),
            overlayX: 'start',
            overlayY: 'top',
            offsetY: this.getOffsetY()
          }
        ]));
      this._overlayRef.updatePosition();
      // set CustomToolTipComponenet content/inputs
      this._tooltipInstance.text = this.text;
      this._tooltipInstance.contentTemplate = this.contentTemplate;
      this._tooltipInstance.isHandlePos = this.isHandlePos;

      // render tooltip
      this._tooltipInstance!.show(0); // tslint:disable-line

      // sub to detach after hide anitmation is complete
      this._tooltipInstance
        .afterHidden()
        .pipe(take(1))
        .subscribe(() => {
          this._overlayRef.detach();
        });
      if (!this._hasListeners) {
        this._hasListeners = true;
        // attach mouseleave listener to detach when mouseleave on tooltip
        this._r2.listen(this._overlayRef.overlayElement, 'mouseleave', () => {
          // call hide function in this directive
          this._mouseInTooltip = false;
          this.hide();
        });

        this._r2.listen(this._overlayRef.overlayElement, 'mouseenter', () => {
          // call hide function in this directive
          this._mouseInTooltip = true;
        });

        //   this.eventSubscription = fromEvent(window, "scroll").subscribe(e => {
        //     this.onWindowScroll(e);
        //     this.eventSubscription.unsubscribe();
        // });
      }
    }
  }
  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave', ['$event'])
  hide(buttonClicked = null) {
    if (buttonClicked)
      this._mouseInTooltip = false;
    setTimeout(() => {
      if (!this._mouseInTooltip) this._tooltipInstance!._onHide.next(); // tslint:disable-line
    }, 20);
  }

  //   @HostListener('window:scroll', ['$event'])
  //   onWindowScroll($event) {
  //     this._mouseInTooltip = false;
  //     this.hide();

  // }

  private getOffsetY() {
    if (this.isHandlePos) {
      if (this._elementRef.nativeElement.getBoundingClientRect().bottom > 500)
        return -370;
      if (this._elementRef.nativeElement.getBoundingClientRect().bottom > 400)
        return -290;
      if (this._elementRef.nativeElement.getBoundingClientRect().bottom > 300)
        return -200;
      return -10;
    }
    else {
      // console.log(this._elementRef.nativeElement.getBoundingClientRect().bottom);
      const value = this.showExtraOption ? 450 : 500;
      if (this._elementRef.nativeElement.getBoundingClientRect().bottom > value) {
        return this.showExtraOption? -220 : -180;
      }
      console.log('er');
      // return "auto"
    }
  }

  private getOriginY() {
    if (this.isHandlePos) {
      return 'bottom'
    }
    else {
      const value = this.showExtraOption ? 450 : 500;
      if (this._elementRef.nativeElement.getBoundingClientRect().bottom > value)
        return 'top'
      return 'bottom'
      }
  }

}

