import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SelectDropdownComponent } from './select-dropdown.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementRef } from '@angular/core';
describe('SelectDropdownComponent', () => {
  let component: SelectDropdownComponent;
  let fixture: ComponentFixture<SelectDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDropdownComponent],
      imports: [
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call registerOnChange,registerOnTouched', () => {
    component.registerOnChange(() => { });
    component.registerOnTouched(() => { });
    expect(component).toBeTruthy();
  });

  it('call data set and get', fakeAsync(() => {
    const set = ['test header'];
    component.data = set;
    tick();
    expect(component.data).toEqual(set);
  }));

  it('call call data set and get while null', fakeAsync(() => {
    const set = null;
    component.data = set;
    tick();
    expect(set).toEqual(null);
  }));

  it('call checkPrimary set and get', fakeAsync(() => {
    const set = true;
    component.checkPrimary = set;
    tick();
    expect(component.checkPrimary).toEqual(true);
  }));

  it('call selectedValue set and get', fakeAsync(() => {
    const set = undefined;
    component.selectedValue = set;
    tick();
    expect(component.selectedValue).toEqual(set);
  }));

  it('call selectedValue set and get', fakeAsync(() => {
    const set = null;
    component.selectedValue = set;
    tick();
    expect(component.selectedValue).toEqual(set);
  }));

  it('call search update with filter', fakeAsync(() => {
    component.remoteFilter = true;
    component.searchUpdate.next('test');
    tick(500);
  }));

  it('call search update without filter', fakeAsync(() => {
    component.remoteFilter = false;
    component.searchUpdate.next('test');
    tick(500);
  }));

  // it('call search update without filter', fakeAsync(() => {
  //   let event = {value:25};
  //   debugElement
  //   .query(By.css('#selectDropdown'))
  //   .triggerEventHandler('selectDropdown',event);
  //   fixture.detectChanges();
  //   // expect(component.generalLedgerRequest.pageSize).toBe(25);
  //  // expect(innerSpan.innerHTML).toEqual('3');
  // }))

  it('should focus searchSelectInput is undefined', () => {
    component.searchSelectInput = undefined;
    component._focus();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should focus searchSelectInput is defined', fakeAsync(() => {
    component.searchSelectInput = new ElementRef({ focus() { } });
    component.matSelect.panel = new ElementRef({ focus() { } });
    fixture.detectChanges();
    component._focus();
    tick();
    expect(component).toBeTruthy();
  }));

  it('create writeValue', () => {
    component.remoteFilter = true;
    component._reset();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('create writeValue', () => {
    component.remoteFilter = false;
    component.searchSelectInput = new ElementRef({ focus() { } });
    component.matSelect.panel = new ElementRef({ focus() { } });
    component._reset(true);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('create writeValue', () => {
    component.writeValue('select');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('create panelclass as array', () => {
    component.matSelect.panelClass = [];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('create panelclass as object', () => {
    component.matSelect.panelClass = { key: 'value' };
    component.ngOnInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('create panelclass as string', () => {
    component.matSelect.panelClass = 'mat';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('checkSelection empty', () => {
    component.checkSelection(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('checkSelection has display key', () => {
    component.filteredList = [{ val: '2' }];
    component.displayKey = '2';
    const item = [{ val: '2' }];
    component.checkSelection(item);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('checkSelection has no display key', () => {
    component.displayKey = undefined;
    const item = [{ val: '2' }];
    component.checkSelection(item);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('toggleSelection has multiselection', () => {
    component.selectedValues = [{ val: '2' }];
    const item = [{ val: '2' }];
    component.toggleSelection(item);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('toggleSelection has multiselection', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  // it('toggleSelection has multiselection', () => {
  //   component.matSelect.overlayDir.attach():any;
  //   fixture.detectChanges();
  //   expect(component).toBeTruthy();
  // });
});
