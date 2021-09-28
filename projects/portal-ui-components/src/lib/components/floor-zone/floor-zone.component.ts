import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DroppableService } from '../../services/droppable.service';

@Component({
  selector: 'puc-floor-zone',
  templateUrl: './floor-zone.component.html',
  styleUrls: ['./floor-zone.component.scss']
})
export class FloorZoneComponent implements OnInit, OnChanges {

  urlFloorZoneIn: any;
  roomsFloorZoneIn: any;
  existingDroppedItemZoneIn: any[] = [];
  @Input() urlFloorZone;
  @Input() roomsFloorZone;
  @Input() currentBoxFloorZone;
  @Input() existingDroppedItem: any[] = [];
  dropzone1 = [];
  currentBox: string;
  will_draw = false;
  left;
  top;
  topLeft = [];
  @Output() floorToParent = new EventEmitter<any>();
  @Input() onActiveFloor;
  onActiveFloorZoneIn = false;
  @Input() floorNotPresentZone;
  floorNotPresentZoneIn = false;
  @Input() uploadFloorPlanZone;
  uploadFloorPlanZoneIn = false;
  @Input() noFloorZoneIn;
  noFloorZoneInPresent = false;
  @ViewChildren('parentparent') parentparent: QueryList<ElementRef>;
  toggle;
  @ViewChildren('childchild') childchild: QueryList<ElementRef>;
  @Input() resetAll: any;

  @Input() imgWidth;
  @Input() imgHeight;

  floorPlanImg;
  constructor(private dr: DroppableService, public domSan: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.onActiveFloor) {
      this.existingDroppedItemZoneIn = [];
      this.dropzone1 = [];
      this.onActiveFloorZoneIn = changes.onActiveFloor.currentValue;
    }
    if (changes.uploadFloorPlanZone) {
      this.existingDroppedItemZoneIn = [];
      this.dropzone1 = [];
      this.uploadFloorPlanZoneIn = changes.uploadFloorPlanZone.currentValue;
    }
    if (changes.noFloorZoneIn) {
      this.noFloorZoneInPresent = changes.noFloorZoneIn.currentValue;
    }
    if (changes.urlFloorZone && (changes.urlFloorZone.currentValue || changes.urlFloorZone.currentValue == '')) {
      this.urlFloorZoneIn = changes.urlFloorZone.currentValue;
      this.floorPlanImg = this.domSan.bypassSecurityTrustResourceUrl(this.urlFloorZoneIn)
    }
    if (changes.roomsFloorZone && changes.roomsFloorZone.currentValue) {
      this.roomsFloorZoneIn = [];
      this.dropzone1 = [];
      this.roomsFloorZoneIn = changes.roomsFloorZone.currentValue
    }
    if (changes.existingDroppedItem && changes.existingDroppedItem.currentValue) {
      this.existingDroppedItemZoneIn = [];
      this.existingDroppedItemZoneIn = changes.existingDroppedItem.currentValue;
    }
    if (changes.resetAll && changes.resetAll.currentValue) {
      this.removeAllZones()
    }
  }


  ngOnInit() {
    this.currentBox = this.currentBoxFloorZone;
    this.floorPlanImg = this.domSan.bypassSecurityTrustResourceUrl(this.urlFloorZoneIn);
  }

  move(box: string, toList: string[], event): void {
    this.toggle = true;
    box = this.currentBoxFloorZone;
    const objTemp: any = {
      pos: []
    };
    objTemp.dis = this.currentBoxFloorZone;
    objTemp.position = { x: event.x, y: event.y }
    objTemp.set = true;
    // tslint:disable-next-line
    for (let i = 0; i < this.topLeft.length; i++) {
      objTemp.pos.push(this.topLeft[i]);
    }
    this.removeBox(box, this.roomsFloorZoneIn);
    toList.push(objTemp);
  }

  removeBox(item: string, list, flag: boolean = false) {
    if (list.indexOf(item) !== -1) {
      list.splice(list.indexOf(item), 1);
    }
    if (flag) {
      this.floorToParent.emit(item)
    }

  }

  removeAllZones() {
    if (this.resetAll) {
      const allDroppedZone = this.existingDroppedItemZoneIn.concat(this.dropzone1);
      allDroppedZone.map(dz => this.floorToParent.emit(dz));
      this.existingDroppedItemZoneIn = [];
      this.dropzone1 = [];
    };

  }

  onDragEnd(event, b) {
    const movingBlockIndex = (this.dropzone1.indexOf(this.currentBox));
    const existingMovingBlockIndex = (this.existingDroppedItemZoneIn.indexOf(this.currentBox));

    if (movingBlockIndex > -1 || existingMovingBlockIndex > -1) {

      let container_rect;
      this.parentparent.forEach((parentdiv: ElementRef) => {
        container_rect = parentdiv.nativeElement.getBoundingClientRect();
      });

      const mouse = {
        x: null,
        y: null
      };

      this.childchild.forEach((childdiv: ElementRef) => {
        mouse.x = childdiv.nativeElement.getBoundingClientRect().left - container_rect.left;
        mouse.y = childdiv.nativeElement.getBoundingClientRect().top - container_rect.top;

        const perc_x = (mouse.x / container_rect.width) * 100;
        const perc_y = (mouse.y / container_rect.height) * 100;

        this.left = perc_x;
        this.topLeft = []
        this.topLeft.push(this.left);

        this.top = perc_y;
        this.topLeft.push(this.top);

        if (movingBlockIndex > -1) {
          childdiv.nativeElement.childNodes[1].innerText = (perc_x);
          childdiv.nativeElement.childNodes[2].innerText = (perc_y);
        } else if (existingMovingBlockIndex > -1) {
          childdiv.nativeElement.childNodes[1].innerText = (perc_x);
          childdiv.nativeElement.childNodes[2].innerText = (perc_y);
        }
      });
    }
  }
}
