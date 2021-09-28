import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ObjectUtil } from '../../utils/object-util';

@Component({
  selector: 'puc-select-group-view',
  templateUrl: './select-group-view.component.html',
  styleUrls: ['./select-group-view.component.scss']
})
export class SelectGroupViewComponent implements OnInit, OnChanges {

  @ViewChild('siteSearchInput') siteSearchInputElement: ElementRef;


  @Input() defaultSelection = 'none';


  @Input() placeholder = 'Select Site';

  @Output() selectionChangeEvent: EventEmitter<any> = new EventEmitter();

  scopeSelectorForm: FormGroup;

  @Input() optionsList;

  @Input() key;
  @Input() valueKey;
  searchText;

  filteredScope = {};

  constructor(private fb: FormBuilder) {
    this.scopeSelectorForm = this.fb.group({
      scopeSelection: [this.placeholder]
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if(this.optionsList)
      this.filteredScope = ObjectUtil.deepClone(this.optionsList);
  }

  getKeys() {
    return Object.keys(this.filteredScope || {});
  }


  ngOnInit(): void {

  }


  openedChange(isOpen) {
    this.siteSearchInputElement.nativeElement.value = '';
    if (isOpen) {
      this.siteSearchInputElement.nativeElement.focus();
    }
  }

  clearSearch() {
    this.filteredScope = ObjectUtil.deepClone(this.optionsList);
  }

  handleInput(event) {
    event.stopPropagation();
  }

  filterResults() {
    if(this.searchText.trim().length) {
      this.filterBasedOnSearch(this.searchText.trim());
    } else {
      this.filteredScope = ObjectUtil.deepClone(this.optionsList);
    }
  }

  valueChanged(event) {
    this.selectionChangeEvent.emit(event.value);
  }

  filterBasedOnSearch(searchInput) {
    const tempHolder = ObjectUtil.deepClone(this.optionsList);
    Object.keys(tempHolder).map((k)=>{
      const result = tempHolder[k].filter((v)=> {
        return this.key?v[this.key].toLowerCase().includes(searchInput):v.toLowerCase().includes(searchInput)
      })

      if(result.length == 0) {
        delete tempHolder[k]
      } else {
        tempHolder[k]  = result;
      }
    });

    this.filteredScope = tempHolder;
  }

}