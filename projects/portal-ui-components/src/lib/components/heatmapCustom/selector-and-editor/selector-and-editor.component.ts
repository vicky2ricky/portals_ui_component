import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'puc-selector-and-editor',
  templateUrl: './selector-and-editor.component.html',
  styleUrls: ['./selector-and-editor.component.scss']
})
export class SelectorAndEditorComponent implements OnInit, OnChanges {

  @Input() selections;
  @Input() identifierField;

  @Output() selectionChanged: EventEmitter<any> = new EventEmitter();
  @Output() nameChanged: EventEmitter<any> = new EventEmitter();
  @Output() deleteSelected: EventEmitter<any> = new EventEmitter();
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();

  selectedEntity;

  editing = false;
  existingSelectedEntityName: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selections && changes.selections.currentValue) {
      this.editing = false;
      this.selectedEntity = null;
    }
  }

  changeSelection(entity) {
    this.selectedEntity = cloneDeep(entity.value);
    this.selectionChanged.emit(entity.value);
  }

  editSelectionName(event) {
    event.stopPropagation();

    this.editing = true;
    this.existingSelectedEntityName = this.selectedEntity.name;
  }

  discardNameEdit(event) {
    this.editing = false;
  }

  saveNameEdit(enteredName) {
    this.selectedEntity.name = enteredName;

    // change the details on the dropdown as well
    this.selections = this.selections.map(selection => {
      if (selection[this.identifierField] === this.selectedEntity[this.identifierField]) {
        selection.name = enteredName;
      }
      return selection;
    });

    this.editing = false;
    this.nameChanged.emit(enteredName);
  }


  selectionDelete(event) {
    event.stopPropagation();
    this.deleteSelected.emit(false);
  }


  dialogClose() {
    this.closeDialog.emit();
  }

}
