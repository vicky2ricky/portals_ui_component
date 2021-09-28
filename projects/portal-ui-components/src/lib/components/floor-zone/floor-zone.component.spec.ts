import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorZoneComponent } from './floor-zone.component';

describe('FloorZoneComponent', () => {
  let component: FloorZoneComponent;
  let fixture: ComponentFixture<FloorZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
