/* tslint:disable */
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PucOrderByPipe } from '../../pipes/puc-order-by.pipe';
import { ObjectUtil } from '../../utils/object-util';
import { SmartGroupDeleteComponent } from '../smart-group-delete/smart-group-delete.component';

@Component({
  selector: 'puc-smart-group-table',
  templateUrl: './smart-group-table.component.html',
  styleUrls: ['./smart-group-table.component.scss']
})
export class SmartGroupTableComponent implements OnInit, AfterViewInit {
  pageEvent: PageEvent;
  @Input() isFac?: boolean = false;
  @Input() columns: Array<any> = [
    {
      key: 'dis',
      label: 'Smart Groups',
      hasSort: true
    },
    {
      key: 'buildingName',
      label: 'Building Name',
      hasSort: true
    }, {
      key: 'address',
      label: 'Address',
      hasSort: true
    }, {
      key: 'ccuCount',
      label: 'No of CCUS',
      hasSort: true
    },
    {
      key: 'zoneCount',
      label: 'No of Zones',
      hasSort: true
    },
    {
      key: 'updatedAt',
      label: 'Group Last Modified',
      hasSort: true
    },
  ];
  @Input() pageType: any = 'sg';
  @Input() type: 'sg' | 'building' = 'sg';
  @Input() hasSort: boolean = true;
  @Input() hasPagination: boolean = true;
  @Input() hasSearch: boolean = true;
  @Input()
  get level(): any {
    return this._level;
  }
  set level(val: any) {
    this._level = val;
    if (this._level) {
    }

  }
  _level: any;
  originalData: any[] = [];
  @Input()
  get data(): any[] {
    return this._data;
  }
  set data(val: any[]) {
    this._data = val;

    if (val.length) {
      this.originalData = ObjectUtil.deepCopy(this._data);
    }
    if (this.pageType != 'tuners') {
      this.fillValues(this._data);
    }
  }

  @Input() onTunerLevelChange$: Subject<any>;
  _data: Array<any> = [];
  scrollCallback: any = '';
  currentPage: number = 1;
  dummyData: any = [];
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onSortChange: EventEmitter<any> = new EventEmitter();
  @Output() onScrolled: EventEmitter<any> = new EventEmitter();
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  id: any;
  @Input() searchText: any;
  constructor(
    public dialog: MatDialog,
    private _activateRoute: ActivatedRoute,
    private orderPipe: PucOrderByPipe,
    private scrollDispatcher: ScrollDispatcher
  ) {
    //  this.scrollCallback = this.getStories.bind(this);
  }

  sortData(sort: Sort) {
    const self = this;
    // const data = this.logs.slice();
    if (!sort.active || sort.direction === '') {
      // this.sortedLogs = data;
      return;
    }
    const sortParams = {
      sort: (sort.direction == 'asc') ? '-' + sort.active : sort.active
    }
    if (sort.active == 'ccuCount' || sort.active == 'zoneCount') {
      const direction = (sort.direction == 'asc') ? 'asc' : 'desc'
      self._data.forEach((_item) => {
        if (_item['children'] && Array.isArray(_item['children']) && _item['children'].length) {
          _item['children'] = self.orderPipe.transform(_item['children'], sort.active, direction)
        }
      })

    } else {
      self.onSortChange.emit(sortParams)
    }
  }
  onScroll() {
    const self = this;
    self.onScrolled.emit();
  }

  // search() {
  //     const self = this;
  //     self.onSearch.emit(self.searchText);
  // }
  async onChange(item, index, parent, event) {
    const self = this;
    item['selected'] = event.value;
    await self.toggleAllChildren(item, item['selected']);
    // const key = (item['type'] == 'building') ? 'buildings' : (item['type'] == 'ccu') ? 'ccus' : (item['type'] == 'zone') ? 'zones' : (item['type'] == 'module') ? 'modules' : '';
    const key = 'children';
    if (parent && key && parent[key] && Array.isArray(parent[key]) && parent[key].length) {
      const checkedLen = parent[key].filter((_item) => _item['selected']).length;
      if (checkedLen == 0) {
        parent['selected'] = false;
      } else if (checkedLen == parent[key].length) {
        parent['selected'] = true;
      }
    }
    self.fillValues(self._data[index]);
    self.generateCount(self._data[index]);
    if (self._data[index]['children'] && Array.isArray(self._data[index]['children'])) {
      self._data[index]['children'].forEach((_item) => {

        if (_item['children'] && Array.isArray(_item['children']) && _item['selectedChildrenCount'] > _item['children'].length) {
          _item['isUnSelectedZones'] = false;
        }
        if (_item['children'] && Array.isArray(_item['children']) && _item['selectedChildrenCount'] != _item['childrenCount']) {
          _item['isSelectedZones'] = false;
        }
      })
    }



    // item['fill'] = item['selected'] ? 100 : 0;

  }

  generateCount(obj) {
    const self = this;
    let sum = 0
    let selectedChildren = [];
    let selectedChildrenSum = 0;
    if (obj && obj['children'] && Array.isArray(obj['children'])) {
      sum = obj['children'].reduce((acc, item) => {
        return acc + item.childrenCount;
      }, 0)
      selectedChildren = obj['children'].filter((_item) => _item['selected']);
      selectedChildrenSum = selectedChildren.reduce((acc, item) => {
        return acc + item.selectedChildrenCount;
      }, 0)
    }

    const totalArrSum = (obj && obj['children'] && Array.isArray(obj['children'])) ? obj['children'].length + sum : 0;
    selectedChildrenSum = selectedChildren.length + selectedChildrenSum;
    // obj[k]['childrenCount'] = (obj[k]['childrenCount']) ? (obj[k]['childrenCount'] + totalArrSum) : totalArrSum;
    obj['childrenCount'] = totalArrSum;
    obj['selectedChildrenCount'] = selectedChildrenSum;
    if (obj['childrenCount']) {
      obj['fill'] = (obj['selectedChildrenCount'] / obj['childrenCount']) * 100;
    } else {
      if (obj['selected']) {
        obj['fill'] = 100;
      } else {
        obj['fill'] = 0;
      }
    }

    if ((obj['fill'] > 0 && obj['childrenCount'])) {
      obj['selected'] = true;
    }
    if (obj['selected'] && obj['fill'] == 0 && obj['type'] == 'system') {
      obj['fill'] = 50;
    }
  }

  fillValues(obj) {
    const self = this;
    let k,
      has = Object.prototype.hasOwnProperty.bind(obj);
    for (k in obj) if (has(k)) {
      switch (typeof obj[k]) {
        case 'object':
          this.fillValues(obj[k]);
          if (!Array.isArray(obj[k])) {
            self.generateCount(obj[k]);

          }
          break;
      }
    }

  }
  resetData(obj) {
    let k,
      has = Object.prototype.hasOwnProperty.bind(obj);
    for (k in obj) if (has(k)) {
      switch (typeof obj[k]) {
        case 'object':

          this.resetData(obj[k]);
          if (obj[k] && !Array.isArray(obj[k]) && obj[k].hasOwnProperty('isExpanded') && obj[k]['isExpanded']) {
            obj[k]['isExpanded'] = false;
          }
          if (obj[k] && !Array.isArray(obj[k]) && obj[k].hasOwnProperty('selected') && obj[k]['selected']) {
            obj[k]['selected'] = false;
            obj[k]['isSelectedZones'] = false;
            obj[k]['isUnSelectedZones'] = false;
            obj[k]['fill'] = 0;
          }

          break;
      }
    }
  }


  ngOnInit() {
    const self = this;
    if (self.onTunerLevelChange$) {
      self.onTunerLevelChange$.subscribe((_res) => {

        self.resetData(self.originalData);
        self._data = self.originalData;
      })
    }

    self.id = this._activateRoute.snapshot.paramMap.get('sgId');
  }
  toggle(item) {
    item['isExpanded'] = !item['isExpanded'];
  }
  toggleZones(item, index, val, event) {
    const self = this;
    if (val) {
      item['isSelectedZones'] = event.value;
      item['isUnSelectedZones'] = false;
    } else {
      item['isSelectedZones'] = false;
      item['isUnSelectedZones'] = event.value;
    }
    // item['toggleZones'] = !val;
    if (val && event.value) {
      item['children'].forEach((_item) => {
        _item['selected'] = true;
        if (_item['children'] && Array.isArray(_item['children'])) {
          _item['children'].forEach((_zoneItem) => {
            _zoneItem['selected'] = true;
            if (_zoneItem['children'] && Array.isArray(_zoneItem['children'])) {
              _zoneItem['children'].forEach((_zoneItem) => {
                _zoneItem['selected'] = true;
              })
            }
          })
        }
      })


    } else if ((val && !event.value) || (!val && !event.value)) {

      item['children'].forEach((_item) => {
        _item['selected'] = false;
        if (_item['children'] && Array.isArray(_item['children'])) {
          _item['children'].forEach((_zoneItem) => {
            _zoneItem['selected'] = false;
            if (_zoneItem['children'] && Array.isArray(_zoneItem['children'])) {
              _zoneItem['children'].forEach((_zoneItem) => {
                _zoneItem['selected'] = false;
              })
            }
          })
        }
      })

    } else if (!val && event.value) {
      item['children'].forEach((_item) => {
        _item['selected'] = true;
        if (_item['children'] && Array.isArray(_item['children'])) {
          _item['children'].forEach((_zoneItem) => {
            _zoneItem['selected'] = false;
            if (_zoneItem['children'] && Array.isArray(_zoneItem['children'])) {
              _zoneItem['children'].forEach((_zoneItem) => {
                _zoneItem['selected'] = false;
              })
            }
          })
        }
      })

    }
    self.fillValues(self._data[index]);
    self.generateCount(self._data[index]);

  }
  toggleCCUs(item) {
    item['ccusExpanded'] = !item['ccusExpanded'];
  }
  toggleAllChildren(obj, val) {
    return new Promise((resolve) => {
      let k,
        has = Object.prototype.hasOwnProperty.bind(obj);
      for (k in obj) if (has(k)) {
        switch (typeof obj[k]) {
          case 'object':
            this.walker(obj[k], val);
            if (!Array.isArray(obj[k])) {
              obj[k]['selected'] = val;
              obj[k]['childrenCount'] = 0;
              obj[k]['selectedChildrenCount'] = 0;
            }
            break;
        }
      }
      resolve();
    })

  }
  walker(obj, val) {
    let k,
      has = Object.prototype.hasOwnProperty.bind(obj);
    for (k in obj) if (has(k)) {
      switch (typeof obj[k]) {
        case 'object':
          this.walker(obj[k], val);
          if (!Array.isArray(obj[k])) {
            obj[k]['selected'] = val;
            obj[k]['childrenCount'] = 0;
            obj[k]['selectedChildrenCount'] = 0;
          }
          break;
      }
    }
  }
  ngAfterViewInit() {
    const self = this;
    self.scrollDispatcher.scrolled(200).subscribe(() => {
      self.onScrolled.emit();
    })
  }
  delete(data, index) {
    const self = this;
    const dialogRef = self.dialog.open(SmartGroupDeleteComponent, {
      panelClass: 'sg-delete-container',
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == 'delete') {
        self.onDelete.emit({ data: data, index: index })
      }
    });

  }


}
