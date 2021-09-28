import { Component, Inject, OnInit } from '@angular/core';
/* tslint:disable */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../override-priority/override-priority.component';

@Component({
  selector: 'puc-smart-group-delete',
  templateUrl: './smart-group-delete.component.html',
  styleUrls: ['./smart-group-delete.component.scss']
})
export class SmartGroupDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<SmartGroupDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

