import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  forwardRef
} from '@angular/core';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'puc-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropdownComponent),
      multi: true
    }
  ]
})
export class SelectDropdownComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  get data(): any[] {
    return this.list;
  }
  set data(val: any[]) {
    this.list = val || [];
    this.isSearching = false;
    this.filterResults();
  }
  @Input()
  get checkPrimary() {
    return this._checkPrimary;
  }
  set checkPrimary(val) {
    this._checkPrimary = val;
  }
  // Whatever name for this (selectedValue) you choose here, use it in the .html file.
  public get selectedValue(): string { return this._value; }
  public set selectedValue(v: string) {
    if (v !== this._value) {
      this._value = v;
      if (!v) {
        this.selectedValues = [];
      }
      this.onChange(v);
    }
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    // // Debounce search.
    // this.searchUpdate.pipe(
    //   takeUntil(this._onDestroy),
    //   debounceTime(400),
    //   distinctUntilChanged())
    //   .subscribe(value => {
    //     if (this.remoteFilter) {
    //       this.filterMode.emit({
    //         searchText: this.searchText
    //       });
    //     }
    //     this.filterResults();

    //   });
  }
  /** Label of the search placeholder */
  @Input() placeholderLabel = 'Select';

  /** Label to be shown when no entries are found. Set to null if no message should be shown. */
  @Input() noEntriesFoundLabel = 'No results found';

  @Input() multiSelect = false;
  @Input() remoteFilter = false;

  @Input() searchInExistingList?= true;
  @Input() searchingLabel?= 'Searching ...';
  list: Array<any> = [];

  @Input() displayKey = '';
  @Input() valueKey = '';
  @Input() isRequired: boolean;
  @Input() disabled: boolean;
  @Input() search = true;
  _checkPrimary = false;
  @Input() primaryKey = 'hasPrimary';

  @Output() valueChanged = new EventEmitter();

  /** Reference to the search input field */
  @ViewChild('searchSelectInput', { read: ElementRef, static: true }) searchSelectInput: ElementRef;
  /** Reference to the search input field */
  @ViewChild('selectDropdown', { static: true }) matSelect: MatSelect;
  @Output() filterMode: EventEmitter<any> = new EventEmitter();

  private _value: string;



  /** Reference to the MatSelect options */
  public _options: QueryList<MatOption>;

  searchUpdate = new Subject<string>();



  /** Whether the backdrop class has been set */
  private overlayClassSet = false;

  /** Event that emits when the current value changes */
  private change = new EventEmitter<string>();

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  /** list filtered by search keyword for multi-selection */
  public filteredList = [];

  selectedValues = [];
  searchText = '';

  isSearching = false;

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectedValue = value;

  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  ngOnInit() {
   
    // set custom panel class
    const panelClass = 'mat-select-search-panel';
    if (this.matSelect.panelClass) {
      if (Array.isArray(this.matSelect.panelClass)) {
        this.matSelect.panelClass.push(panelClass);
      } else if (typeof this.matSelect.panelClass === 'string') {
        this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
      } else if (typeof this.matSelect.panelClass === 'object') {
        this.matSelect.panelClass[panelClass] = true;
      }
    } else {
      this.matSelect.panelClass = panelClass;
    }

    // Debounce search.
    this.searchUpdate.pipe(
      takeUntil(this._onDestroy),
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        if (this.remoteFilter) {
          this.filterMode.emit({
            searchText: this.searchText
          });
        }

        if (this.searchInExistingList) {
          this.filterResults();
        } else {
          if (this.remoteFilter) {
            this.isSearching = true;
          }
        }

      });

    // when the select dropdown panel is opened or closed
    this.matSelect.openedChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe((opened) => {
        if (opened) {
          // focus the search field when opening
          this._focus();
        } else {
          // clear it when closing
          this._reset();

          this.valueChanged.emit(this.selectedValues);
        }
      });

    // set the first item active after the options changed
    this.matSelect.openedChange
      .pipe(take(1))
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._options = this.matSelect.options;
        this._options.changes
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            const keyManager = this.matSelect._keyManager;
            if (keyManager && this.matSelect.panelOpen) {
              // avoid "expression has been changed" error
              // setTimeout(() => {
              //     keyManager.setFirstItemActive();
              // });
            }
          });
      });

    // detect changes when the input changes
    this.change
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });

    this.initMultipleHandling();
  }

  inputChanged(event) {
    this.searchUpdate.next(event);

  }

  filterResults() {
    this.filteredList = this.list;
    // get the search keyword
    let search = this.searchText;
    search = search.toLowerCase();
    // filter the banks
  
    if(search.length) {
      this.filteredList =  this.list.filter(item => {
        if (this.displayKey) {
          return item[this.displayKey].toLowerCase().includes(search);
        } else {
          return item.toString().toLowerCase().includes(search);
        }
      });
   }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.searchText = '';
  }

  ngAfterViewInit() {
    this.setOverlayClass();
  }

  /**
   * Handles the key down event with MatSelect.
   * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
   * @param KeyboardEvent event
   */
  _handleKeydown(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode === 32) {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }

  }


  /**
   * Focuses the search input field
   */
  public _focus() {
    if (!this.searchSelectInput) {
      return;
    }
    // save and restore scrollTop of panel, since it will be reset by focus()
    // note: this is hacky
    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;

    // focus
    this.searchSelectInput.nativeElement.focus();

    panel.scrollTop = scrollTop;

     this.filterResults();
  }

  /**
   * Resets the current search value
   * @param boolean focus whether to focus after resetting
   */
  public _reset(focus?: boolean) {
    this.searchText = '';
    this.filterResults();
    if (this.remoteFilter) {
      this.filterMode.emit({
        searchText: this.searchText
      });
    }

    if (focus) {
      this._focus();
    }
  }

  /**
   * Sets the overlay class  to correct offsetY
   * so that the selected option is at the position of the select box when opening
   */
  private setOverlayClass() {
    if (this.overlayClassSet) {
      return;
    }
    const overlayClass = 'cdk-overlay-pane-select-search';

    // tslint:disable-next-line: deprecation
    this.matSelect.overlayDir.attach
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        // note: this is hacky, but currently there is no better way to do this
        if (!this.searchSelectInput) { return; }
        this.searchSelectInput.nativeElement.parentElement.parentElement
          .parentElement.parentElement.parentElement.classList.add(overlayClass);
      });

    this.overlayClassSet = true;
  }


  /**
   * Initializes handling <mat-select [multiple]="true">
   * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
   */
  private initMultipleHandling() {
    // if <mat-select [multiple]="true">
    // store previously selected values and restore them when they are deselected
    // because the option is not available while we are currently filtering
    this.matSelect.valueChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe((values) => {
        if (this.matSelect.multiple) {
          const restoreSelectedValues = false;
          // if (this.searchText && this.searchText.length
          //     && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
          //     if (!values || !Array.isArray(values)) {
          //         values = [];
          //     }
          //     const optionValues = this.matSelect.options.map(option => option.value);
          //     this.previousSelectedValues.forEach(previousValue => {
          //         if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
          //             // if a value that was selected before is deselected and not found in the options, it was deselected
          //             // due to the filtering, so we restore it.
          //             values.push(previousValue);
          //             restoreSelectedValues = true;
          //         }
          //     });
          // }

          // if (restoreSelectedValues) {
          //     this.matSelect._onChange(values);
          // }
          // if(this.valueKey) {
          //     values = this.filteredList.filter((item)=>{
          //         return values.indexOf(item[this.valueKey])>-1;
          //     })
          //  }


          // this.selectedValues = ArrayUtil.clone(values);
        }
      });
  }



  checkSelection(item) {
    if (!item) { return false; }
    if (this.displayKey) {
      const index = this.filteredList.findIndex((val) => {
        return val[this.displayKey] === item[this.displayKey];
      });
      return index === -1;
    }
    return this.list.indexOf(item) === -1;
  }

  toggleSelection(item) {
    if (this.multiSelect) {
      const index = this.selectedValues.findIndex((ele) => {
        return this.valueKey ? ele[this.valueKey] === item[this.valueKey] : ele === item;
      });
      if (index === -1) {
        this.selectedValues.push(item);
      } else {
        this.selectedValues.splice(index, 1);
      }
    } else {
      this.selectedValues = [item];
    }
  }
}
