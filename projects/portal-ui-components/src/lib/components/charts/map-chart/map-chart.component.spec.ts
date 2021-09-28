import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MapChartComponent } from './map-chart.component';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const colorSet = {
  quartile1: 'rgb(251, 223, 226)',
  quartile2: 'rgb(245, 182, 190)',
  quartile3: 'rgb(240, 143, 155)',
  quartile4: 'rgb(233, 94, 111)'
}
const results = {
  unit: 'kWh', count: 3,
  mappings: { hvacElectricity: 'Hvac Electricity', hvacGas: 'Hvac Gas' },
  sites: [{
    id: 'site1', location: { lat: '12.9816', lng: '77.7708' },
    name: 'Site 1', total: 200, hvacElectricity: 100, hvacGas: 100, quartile:
      'quartile1', popUpText: '<div class="mapPopup"><label class="siteName">Site 1</label><div><label class="total">Total Consumption</label><span class="value">200 kWh</span></div><div><label class="breakup">Hvac Electricity</label><span class="value">100 kWh</span></div><div><label class="breakup">Hvac Gas</label><span class="value">100 kWh</span></div></div>'
  }, { id: 'site2', location: { lat: '51.507', lng: '0.128' }, name: 'Site 2', total: 320, hvacElectricity: 120, hvacGas: 200, quartile: 'quartile2', popUpText: '<div class="mapPopup"><label class="siteName">Site 2</label><div><label class="total">Total Consumption</label><span class="value">320 kWh</span></div><div><label class="breakup">Hvac Electricity</label><span class="value">120 kWh</span></div><div><label class="breakup">Hvac Gas</label><span class="value">200 kWh</span></div></div>' }, {
    id: 'site3', location: { lat: '40.785091', lng: '-73.96828' }, name: 'Site 3', total: 450, hvacElectricity: 220, hvacGas: 230, quartile: 'quartile2',
    popUpText: '<div class="mapPopup"><label class="siteName">Site 3</label><div><label class="total">Total Consumption</label><span class="value">450 kWh</span></div><div><label class="breakup">Hvac Electricity</label><span class="value">220 kWh</span></div><div><label class="breakup">Hvac Gas</label><span class="value">230 kWh</span></div></div>'
  }],
  category: 'Consumption'
};
const subscriptionKey = '1Wo46yN2XCYD8ZGIE11DSiyEuOL4SF6Eckfok_fh6r8';
@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  results: any = results;
  colorSet: any = colorSet;
  subscriptionKey: any = subscriptionKey;
}


describe('Component: MapChartComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, MapChartComponent]
    });
  });

  describe('Render Map chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-map
          [chartData]="results"
          [chartWidth] = "960"
          [chartHeight] = "480"
          [zoom] = "1"
          [subscriptionKey] = "subscriptionKey"
          [mapId] = "'mapDashboard'">
        `,
          changeDetection: ChangeDetectionStrategy.Default
        }

      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('#mapDashboard');
      expect(svg.style.width).toBe('960px');
      expect(svg.style.height).toBe('480px');
    });
  });

});
