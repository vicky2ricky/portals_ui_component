import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'puc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableData?: any = [];
  @Input() tableHead?: any = [];
  // tslint:disable-next-line
  @Input() tableWidth: string = '90%';
  @Output() rowClicked: any = new EventEmitter();

  objectKeys = Object.keys;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const table: SimpleChange = changes.table;
    const tableHead: SimpleChange = changes.tableHead;

    if (table) {
      this.tableData = table.currentValue;
      this.tableHead = tableHead.currentValue;
    }
  }

  onRowClicked(row: any) {
    console.log(row);
    this.rowClicked.emit(row);
  }
}
