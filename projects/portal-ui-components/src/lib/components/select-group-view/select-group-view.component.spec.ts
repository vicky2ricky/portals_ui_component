import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroupViewComponent } from './select-group-view.component';

describe('SelectGroupViewComponent', () => {
  let component: SelectGroupViewComponent;
  let fixture: ComponentFixture<SelectGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
