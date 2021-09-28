
import { Component, Inject, OnInit, SimpleChange } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'puc-sort-order',
  templateUrl: './sort-order.component.html',
  styleUrls: ['./sort-order.component.scss']
})
export class SortOrderComponent implements OnInit {
  inputData;
  list = [];
  key;
  title = '';
  subTitle ='';
  showDelete =  false;
  deleteIconKey = 'showDelete';
  deleteObservable
  
  constructor(public dialogRef: MatDialogRef<SortOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.inputData = this.data;
    this.title = this.inputData.title;
    this.key = this.inputData.key;
    this.list = this.inputData.list;
    this.subTitle = this.inputData.subTitle;
    this.showDelete = this.inputData.showDelete;
    this.deleteObservable =  this.inputData.deleteObservable;
    this.deleteIconKey = this.inputData.deleteIconKey;
    
  }

  ngOnChanges(changes:SimpleChange) {
    this.inputData = this.data;
    this.title = this.inputData.title;
    this.key = this.inputData.key;
    this.list = this.inputData.list;
    this.subTitle = this.inputData.subTitle;
    this.showDelete = this.inputData.showDelete;
    this.deleteObservable =  this.inputData.deleteObservable;
    this.deleteIconKey = this.inputData.deleteIconKey;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.dialogRef.close(this.list);

  }

  deleteItem(item) {
    this.deleteObservable.next(item);
  }

}


