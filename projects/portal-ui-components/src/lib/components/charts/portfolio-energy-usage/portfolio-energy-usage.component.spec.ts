import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioEnergyUsageComponent } from './portfolio-energy-usage.component';

describe('PortfolioEnergyUsageComponent', () => {
  let component: PortfolioEnergyUsageComponent;
  let fixture: ComponentFixture<PortfolioEnergyUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioEnergyUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioEnergyUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
