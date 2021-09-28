import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { ClickService } from '../../services/click.service';

@Directive({
  selector: 'puc-modal-header'
})
export class ModalHeaderDirective { }

@Component({
  selector: 'puc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewChecked {
  @Output() closeModal: any = new EventEmitter();

  @Input() title?: string;
  @Input() isActive;
  @Input() isFixed;
  @Input() width: number;
  @Input() left: number;
  @Input() footerActive: number;

  @ContentChild(ModalHeaderDirective, { read: ElementRef, static: false })
  header: ElementRef;
  @ViewChild('modalHeader', { static: false }) headerHolder: ElementRef;
  modalHeader: any;


  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.eRef.nativeElement.contains(event.target) && this.isActive && !this.isFixed) {
      this.closeModal.emit(true);
    }

    if (event.target.className === 'modal modal--show modal--fixed') {
      this.closeModal.emit(true);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // tslint:disable-next-line
    if (event.keyCode === 27) {
      this.closeModal.emit(true);
    }
  }

  @HostListener('click')
  handleAnywhereClick(): void {
    this.clickService.setHeatmapSettingsClicked(null);
  }

  constructor(
    private cDRef: ChangeDetectorRef,
    private eRef: ElementRef,
    private clickService: ClickService
  ) { }


  ngOnInit() {

  }

  ngAfterViewChecked() {
    // if(this.header) {
    //   this.modalHeader = this.header.nativeElement.innerHTML;
    //   this.headerHolder.nativeElement.innerHTML = this.modalHeader;
    //   this.cDRef.detectChanges();
    // }
  }

  hideModal() {
    this.closeModal.emit(true);
  }
}
