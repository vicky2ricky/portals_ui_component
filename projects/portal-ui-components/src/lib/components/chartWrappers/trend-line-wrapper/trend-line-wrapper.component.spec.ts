import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendLineWrapperComponent } from './trend-line-wrapper.component';

describe('TrendLineWrapperComponent', () => {
  let component: TrendLineWrapperComponent;
  let fixture: ComponentFixture<TrendLineWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendLineWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendLineWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
