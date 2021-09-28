import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphXaxisComponent } from './graph-xaxis.component';

describe('GraphXaxisComponent', () => {
  let component: GraphXaxisComponent;
  let fixture: ComponentFixture<GraphXaxisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphXaxisComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphXaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('change Xcord Value', () => {
    fixture.detectChanges();
    component.xCords = 1;
    component.ngOnChanges({
      xCords: new SimpleChange(1, 2, true)
    });
    expect(component.xCords).toEqual(2);
  });

  it('when xChords value is undefined', () => {
    fixture.detectChanges();
    component.ngOnChanges({
      XCords: new SimpleChange(0, 0, true)
    });
    expect(component.xCords).toEqual(undefined);
  });
});
