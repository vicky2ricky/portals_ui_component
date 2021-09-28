import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWidgetsViewComponent } from './custom-widgets-view.component';

describe('CustomWidgetsViewComponent', () => {
  let component: CustomWidgetsViewComponent;
  let fixture: ComponentFixture<CustomWidgetsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomWidgetsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
