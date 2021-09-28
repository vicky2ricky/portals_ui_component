import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceLineChartComponent } from './reference-line-chart.component';

describe('ReferenceLineChartComponent', () => {
  let component: ReferenceLineChartComponent;
  let fixture: ComponentFixture<ReferenceLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
