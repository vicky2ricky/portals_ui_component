import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSwatchComponent } from './single-swatch.component';

describe('SingleSwatchComponent', () => {
  let component: SingleSwatchComponent;
  let fixture: ComponentFixture<SingleSwatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSwatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
