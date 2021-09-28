import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnalyticsVisBuilderComponent, Idata } from '../analytics-vis-builder/analytics-vis-builder.component';

@Component({
  selector: 'puc-analytics-vis-builder-modal',
  templateUrl: './analytics-vis-builder-modal.component.html',
  styleUrls: ['./analytics-vis-builder-modal.component.css']
})
export class AnalyticsVisBuilderModalComponent implements OnInit {

  scopedData: Idata;
  tagList;

  constructor(
    public dialogRef: MatDialogRef<AnalyticsVisBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Idata) { }

  ngOnInit(): void {
    this.tagList = this.data['taglist'];
    delete this.data['taglist'];
    this.scopedData = this.data
  }

  onDialogClosed() {
    this.dialogRef.close();
  }

}
