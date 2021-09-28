import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ClickService } from '../../../services/click.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'puc-widget-accordion',
  templateUrl: './widget-accordion.component.html',
  styleUrls: ['./widget-accordion.component.scss']
})
export class WidgetAccordionComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() widget;
  @Input() widgetName;
  @Input() editAnalytics;
  @Input() widgetIndex;
  @Input() scope;

  @Input() userAction;

  @Input() isOpen? = true;
  @Input() isGlobal;

  @Input() isDragDisabled? = false;

  @Input() deleteInProgress;

  @Input() accordionWidth;
  @Input() heatmapConfigId;

  @Input() customDateRange;

  showSettings = false;
  showAccordion = true;

  @Output() editWidgetEvt: EventEmitter<any> = new EventEmitter();
  @Output() deleteWidgetEvt: EventEmitter<any> = new EventEmitter();

  @Output() accordionHiddenEvt: EventEmitter<any> = new EventEmitter();
  @Output() dataRecievedEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('analyticsAccordion', { static: true }) analyticsAccordion: ElementRef;

  unsubscribe$: Subject<boolean> = new Subject();

  constructor(
    private clickService: ClickService
  ) { }

  ngOnInit(): void {
    const accordionWidth = (this.analyticsAccordion.nativeElement as HTMLElement).offsetWidth;
    if (accordionWidth > 0) {
      this.accordionWidth = accordionWidth;
    }
    console.log(this.accordionWidth);

    this.clickService.getHeatmapSettingsClicked()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        widgetId => {
          this.showSettings = (widgetId === this.widget.widgetId);
      });
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.userAction && changes.userAction.currentValue && changes.userAction.currentValue === 'click') {
      window.dispatchEvent(new Event('resize'));
    }
  }

  // This shows the settings for the zone and system level
  toggleSettings() {
    const showSettings = !this.showSettings;
    if (showSettings) {
      this.clickService.setHeatmapSettingsClicked(this.widget.widgetId);
    } else {
      this.clickService.setHeatmapSettingsClicked('');
    }
  }

  editWidget(event) {
    event.stopPropagation();
    this.editWidgetEvt.emit({widget: this.widget, index: this.widgetIndex, scope: this.scope});
  }

  deleteWidget(event) {
    event.stopPropagation();
    this.deleteWidgetEvt.emit({widget: this.widget, index: this.widgetIndex, scope: this.scope});
  }

  activateDropdown() {
    this.isOpen = !this.isOpen;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const accordionWidth = (this.analyticsAccordion.nativeElement as HTMLElement).offsetWidth;
    this.accordionWidth = accordionWidth;
  }


  hideAccordion() {
    this.showAccordion = false;
    this.accordionHiddenEvt.emit(this.widget.widgetId);
  }


  dataRecieved(event) {
    this.dataRecievedEvt.emit(event);
  }

}
