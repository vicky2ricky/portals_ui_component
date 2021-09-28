declare const d3v5: any;

import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Output, SecurityContext, SimpleChange, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, interval } from 'rxjs';

import { AlertService } from '../../services/alert.service';
import { DropPoint } from '../../models/DropPoint';
import { EventEmitter } from '@angular/core';
import { FileService } from '../../services/file.service';
import { Floor } from '../../models/floor';
import { HeatmapService } from '../../services/heatmap.service';
import { ObjectUtil } from '../../utils/object-util';
import { OnChanges } from '@angular/core';
import { Shape } from '../../models/Shape';
import { SimpleChanges } from '@angular/core';
import { SiteService } from '../../services/site.service';
import { takeUntil } from 'rxjs/operators';

interface LineCoords {
  startPointX: number;
  startPointY: number;
  endPointX: number;
  endPointY: number;
}

enum KEY_CODE {
  DELETE = 46
}

const PREDEFINED_SHAPES = {
  square: {
    angles: [0, 3 / 2 * Math.PI, Math.PI],
    sideLength: 80
  },
  circle: {
    angles: [0],
    sideLength: 40
  },
  triangle: {
    angles: [5 / 3 * Math.PI, Math.PI],
    sideLength: 80
  },
  parallelogram: {
    angles: [0, 4 / 3 * Math.PI, Math.PI],
    sideLength: 80
  },
  pentagon: {
    angles: [9 / 5 * Math.PI, 14 / 10 * Math.PI, Math.PI, 3 / 5 * Math.PI],
    sideLength: 60
  },
  hexagon: {
    angles: [0, 5 / 3 * Math.PI, 4 / 3 * Math.PI, Math.PI, 2 / 3 * Math.PI],
    sideLength: 40
  }
};


function randomIdGenerator(length = 6) {
  const alphabetsOnly = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const entireSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const id = [];
  id.push(alphabetsOnly[Math.floor(Math.random() * alphabetsOnly.length)]);
  for (let i = 1 ; i < length; i ++) {
      id.push(entireSet[Math.floor(Math.random() * entireSet.length)]);
  }
  return id.join('');
}


@Component({
  selector: 'puc-planner-layout',
  templateUrl: './planner-layout.component.html',
  styleUrls: ['./planner-layout.component.scss']
})
export class PlannerLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode?;
  @Input() selectedFloorId;
  @Input() siteRef;
  @Input() url: SafeResourceUrl;
  @Input() selectedFile;
  @Input() predefinedShapeType;
  @Input() selectedRoom;
  @Input() existingZonesMapped;
  @Input() incomingFloorData?; // From heatmap
  @Input() selectedZone = '';
  @Input() selectedCCu = '';
  @Input() autoRefreshSelection = '';

  unsubscribe$: Subject<boolean> = new Subject();

  @Output() roomMappingChanged: EventEmitter<any> = new EventEmitter();

  @Output() zoneHoverOrClick = new EventEmitter();

  isFloorPlanPresent = false;

  selectedFloor: Floor;
  selectedAction: string;
  selectedColor: any;

  canvas: any;
  canvasWidth: number;
  canvasHeight: number;

  canvasThingsToKeep = new Set();

  ctx;

  svg;
  eventsArea;

  selectedDropPoints: Array<string> = [];

  shapes: Array<Shape> = [];
  filteredShapes: Array<Shape> = [];
  selectedShape: Shape;

  isbeingFiltered = false;
  isFiltered = false;
  floorPlanImage;

  @ViewChild('floorPlan') floorPlan: ElementRef;
  @ViewChild('floorCanvas') floorCanvas: ElementRef;
  @ViewChild('floorSvg') floorSvg: ElementRef;

  shapesFromResponse;

  canvasOffset = {
    x: 0,
    y: 0
  };

  // This is to identify path drags
  mouseOnPathCoords = {
    deltaX: 0,
    deltaY: 0
  };

  canvasMousedown = false;
  beginShape = false;

  floorPlanBoundingRect;
  floorCanvasBoundingRect;

  askForConfirmation = false;
  cropConfirmation = {
    title: 'Crop Image',
    msg: 'Are you sure you want to keep these changes?'
  };
  shapeDeleteConfirmation = {
    title: 'Delete Shape',
    msg: 'Are you sure you want to delete this shape?'
  };

  userConfirmationDetails: any;

  showGrid = false;

  isShiftPressed = false;
  dragHandler;

  noFloorFlag = false;
  displayOrientation = false;
  floorPlanLoader = false;

  floorRooms;
  originalRooms;

  newSelectionsExist = false;
  floorSvgId = '';

  autoRefreshSub: any;
  autoRefreshSubject = new Subject();

  zonesColored = 0;

  constructor(
    private fileService: FileService,
    private alertService: AlertService,
    private siteService: SiteService,
    private sanitizer: DomSanitizer,
    private heatmapService: HeatmapService
  ) { }

  ngOnInit() {
    this.heatmapService.getZoneColorsCalculated()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(zoneColorsData => {
        if (zoneColorsData.floorId === this.selectedFloorId) {
          console.log('zoneColorsData', zoneColorsData);
          this.changeZoneColor(zoneColorsData);

          this.zonesColored += 1;
          if (this.zonesColored === this.shapes.length) {
            if (this.selectedZone) {
              this.highlightZones(this.selectedZone, 'zone');
            } else if (this.selectedCCu) {
              this.highlightZones(this.selectedCCu, 'ccu');
            }
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.floorPlanLoader = false;
    this.noFloorFlag = false;
    const selectedCCU = changes.selectedCCu;
    const selectedZone = changes.selectedZone;
    const autoRefreshSelection = changes.autoRefreshSelection;

    const currentUrl = changes.url?.currentValue;
    if (currentUrl && this.floorCanvas && this.floorCanvas.nativeElement) {
      this.loadUrl(currentUrl);

      this.shapesFromResponse = [];
      this.existingZonesMapped = [];
      this.resetSelections();
    }

    const selectedFloorId = changes.selectedFloorId?.currentValue;
    // console.log(selectedFloorId);

    if (selectedFloorId) {
      // console.log('From within OnChanges');
      this.floorSvgId = `floorSvg-${selectedFloorId}`;
      this.selectedFloor = new Floor();
      this.floorPlanLoader = true;
      this.findAndProcessFloorPlan();
    }

    if (selectedCCU) {
      // If there is a current value & the current value not equal to the previousValue
      if ( selectedCCU?.currentValue && selectedCCU?.currentValue !== selectedCCU?.previousValue ) {
        // get all the zones with ccu id;
        this.isbeingFiltered = false;
        this.svg?.select('#coveringRect')?.remove();

        this.highlightZones(selectedCCU?.currentValue, 'ccu');

      } else {
        // removing existing filtering
        this.isbeingFiltered = false;
        this.svg?.select('#coveringRect')?.remove();

        this.filteredShapes = this.shapes;
      }
    }

    // for single zone
    if (selectedZone) {
      if (selectedZone?.currentValue && selectedZone?.currentValue !== selectedZone?.previousValue) {
        this.isbeingFiltered = false;
        this.svg?.select('#coveringRect')?.remove();

        // const connectedRoom = this.shapes.find(s => s.roomId === selectedZone?.currentValue);
        // console.log('zone', connectedRoom);

        this.highlightZones(selectedZone?.currentValue, 'zone');
      } else {
        // removing existing filtering
        this.isbeingFiltered = false;
        this.svg?.select('#coveringRect')?.remove();

        this.filteredShapes = this.shapes;
      }
    }

    // autoRefresh
    // If it is 1, then refresh now. It it is more than 1, then we set an interval, if 6 then remove the subscription.
    if (autoRefreshSelection) {
      if (autoRefreshSelection?.currentValue) {
        console.log('autoRefreshValue : ' , autoRefreshSelection);
        const autoRefreshValue = parseInt(autoRefreshSelection?.currentValue, 10);

        // Refresh now
        if (Math.abs(autoRefreshValue) === 1) {
          if (this.mode !== 'planner') {
            this.heatmapService.generateShapeColors(this.selectedFloorId, this.incomingFloorData, this.originalRooms, this.filteredShapes);
          }
        } else if (autoRefreshValue !== 6) {
          if (autoRefreshSelection?.currentValue !== autoRefreshSelection?.previousValue) {
            this.clearAutoRefresh();
            this.setAutoRefresh(autoRefreshValue);
          }
        } else {
          // If the value is 6
          this.clearAutoRefresh();
        }
      }
    } else {
      this.clearAutoRefresh();
    }
  }

  clearAutoRefresh() {
    if (this.autoRefreshSub) {
      this.autoRefreshSub.unsubscribe();
    }
  }

  setAutoRefresh(timer) {
    console.log(timer);
    if (this.mode !== 'planner') {
      this.autoRefreshSub = interval(timer * 1000).subscribe(x => {
          this.heatmapService.generateShapeColors(this.selectedFloorId, this.incomingFloorData, this.originalRooms, this.filteredShapes);
          this.autoRefreshSubject.next(true);
      });
    }
  }
  // ngAfterViewInit() {
  //   if (this.selectedFloorId) {
  //     console.log('From within After View Init');
  //     this.selectedFloor = new Floor();
  //     this.findAndProcessFloorPlan();

  //     this.floorPlanLoader = true;
  //   }
  // }


  /**
   *
   * @param url is the image url to load
   * @param initial If this is coming from other component or is coming from the call within
   */
  loadUrl(url) {
    this.noFloorFlag = false;
    this.isbeingFiltered = false;
    const imgObj = new Image();

    const urlToUse = url.startsWith('data:image') ? url : 'data:image/png;base64,' + url;
    this.selectedFloor.url = this.sanitizer.bypassSecurityTrustResourceUrl(urlToUse);

    imgObj.src = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(urlToUse));

    imgObj.onload = () => {
      this.floorPlanImage = imgObj;
      this.selectedFloor.hasPlan = true;
      this.canvasThingsToKeep.add('floorPlan');
      this.floorPlanLoader = false;
      setTimeout(() => {
        this.initializeCanvas(true);
      }, 10);
    };

    imgObj.onerror = () => {
      this.floorPlanLoader = false;
      this.noFloorFlag = true;
      console.log('Has error');
    };
  }


  initializeCanvas(newCanvas = false) {
    if (this.floorCanvas && this.floorCanvas.nativeElement) {
      this.ctx = this.floorCanvas.nativeElement.getContext('2d');
      this.canvas = this.floorCanvas.nativeElement;

      const {availableWidth, availableHeight, canvasWidth, canvasHeight} =
        this.canvasDimensionsCalculations(this.floorPlanImage);

      if (newCanvas) {
        this.ctx.clearRect(0, 0, availableWidth, availableHeight);
      }

      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;

      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;

      this.ctx.drawImage(this.floorPlanImage, 0, 0, canvasWidth, canvasHeight);

      this.floorPlanBoundingRect = this.floorPlan.nativeElement.getBoundingClientRect();
      this.floorCanvasBoundingRect = this.floorCanvas.nativeElement.getBoundingClientRect();

      // The x and y determine the starting points of these rectangles.
      // and we would be able to get a relative idea of where the canvas is starting from the edge.
      // console.log(this.floorPlanBoundingRect, this.floorCanvasBoundingRect);
      console.log(this.floorCanvasBoundingRect);
      this.setUpFloorSvg();
    }
  }


  canvasDimensionsCalculations(floorPlanImage) {
    const width = this.floorPlan.nativeElement.clientWidth;
    const height = this.floorPlan.nativeElement.clientHeight;

    let canvasWidth = width;
    let canvasHeight = height;

    const xScaleFactor = width / floorPlanImage.width;
    const yScaleFactor = height / floorPlanImage.height;

    canvasHeight = floorPlanImage.height * yScaleFactor;
    canvasWidth = floorPlanImage.width * xScaleFactor;

    return {
      availableWidth: width,
      availableHeight: height,
      canvasWidth, canvasHeight
    };
  }


  confirmUserAction(event) {
    // console.log(event);
    if (event.action === 'cancel') {
      this.resetCanvas(true);
    } else if (event.action === 'confirm' && event.type === 'shapeDelete') {
      this.deleteShape(event.id);
    }

    this.askForConfirmation = false;
  }


  resetCanvas(keepThings = false) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
    if (keepThings) {
      for (const item of this.canvasThingsToKeep.values()) {
        if (item === 'floorPlan') {
          this.ctx.drawImage(this.floorPlanImage, 0, 0, this.canvas.width, this.canvas.height);
        }
      }
    }
  }


  toggleGrid() {
    this.showGrid = !this.showGrid;
  }


  setUpFloorSvg() {
    this.svg = d3v5.select(`#${this.floorSvgId}`);
    this.svg.selectAll('g').remove();
    // const boundingRectSvg = this.svg.node().getBoundingClientRect();

    this.eventsArea = this.svg.select('#eventsArea')
      .attr('fill', 'none')
      .attr('class', 'hover-region')
      .attr('pointer-events', 'all');

    this.setUpEventHandlers();

    if (this.mode !== 'planner') {
      this.heatmapService.fetchColourScaleDeadbands().subscribe(resp => {
        this.workWithShapes();
      });
    } else {
      this.workWithShapes();
    }
  }

  workWithShapes() {
    if (this.newSelectionsExist && this.shapesFromResponse && this.shapesFromResponse.length > 0) {
        this.populateFloorWithShapes();
    } else if (!this.newSelectionsExist && this.existingZonesMapped.length > 0) {
      this.createShapesOutOfExisting(this.existingZonesMapped);
    }
  }


  setUpEventHandlers() {
    this.eventsArea
      .on('mousedown', _ => {
        const event = d3v5.event;
        event.stopPropagation();
        this.svgMousedown(event, this);
      })
      .on('contextmenu', _ => {
        const event = d3v5.event;
        event.preventDefault();
        event.stopPropagation();
        return false;
      })
      .on('dragover', _ => {
        const event = d3v5.event;
        event.stopPropagation();
        this.shapeDraggedOver(event);
      })
      .on('drop', _ => {
        const event = d3v5.event;
        event.stopPropagation();
        this.shapeDropped(event);
      });
  }


  // SVG Pointer clicks
  svgMousedown(event, self) {
    event.preventDefault();
    event.stopPropagation();

    // Custom Shape
    if (this.selectedShape) {
      this.removeReferences();
      this.selectedShape = null;
    }
  }

  // You don't draw on the drawingArea, that is more like the mouseEvents area.
  // Also it works since it would be blocking events on the drawing area.
  drawReferenceCircle(point, shapeEdit = false) {
    const group = this.selectedShape['groupCircles'];

    const circle = group
      .append('circle')
      .attr('id', point.id)
        // .attr('class', shapeEdit ? 'draggable' : '')
        .style('stroke', '#1b8ee6')
        .style('stroke-width', 2)
        .style('fill', '#fff')
        .attr('r', 4)
        .attr('cx', point.x)
        .attr('cy', point.y);

    // tslint:disable-next-line: only-arrow-functions
    circle.on('mousedown', _ => {
      const event = d3v5.event;
      event.preventDefault();
      event.stopPropagation();

      const selectedCircle = circle;
      this.selectReferencePoint(point, selectedCircle);
    });

    circle.call(d3v5.drag()
      .on('start', () => circle.raise())
      .on('drag', _ =>
        this.selectedShape && d3v5.event && !d3v5.event['ctrlKey'] && !this.beginShape && this.circleDragged(circle, d3v5.event))
      .on('end', _ => {
        const condition = this.selectedShape && d3v5.event && !d3v5.event['ctrlKey'] && !this.beginShape;
        if (condition) {
          this.circleDragEnded(circle, d3v5.event);
        }
      })
    );
  }


  selectReferencePoint(point, selectedCircle) {
    if (!this.beginShape) {
      const index = this.selectedDropPoints.indexOf(point.id);
      if (index !== -1) {
        this.selectedDropPoints.splice(index, 1);
        selectedCircle.style('fill', '#fff');
      } else {
        selectedCircle.style('fill', '#1b8ee6');
        this.selectedDropPoints.push(point.id);
      }
    } else {
      // Check for the point Id and match it against the id of the startPoint for the selectedShape
      if (point.id === this.selectedShape.startPoint.id) {
        // This is essentially an indication of closing the shape.
        const freePoint = this.selectedShape.getFreePoint();
        this.drawActualLine({startPointX: freePoint.x, startPointY: freePoint.y, endPointX: point.x, endPointY: point.y});

        this.selectedShape.addEdge(freePoint, point);
        this.beginShape = false;

        this.createTheShape(this.selectedShape.id, false);
      } else {
        // The user might be clicking on any point in the path, which means we do nothing.
      }
    }
  }


  // Drag the Circle
  circleDragged(circle, event) {
    // console.log(event);
    const newX = this.checkBoundaryConditions(event.sourceEvent?.x, event.x, 'x');
    const newY = this.checkBoundaryConditions(event.sourceEvent?.y, event.y, 'y');

    circle
      .attr('cx', newX)
      .attr('cy', newY);

    // find the neighboring options for this circle.
    const affectedDropPoints = this.selectedShape?.getNeighboringPoints(circle.attr('id')) || [];
    const runninglineCoords: Array<LineCoords> = [];

    affectedDropPoints.forEach(affectedPoint => {
      runninglineCoords.push({startPointX: affectedPoint.x, startPointY: affectedPoint.y, endPointX: newX, endPointY: newY});
    });

    this.drawInProgressLine(runninglineCoords);
  }


  // Circle Drag End
  circleDragEnded(circle, event) {
    // console.log('Circle Drag Ended');
    const newX = this.checkBoundaryConditions(event.sourceEvent?.x, event.x, 'x');
    const newY = this.checkBoundaryConditions(event.sourceEvent?.y, event.y, 'y');

    circle
      .attr('cx', newX)
      .attr('cy', newY);

    // Replace the dropPoint in the selectedShape
    if (this.selectedShape) {
      this.selectedShape.editDropPoint(circle.attr('id'), newX, newY);
      this.shapeEdit(this.selectedShape?.id, true);
    }
  }


  drawInProgressLine(runninglineCoords: LineCoords | Array<LineCoords>) {
    if (this.selectedShape) {
      const group = this.selectedShape['groupLines'];
      group.selectAll('.runningLine').remove();

      if (Array.isArray(runninglineCoords)) {
        runninglineCoords.forEach(runninglineCoord => {
          this.drawLine(group, runninglineCoord);
        });
      } else {
        this.drawLine(group, runninglineCoords);
      }
    }
  }


  drawLine(group, runninglineCoord) {
    group.append('line')
      .attr('class', 'runningLine')
      .style('stroke', 'red')
      .style('stroke-dasharray', ('3, 3'))
      .style('stroke-width', 1.5)
      .attr('x1', runninglineCoord.startPointX)
      .attr('y1', runninglineCoord.startPointY)
      .attr('x2', runninglineCoord.endPointX - 1)
      .attr('y2', runninglineCoord.endPointY - 1)
      .attr('pointer-events', 'none');
  }

  // Actual line can have click events
  drawActualLine(lineCoords: LineCoords, connectedPoints: Array<DropPoint> = []) {
    const group = this.selectedShape['groupLines'];
    group.selectAll('.runningLine').remove();

    const freePointId = this.selectedShape.getFreePoint().id;

    const line = group.append('line')
      .attr('id', freePointId)
      .attr('class', 'actualLine')
      .style('stroke', 'red')
      .style('stroke-width', 2.5)
      .attr('x1', lineCoords.startPointX)
      .attr('y1', lineCoords.startPointY)
      .attr('x2', lineCoords.endPointX)
      .attr('y2', lineCoords.endPointY);

    // connectedPoints will be > 0, only when it is editShape
    if (connectedPoints.length > 0) {
      line.on('dblclick', _ => {
        // const [x, y] = d3v5.mouse(event);
        const [x, y] = (d3v5.mouse(d3v5.event.currentTarget));
        const pointCreated = {x, y, id : randomIdGenerator(8)};
        this.selectedShape.addMidvertex(connectedPoints[0], connectedPoints[1], pointCreated);
        this.shapeEdit(this.selectedShape.id, true);
      });
    }
    // .attr('pointer-events', 'none');
  }


  deleteSelectedPoints() {
    if (this.selectedShape) {
      this.selectedShape.removeVertices(this.selectedDropPoints);
      this.shapeEdit(this.selectedShape.id, true);

      this.selectedDropPoints = [];
    }
  }


  createTheShape(shapeId, keepReference = true) {
    // Now that you have all the points, you would want to create an actual shape, and color it.
    let pathDefinition = '';

    let shapeToWorkOn = this.shapes.find(shape => shape.id === shapeId);
    if (!shapeToWorkOn) {
      shapeToWorkOn = this.filteredShapes.find(shape => shape.id === shapeId);
    }

    if (shapeToWorkOn.type === 'regular') {
      shapeToWorkOn.dropPoints.forEach((point, index) => {
        if (index === 0) {
          pathDefinition += `M ${point.x} ${point.y}`;
        } else {
          pathDefinition += ` L ${point.x} ${point.y}`;
        }
      });

      pathDefinition += 'Z';
    }

    // console.log(pathDefinition);
    if (shapeToWorkOn.hasOwnProperty('printShapeList')) {
      shapeToWorkOn.printShapeList();
    }

    const pathSvg = shapeToWorkOn.group
      .append('svg')
      .attr('x', 0)
      .attr('y', 0);

    if (this.isbeingFiltered) {
      pathSvg.attr('class', 'highlightZone');
    }

    if (shapeToWorkOn.type === 'regular') {
      pathSvg
        .append('path')
        // .attr('class', 'shapeArea')
        .attr('class',
          this.mode === 'planner' && this.selectedAction === 'move' ? 'shapeArea draggable' : 'shapeArea')
        .datum(shapeToWorkOn.id)
        .attr('d', pathDefinition)
        .style('stroke', '#d79b00')
        .style('fill', '#ffe6cc')
        .style('fill-opacity', 0.88);
    } else if (shapeToWorkOn.type === 'circle') {
      const startPoint = shapeToWorkOn.startPoint;
      const endPoint = shapeToWorkOn.dropPoints[shapeToWorkOn.dropPoints.length - 1];
      const radius = this.calculateCircleRadius(startPoint, endPoint);
      pathSvg
        .append('circle')
        // .attr('class', 'shapeArea')
        .attr('class',
          this.mode === 'planner' && this.selectedAction === 'move' ? 'shapeArea draggable' : 'shapeArea')
        .datum(shapeToWorkOn.id)
        .attr('cx', shapeToWorkOn.startPoint.x)
        .attr('cy', shapeToWorkOn.startPoint.y)
        .attr('r', radius)
        .style('stroke', '#d79b00')
        .style('fill', '#ffe6cc')
        .style('fill-opacity', 0.88);
    }

    // if (this.mode === 'planner') {
    //   this.addDeleteIcon(pathSvg, shapeToWorkOn);
    // }

    if (this.mode === 'planner') {
      this.addRoomName(pathSvg, shapeToWorkOn, {zoneNameLabelColor : '#606060'});
    }

    pathSvg
      .on('mousedown', _ => {
        const selectedId = pathSvg.select('.shapeArea').datum();
        const event = d3v5.event;
        if ((event as MouseEvent).button === 0 && this.mode === 'planner') {
          this.shapeEdit(selectedId);

        } else if ((event as MouseEvent).button === 2 && this.mode === 'planner') {
          this.deleteShapeStart(event, selectedId);

        }
      })
      .on('contextmenu', _ => {
        const event = d3v5.event;
        (event as MouseEvent).preventDefault();
        (event as MouseEvent).stopPropagation();
        return false;
      });

    if (this.mode === 'planner') {
        pathSvg.call(d3v5.drag()
          .on('start', (_) => {
            const selectedShapeId = pathSvg.select('.shapeArea').datum();
            const correspondingShape = this.shapes.find(shape => shape.id === selectedShapeId);
            this.removeReferences(correspondingShape);

            // Delta is the difference between the click point & the start point
            this.mouseOnPathCoords = {
              deltaX: d3v5.event['x'] - correspondingShape.startPoint.x,
              deltaY: d3v5.event['y'] - correspondingShape.startPoint.y
            };
          })
          .on('drag', (_) => this.pathDragged(pathSvg, d3v5.event))
          .on('end', (_) => this.pathDragEnded(pathSvg, d3v5.event))
        );
    }

    // Also in the process, remove all the points and delete all lines between them.
    this.removeReferences();

    // this.selectedShape.printShapeList();
    if (!keepReference) {
      this.selectedShape = null;
    }

    this.beginShape = false;
    if (this.mode !== 'planner') {
      pathSvg
      .on('click', event => {
        const shape: any = this.filteredShapes.find(s => s.id == shapeId);
        const zone = this.originalRooms.find(room => room && (room.id === shape.roomId));
        this.zoneHoverOrClick.emit({
          zone,
          id: shapeId,
          ccuId: shape.ccuId,
          type: 'click'
        });
      });

      pathSvg
      .on('mouseenter', event => {
        const shape: any = this.filteredShapes.find(s => s.id == shapeId);
        const zone = this.originalRooms.find(room => room && (room.id === shape.roomId));
        this.zoneHoverOrClick.emit({
          zone,
          id: shapeId,
          ccuId: shape.ccuId,
          type: 'hover'
        });
      });

      pathSvg
      .on('mouseleave', event => {
        const shape: any = this.filteredShapes.find(s => s.id == shapeId);
        const zone = this.originalRooms.find(room => room && (room.id === shape.roomId));
        this.zoneHoverOrClick.emit({
          zone,
          id: shapeId,
          ccuId: shape.ccuId,
          type: 'leave'
        });
      });

    }
  }


  calculateCircleRadius(startPoint, endPoint) {
    const radius =
      Math.round(
        Math.sqrt(
          (Math.pow(Math.abs(endPoint.x - startPoint.x), 2)) +
          (Math.pow(Math.abs(endPoint.y - startPoint.y), 2))
        )
      );
      return radius;
  }

  /**
   * Add a new group to the floor which has a rect which will have a blackish fill with opacity and
   * then draw the shapes again on top of that.
   * @param shapesList shapes to highlight
   */
  highlightZones(value, type) {
    if (this.svg && !this.isbeingFiltered && value) {
      // Set a flag here to check if is already highlighted.
      const coveringGroup = this.svg.append('g')
      .attr('id', 'coveringRect');

      const connectedRooms = this.shapes.filter(s => s[type === 'ccu' ? 'ccuId' : 'roomId'].includes(value));
      console.log('zones Connected Rooms', connectedRooms);

      const shapesToRedraw = connectedRooms.map(shape => {
        const _dropPoints = shape.dropPoints.map(dropPoint => {
          const _dropPoint: DropPoint = {
            id : dropPoint.id,
            x : dropPoint.x,
            y: dropPoint.y
          };
          return _dropPoint;
        });
        return {
          id: randomIdGenerator(8),
          roomId: shape.roomId,
          type: shape.type,
          dropPoints: _dropPoints
        };
      });

      coveringGroup.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('fill', '#606060')
        .style('fill-opacity', 0.7);

      this.isbeingFiltered = true;

      if (connectedRooms.length > 0) {
        // Redraw these shapes
        this.populateFloorWithShapes(shapesToRedraw, coveringGroup, true);
      }
    }
  }


  addDeleteIcon(pathSvg, shape) {
    const {topY, bottomY, leftX, rightX} = this.getPathBoundaries(shape);

    const deleteIconCoords = {
      x : leftX + (rightX - leftX) * .8,
      y: topY + (bottomY - topY) * .2
    };

    // add a delete icon
    const deleteIcon = pathSvg
      .append('text')
      .datum( shape.id )
      .attr('x', deleteIconCoords.x)
      .attr('y', deleteIconCoords.y)
      .attr('class', 'fa deleteIcon')
      .attr('font-size', '16px')
      .text('\uf1f8')
      .style('fill', '#606060');

    deleteIcon
      .on('mousedown', d => {
        const event = d3v5.event;
        this.deleteShapeStart(event, d);
      });
  }


  addRoomName(pathSvg, shape, colorData) {
    const {topY, bottomY, leftX, rightX} = this.getPathBoundaries(shape);

    const textCoords = {
      x : (leftX + rightX) / 2,
      y: (topY + bottomY) / 2
    };

    const zoneName = shape.roomName || (this.originalRooms.find(zone => zone && (zone.id === shape.roomId)) || {}).dis;
    const onlineStatus = colorData.online ?? false;

    pathSvg.selectAll('text')?.remove();
    pathSvg.selectAll('.onlineStatus')?.remove();

    if (this.mode !== 'planner') {
      const radius = 6;
      pathSvg.append('circle')
        .attr('class', onlineStatus ? 'onlineStatus isOnline' : 'onlineStatus isOffline')
        .attr('r', radius)
        .attr('cx', textCoords.x)
        .attr('cy', textCoords.y - radius * 3.5);
    }

    const zoneTextElement = pathSvg
      .append('text')
      .attr('x', textCoords.x)
      .attr('y', textCoords.y)
      .attr('text-anchor', 'middle')
      .attr('class', 'zoneName')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text( zoneName )
      .style('fill', colorData.zoneNameLabelColor ?? '#FFF');

    const lastYPosToAdd = this.wrap(zoneTextElement, rightX - leftX - 8);
    console.log(lastYPosToAdd);

    // Add the temp labels to zoneTextElement
    if (this.mode !== 'planner') {
      const tempLabelWord = pathSvg.append('text')
        .attr('x', textCoords.x)
        .attr('y', lastYPosToAdd)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .style('fill', colorData.zoneNameLabelColor ?? '#FFF');

      tempLabelWord.append('tspan').style('fill', colorData.currentTempLabelColor).text(colorData.currentTemp);
      if (colorData.desiredTempHeating) {
        tempLabelWord.append('tspan').style('fill', colorData.partitionColor).text(' | ');
        tempLabelWord.append('tspan').style('fill', colorData.heatingDesiredLabelColor).text(colorData.desiredTempHeating);
      }

      if (colorData.desiredTempCooling) {
        tempLabelWord.append('tspan').style('fill', colorData.partitionColor).text(' | ');
        tempLabelWord.append('tspan').style('fill', colorData.coolingDesiredLabelColor).text(colorData.desiredTempCooling);
      }
    }
  }


  deleteShapeStart(event, selectedId) {
    event.stopPropagation();
    event.preventDefault();
    this.userConfirmationDetails = {
      type: 'shapeDelete',
      id: selectedId,
      title: this.shapeDeleteConfirmation.title,
      msg: this.shapeDeleteConfirmation.msg
    };
    this.askForConfirmation =  true;
    return false;
  }

  // Drag the Path
  pathDragged(pathSvg, event) {
    // console.log('Dragging');
    const {x, y} = event;
    // console.log(x, y);

    const shapeId = pathSvg.select('.shapeArea').datum();
    const correspondingShape = this.shapes.find(shape => shape.id === shapeId);

    // Now the change
    const dx = event.x - correspondingShape.startPoint.x - this.mouseOnPathCoords.deltaX;
    const dy = event.y - correspondingShape.startPoint.y - this.mouseOnPathCoords.deltaY;

    pathSvg
      .attr('x',  dx)
      .attr('y', dy);
  }


  // Path Drag End
  pathDragEnded(pathSvg, event) {
    // console.log('DragEnd');

    // Get the current transformation of the pathSvg
    const x = pathSvg.attr('x');
    const y = pathSvg.attr('y');

    const shapeId = pathSvg.select('.shapeArea').datum();
    const correspondingShape = this.shapes.find(shape => shape.id === shapeId);

    correspondingShape.translatePoints(x, y);
    this.shapeEdit(shapeId, true);
  }


  shapeEdit(selectedId, onPointEdit = false) {
    // i.e you had selected a shape and now you want to select a different shape
    if ((this.selectedShape && selectedId !== this.selectedShape?.id) || onPointEdit) {
      // for the current selectedShape, remove the lines and circles group.
      this.removeReferences();
      this.selectedDropPoints = [];
    }

    this.selectedShape = this.shapes.find(shape => shape.id === selectedId);

    if (onPointEdit) {
      // create a new path, having removed the old path, since the old path has a color
      this.selectedShape.group.select('svg').remove();
      this.createTheShape(this.selectedShape.id);
    }

    this.selectedShape['groupLines'] = this.selectedShape.group.append('g').attr('id', 'lines');
    this.selectedShape['groupCircles'] = this.selectedShape.group.append('g').attr('id', 'circles');

    this.selectedShape.dropPoints.forEach((dropPoint, index) => {
      this.drawReferenceCircle(dropPoint, true);

      if (index > 0) {
        // draw a line from the previous point to this point.
        const previousPoint = this.selectedShape.dropPoints[index - 1];
        this.drawActualLine({startPointX: previousPoint.x, startPointY: previousPoint.y,
          endPointX: dropPoint.x, endPointY: dropPoint.y}, [previousPoint, dropPoint]);
      }
    });

    // and finally draw a line from the end point to the first one.
    const lastPoint = this.selectedShape.dropPoints[this.selectedShape.dropPoints.length - 1];
    if (lastPoint) {
      this.drawActualLine({startPointX: lastPoint.x, startPointY: lastPoint.y,
        endPointX: this.selectedShape.startPoint.x, endPointY: this.selectedShape.startPoint.y},
        [lastPoint, this.selectedShape.startPoint]);
    }
  }


  deleteShape(shapeId) {
    // If you are drawing a shape and you just did a right Click, discard the entire thing
    this.svg.select(`#${shapeId}`)?.remove();
    // const mappedRoomId = this.selectedShape.roomId;

    if (this.selectedShape) {
      this.removeReferences();
      this.selectedShape = null;
    }

    const shapeBeingDeleted = this.shapes.find(shape => shape.id === shapeId);
    this.shapes = this.shapes.filter(shape => shape.id !== shapeId);
    this.beginShape = false;

    // Also emit an Output event with the id of the room and type remove.
    this.roomMappingChanged.emit({roomId: shapeBeingDeleted.roomId, action: 'removed'});
  }


  // Remove SelectedShape lines and circles
  removeReferences(shape = null) {
    const shapeToWorkOn = shape || this.selectedShape;
    if (shapeToWorkOn) {
      shapeToWorkOn.group.selectAll('#lines').remove();
      shapeToWorkOn.group.selectAll('#circles').remove();

      delete shapeToWorkOn['groupLines'];
      delete shapeToWorkOn['groupCircles'];
    }
  }


  getPathBoundaries(selectedShape) {
    const xCoordsList = [];
    const yCoordsList = [];
    selectedShape.dropPoints.forEach(dropPoint => {
      xCoordsList.push(dropPoint.x);
      yCoordsList.push(dropPoint.y);
    });

    // x increases horizontally, whereas y increases vertically. So to find the top right - find the max in x, but min in y
    if (selectedShape.type === 'regular') {
      const topY = Math.min(...yCoordsList);
      const bottomY = Math.max(...yCoordsList);

      const leftX = Math.min(...xCoordsList);
      const rightX = Math.max(...xCoordsList);

      return {topY, bottomY, leftX, rightX};

    } else if (selectedShape.type === 'circle') {
      const startPoint = selectedShape.startPoint;
      const endPoint = selectedShape.dropPoints[selectedShape.dropPoints.length - 1];
      const radius = this.calculateCircleRadius(startPoint, endPoint);

      const topY = startPoint.y - radius;
      const bottomY = startPoint.y + radius;

      const leftX = startPoint.x - radius;
      const rightX = startPoint.x + radius;

      return {topY, bottomY, leftX, rightX};
    }
  }


  changeZoneColor(colorData) {
    this.filteredShapes.forEach(shape => {
      if (shape.roomId.includes(colorData.currentRoomRef)) {
        shape['ccuId'] = colorData.ccuId;
        shape['ccuName'] = colorData.ccuName;

        const shapeArea = shape.group.select('.shapeArea');
        const svg = shape.group.select('svg');
        svg.selectAll('defs').remove();

        const svgDefs = svg.append('defs');

        const mainPattern = svgDefs.append('pattern')
          .attr('id', 'linear' + shape.id)
          .attr('width', 10)
          .attr('height', 4)
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('patternTransform', 'rotate(45 50 50)');

        mainPattern.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 50)
          .attr('fill', colorData.tempColorToInsert);

        mainPattern.append('line')
          .attr('stroke', colorData.strokeColor)
          .attr('stroke-width', '8px')
          .attr('y2', 10);


        const url = '#linear' + shape.id;
        shapeArea
          .style('fill', `url(${url})`)
          .style('stroke', colorData.ccuColor)
          .style('stroke-width', 2);

        const shapeSvg = shape.group.select('svg');
        this.addRoomName(shapeSvg, shape, colorData);
      }
    });
  }


  createPredefinedShape(startX, startY, angles, sideLength, shapeType = 'regular') {
    const id = randomIdGenerator(8);
    const roomName = (this.originalRooms.find(room => room && (room.id === this.selectedRoom.id)) || {}).dis || 'N.A';
    const newShape = new Shape(id, shapeType, this.svg.append('g').attr('id', id), this.selectedRoom.id, roomName);
    // set the dropPoints and adjacencyList

    const pointCreated = {x: startX, y: startY, id : randomIdGenerator(8)};
    newShape.addVertex(pointCreated, true);

    // Now we use the angle and the length to calculate the next point, from the freePoint and do this for sides-1 times
    angles.forEach(angle => {
      const freePoint = newShape.getFreePoint();
      const dataToAdd = {addToX: sideLength * Math.cos(angle), addToY: sideLength * Math.sin(angle)};
      const newPoint = {
        x: freePoint.x + dataToAdd.addToX,
        y: freePoint.y - dataToAdd.addToY,
        id : randomIdGenerator(8)
      };

      // console.log(newPoint);
      newShape.addEdge(freePoint, newPoint);
    });

    newShape.addEdge(newShape.getFreePoint(), newShape.getStartPoint());

    this.selectedShape = newShape;
    this.shapes.push(newShape);

    this.createTheShape(newShape.id);
  }


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);

    // tslint:disable-next-line: deprecation
    if (event.keyCode === KEY_CODE.DELETE) {
      this.deleteSelectedPoints();
    }
  }


  @HostListener('window:click', ['$event'])
  mouseClickEvent(event: MouseEvent) {
    if (event.target['id'] === 'floorplan') {
      this.removeReferences();
      this.selectedShape = null;
    }
  }


  shapeDropped(event) {
    event.preventDefault();
    // console.log(event.target);

    const pointerInsideZone = event.dataTransfer.getData('text/plain');
    // console.log(pointerInsideZone);

    if (event.target && event.target.id === 'eventsArea') {
      const [x, y] = (d3v5.mouse(event.currentTarget));
      let startPointX = x;
      let startPointY = y;

      try {
        if (pointerInsideZone) {
          const value = JSON.parse(pointerInsideZone);
          startPointX = startPointX - value.x;
          startPointY = startPointY - value.y;
        }
      } catch (err) {

      }

      if (this.predefinedShapeType) {
        if (this.selectedShape) {
          this.removeReferences();
          this.selectedShape = null;
        }

        this.createPredefinedShape(
          startPointX, startPointY,
          PREDEFINED_SHAPES[this.predefinedShapeType].angles,
          PREDEFINED_SHAPES[this.predefinedShapeType].sideLength,
          this.predefinedShapeType === 'circle' ? 'circle' : 'regular');

        // Also emit an Output event with the id of the room and type add.
        this.roomMappingChanged.emit({roomId: this.selectedRoom.id, action: 'added'});
      }
    }
  }

  shapeDraggedOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }


  wrap(zoneTextElement, width) {
    const words = zoneTextElement?.text().split(/\s+/).reverse() || [];
    const lineHeight = 16;
    const y = parseFloat(zoneTextElement.attr('y'));
    const x = zoneTextElement.attr('x');
    const anchor = zoneTextElement.attr('text-anchor');

    let tspan = zoneTextElement.text(null).append('tspan').attr('x', x).attr('y', y).attr('text-anchor', anchor);
    let lineNumber = 0;
    let line = [];
    let word = words.pop();

    let yPosition = y;

    while (word) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
            lineNumber += 1;
            line.pop();
            tspan.text(line.join(' '));
            line = [word];

            yPosition = y + lineNumber * lineHeight;
            tspan = zoneTextElement.append('tspan').attr('x', x).attr('y', yPosition).attr('anchor', anchor).text(word);
        }
        word = words.pop();
    }

    return yPosition + lineHeight;
  }


  checkBoundaryConditions(sourceEventValue, value, type) {
    // console.log(this.floorCanvasBoundingRect, sourceEventValue, value, type);
    let constrainedValue = value;
    if (type === 'x') {
      if (sourceEventValue <= this.floorCanvasBoundingRect.left ) {
        constrainedValue = 2;
      } else if (sourceEventValue >= this.floorCanvasBoundingRect.right) {
        constrainedValue = this.floorCanvasBoundingRect.width - 2;
      }
    } else if (type === 'y') {
      if (sourceEventValue <= this.floorCanvasBoundingRect.top ) {
        constrainedValue = 2;
      } else if (sourceEventValue >= this.floorCanvasBoundingRect.bottom) {
        constrainedValue = this.floorCanvasBoundingRect.height - 2;
      }
    }

    return constrainedValue;
  }


  processSelections() {
    const response = {
      formData: null,
      selectionsMade: null
    };

    const boundaryArea = this.floorCanvasBoundingRect;
    const saveShapes = this.shapes.map(shape => {
      const _dropPoints = shape.dropPoints.map(dropPoint => {
        const _dropPoint: DropPoint = {
          id : dropPoint.id,
          x : dropPoint.x / boundaryArea.width * 100,
          y: dropPoint.y / boundaryArea.height * 100
        };
        return _dropPoint;
      });
      return {
        id: shape.id,
        roomId: shape.roomId,
        type: shape.type,
        dropPoints: _dropPoints
      };
    });

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('floorMapImage', this.selectedFile);
      response.formData = formData;

    } else if (!this.newSelectionsExist) {
      // Then the old image needs to be persisted, which is in the this.url
      const file = this.dataURLtoFile(this.url, 'tempFile.png');
      // console.log(file);

      formData.append('floorMapImage', file);
      response.formData = formData;
    }

    const selectionsMade: any = {};
    selectionsMade.shapes = saveShapes;
    selectionsMade.enclosingDimensions = this.floorPlanBoundingRect;
    selectionsMade.floorDimensions = this.floorCanvasBoundingRect;
    selectionsMade.name = this.selectedFloorId;
    selectionsMade.index = 0;
    response.selectionsMade = selectionsMade;

    // this.selectedFloor.floorMapImage = this.floorPlanImage;
    // this.selectedFloor.url = this.canvas.toDataURL();
    return response;
  }


  saveSelections(siteRef, orientationangle) {
    const selections = this.processSelections();
    if (selections.selectionsMade) {
      selections.selectionsMade['orientation'] = orientationangle;
    }

    if (selections.formData) {
      this.fileService.saveSelections(siteRef, this.selectedFloorId, selections.formData).subscribe(
        __filename => {
          if (selections.selectionsMade) {
            this.fileService.saveSelections(siteRef, this.selectedFloorId, selections.selectionsMade).subscribe(
              _ => {
                this.alertService.success('Floor Plan changes have been saved successfully.');
            }, err => {
              this.alertService.error('There was a problem saving the floor Plan changes. Please try again.');
            });
          }
        }
      );
    } else {
      if (selections.selectionsMade) {
        this.fileService.saveSelections(siteRef, this.selectedFloorId, selections.selectionsMade).subscribe(
          _ => {
            this.alertService.success('Floor Plan changes have been saved successfully.');
        }, err => {
          this.alertService.success('There was a problem saving the floor Plan changes. Please try again.');
        });
      }
    }
  }


  // For newer selections
  getSelections() {
    this.newSelectionsExist = false;
    this.fileService.getSelections(this.siteRef, this.selectedFloorId).subscribe(
      response => {
          console.log('Selections :', response);
          if (response && response.floorMapImage && response.floorMapImage !== '') {
            this.newSelectionsExist = true;
            if (response.shapes && Array.isArray(response.shapes) && response.shapes.length > 0) {
              this.shapesFromResponse = response.shapes;
            }
            this.loadUrl(response.floorMapImage);
          }

          if (!this.newSelectionsExist) {
            this.getExistingFloorPlan();
          }
          this.beginShape = false;
      }, err => {
        this.getExistingFloorPlan();
      });
  }

  resetSelections() {
    this.shapes.forEach(shape => {
      this.deleteShape(shape.id);
    });
  }


  getExistingFloorPlan() {
    this.fileService.getFileAsText(this.siteRef, this.selectedFloorId).subscribe(
      existingData => { // Success
          if (existingData) {
            this.processExistingData(existingData);
            this.loadUrl(this.url);
          }
      }, err => {
        this.noFloorFlag = true;
      });
  }


  findAndProcessFloorPlan() {
    // First thing would be get a list of all the rooms of the floor.
    this.noFloorFlag = false;
    this.siteService.getFloorRooms(this.selectedFloorId).subscribe(({ rows }) => {
      this.floorRooms = rows;
      this.originalRooms = ObjectUtil.deepCopy(rows);

      // Check for new data first
      this.getSelections();
    });
  }


  /**
   *
   * @param existingData
   * Sets the url to load & the list of existing zones that are mapped.
   */
  processExistingData(existingData) {
    this.existingZonesMapped = [];
    this.displayOrientation = true;

    try {
        this.url = existingData.split('url(&quot;')[1].split('&quot;)')[0];
        existingData = existingData.replace(/&quot;/g, '');
        const inputData = existingData;
        const floorPlanContainer = document.createElement('div');
        floorPlanContainer.innerHTML = inputData;

        // this.getFloorPlanDimensions();
        floorPlanContainer.querySelectorAll('div div div')
            .forEach(d => {
                if (d.childNodes.length > 0) {
                    const filteredzone = this.floorRooms.filter(element => {
                        if (element.id.split(' ')[0] == d.id.split(' ')[0]) { return element; }
                    })[0];
                    if (filteredzone) {
                        const objTemp: any = {
                            spans: []
                        };
                        objTemp.main = d.childNodes[0].textContent = filteredzone.dis.trim();
                        objTemp.zoneId = filteredzone.id.split(' ')[0];
                        d.querySelectorAll('span').forEach(span => {
                            const s = Math.abs(parseFloat(span.textContent.trim()));
                            if (s || s == 0) {
                                objTemp.spans.push(s);
                            }
                        });
                        this.existingZonesMapped.push(objTemp);
                    }
                }
            });
        console.log('ExistingZonesMapped : ', this.existingZonesMapped);
    } catch (err) {
        console.log(err);
    }
  }


  populateFloorWithShapes(shapesList = null, parentElement?, alreadyProcessed = false) {
      shapesList = shapesList ?? this.shapesFromResponse ?? [];
      parentElement = parentElement ?? this.svg;

      const _shapes = shapesList.map(shape => {
        // create a new Shape object and populate the values
        const roomName = (this.originalRooms.find(room => room && (room.id === shape.roomId)) || {}).dis || 'N.A';
        const newShape = new Shape(shape.id, shape.type, parentElement.append('g').attr('id', shape.id), shape.roomId, roomName);
        // set the dropPoints and adjacencyList
        shape.dropPoints.forEach((dropPoint, index) => {
          // First change the dropPoint to values, since that would be in percentage.
          let _dropPoint: DropPoint = {
            id: dropPoint.id,
            x: (dropPoint.x / 100 * this.floorCanvasBoundingRect.width),
            y: (dropPoint.y / 100 * this.floorCanvasBoundingRect.height)
          };
          if (alreadyProcessed) {
            _dropPoint = {
              id: dropPoint.id,
              x: dropPoint.x,
              y: dropPoint.y
            };
          }

          if (index === 0) {
            newShape.addVertex(_dropPoint, true);
          } else {
            const freePoint = newShape.getFreePoint();
            newShape.addEdge(freePoint, _dropPoint);
          }
        });

        newShape.addEdge(newShape.getFreePoint(), newShape.getStartPoint());
        newShape.printShapeList();
        return newShape;
      });

      if (!alreadyProcessed) {
        this.shapes = _shapes;
        this.filteredShapes = _shapes;
      } else {
        this.filteredShapes = _shapes;
      }
      console.log(_shapes);

      _shapes.forEach(shape => {
        this.createTheShape(shape.id);
        console.log('shape Created');
        this.roomMappingChanged.emit({roomId: shape.roomId, zoneInfo: shape, floorId: this.selectedFloorId, action: 'added'});
        // The zone Info would have the zoneId and name
      });

      if (this.mode !== 'planner') {
        this.heatmapService.generateShapeColors(this.selectedFloorId, this.incomingFloorData, this.originalRooms, _shapes);
      }
  }


  /**
   * Type
   * main: "VAV Zone1"
    spans: Array(4)
      0: 17.23806793816273
      1: 17.0625
      2: 33.44000091552735
      3: 17.94403223087499
    length: 4
    __proto__: Array(0)
    zoneId: "r:5fc0ce7eaea0342ec29821d7"
    The first span is x and the second is y - 4th is width and the 3rd is height. and the values are all in percent.
   */
  createShapesOutOfExisting(existingZones) {
    existingZones.forEach(zone => {
      const id = randomIdGenerator(8);
      const roomName = (this.originalRooms.find(room => room && (room.id === zone.zoneId)) || {}).dis || 'N.A';
      const newShape = new Shape(id, 'regular', this.svg.append('g').attr('id', id), zone.zoneId, roomName);
      // set the dropPoints and adjacencyList

      // console.log(this.floorCanvasBoundingRect);
      const availableWidth = this.floorCanvasBoundingRect.width;
      const availableHeight = this.floorCanvasBoundingRect.height;

      const valuesInPx = {
        x: zone.spans[0] / 100 * availableWidth,
        y: zone.spans[1] / 100 * availableHeight,
        width: zone.spans[3] / 100 * availableWidth,
        height: zone.spans[2] / 100 * availableHeight
      };

      const pointCreated = {x: valuesInPx.x, y: valuesInPx.y, id : randomIdGenerator(8)};
      newShape.addVertex(pointCreated, true);

      const angles = PREDEFINED_SHAPES.square.angles;
      angles.forEach((angle, index) => {
        const freePoint = newShape.getFreePoint();
        const sideLength = index === 0 || index === 2 ? valuesInPx.width : valuesInPx.height;
        const dataToAdd = {addToX: sideLength * Math.cos(angle), addToY: sideLength * Math.sin(angle)};
        const newPoint = {
          x: freePoint.x + dataToAdd.addToX,
          y: freePoint.y - dataToAdd.addToY,
          id : randomIdGenerator(8)
        };

        // console.log(newPoint);
        newShape.addEdge(freePoint, newPoint);
      });

      newShape.addEdge(newShape.getFreePoint(), newShape.getStartPoint());

      this.shapes.push(newShape);
      this.createTheShape(newShape.id);

      this.roomMappingChanged.emit({roomId: zone.zoneId, zoneInfo: newShape, floorId: this.selectedFloorId, action: 'added'});
      // The zone Info would have the zoneId and name
    });

    if (this.mode !== 'planner') {
      this.filteredShapes = this.shapes;
      this.heatmapService.generateShapeColors(this.selectedFloorId, this.incomingFloorData, this.originalRooms, this.shapes);
    }
  }


  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while ( n-- ) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }


  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();

    if (this.autoRefreshSub) {
      this.autoRefreshSub.unsubscribe();
    }
  }
}
