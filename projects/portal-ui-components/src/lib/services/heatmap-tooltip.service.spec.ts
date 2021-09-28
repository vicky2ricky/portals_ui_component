import { TestBed } from '@angular/core/testing';
import { execPath } from 'process';

import { HeatMapToolTipService } from './heatmap-tooltip.service';

describe('HeatmapTooltipService', () => {
  let service: HeatMapToolTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeatMapToolTipService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(HeatMapToolTipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updategraphData: should update', () => {
    service.updategraphData('hello', {});
    expect(service.graphData).toBeTruthy();
    expect(service.origGraphData).toBeTruthy();
  });

  it('updategraphSvgRefs: should update', () => {
    service.updategraphSvgRefs('hello', {});
    expect(service.graphSvgRefs).toBeTruthy();
  });

  it('updategraphWidhts: should update', () => {
    service.updategraphWidhts('hello', {});
    expect(service.graphWidhts).toBeTruthy();
  });

  it('updategraphHeights: should update', () => {
    service.updategraphHeights('hello', {});
    expect(service.graphHeights).toBeTruthy();
    expect(service.origGraphHeights).toBeTruthy();
  });

  it('clearTooltipData: should clear', () => {
    service.clearTooltipData();
    expect(service.graphData.size).toEqual(0);
  });

  it('clearTooltipData: should not clear', () => {
    service.heatmapEvent = 'embed';
    service.clearTooltipData();
    expect(service.graphData).toBeTruthy();
  });

  it('deleteGraphData: should delete', () => {
    service.deleteGraphData('hello');
    expect(service.graphData.size).toEqual(0);
  });

  it('deletefromOrigGraphData: should delete', () => {
    service.deletefromOrigGraphData('hello');
    expect(service.origGraphHeights).toBeTruthy();
  });

  it('clearToolTip: should clear', () => {
    service.clearToolTip();
    expect(service.graphSvgRefs).toBeTruthy();
  });

  it('getEnumMapping: should return', () => {
    const res = service.getEnumMapping('hello', 'world');
    expect(res).toEqual('world');
  });

  it('getEnumMapping: should return', () => {
    service.curveEnumCollection.set('dummy', 'world');
    const res = service.getEnumMapping('dummy', 'not me');
    expect(res).toEqual('world');
  });

  it('reOrderGraphTooltips: should return tooltip', () => {
    service.reOrderGraphTooltips();
    expect(service.graphToolTipData).toBeTruthy();
  });

  it('reOrderGraphTooltips: should return tooltip part2', () => {
    service.relevantIdFilter = '123';
    service.graphToolTipData.set('runtimesystemprofile123', 'something');
    service.graphToolTipData.set('comfortIndex123', 'something more');
    service.reOrderGraphTooltips();
    expect(service.graphToolTipData).toBeTruthy();
  });

  it('reOrderGraphWidgets: should return graph data', () => {
    service.reOrderGraphWidgets();
    expect(service.graphData).toBeTruthy();
  });

  it('reOrderGraphWidgets: should return graph data part2', () => {
    service.relevantIdFilter = '123';
    service.graphData.set('runtimesystemprofile123', 'something');
    service.graphData.set('comfortIndex123', 'something more');
    service.reOrderGraphWidgets();
    expect(service.graphData).toBeTruthy();
  });

  it('calcTooltipLeftPosition: should return val', () => {
    service.layerX = 1;
    expect(service.calcTooltipLeftPosition()).toEqual('10px');
  });

  it('getWidgetTooltipPosition: should return val', () => {
    service.graphHeights.set('1', 110);
    service.graphHeights.set('2', 110);
    service.graphHeights.set('0', 80);
    const pos = service.getWidgetTooltipPosition(0, 1);
    expect(pos).toEqual(135);
  });

  it('getWidgetTooltipPosition: should return val part2', () => {
    service.graphHeights.set('1', 110);
    service.graphHeights.set('2', 110);
    service.graphHeights.set('0', 80);
    const pos = service.getWidgetTooltipPosition(1, 0);
    expect(pos).toEqual(135);
  });

  it('getWidgetTooltipPosition: should return val part3', () => {
    service.graphHeights.set('1', 110);
    service.graphHeights.set('2', 110);
    service.graphHeights.set('0', 80);
    const pos = service.getWidgetTooltipPosition(1, 1);
    expect(pos).toEqual(0);
  });

  it('getWidgetTooltipPosition: should return val part4', () => {
    service.graphAccordianDataVisibility = ['1'];
    service.graphHeights.set('1', 110);
    service.graphHeights.set('2', 110);
    service.graphHeights.set('0', 80);
    const pos = service.getWidgetTooltipPosition(1, 0);
    expect(pos).toEqual(25);
  });

  it('getWidgetTooltipPosition: should return val part5', () => {
    service.graphAccordianDataVisibility = ['1'];
    service.graphHeights.set('1', 110);
    service.graphHeights.set('2', 110);
    service.graphHeights.set('0', 80);
    const pos = service.getWidgetTooltipPosition(0, 1);
    expect(pos).toEqual(25);
  });

  it('clearIrrelevantEntries: should clear irrelevant entries', () => {
    service.clearIrrelevantEntries();
    expect(service.graphData.size).toEqual(0);
  });

  it('clearIrrelevantEntries: should clear irrelevant entries part2', () => {
    service.heatmapEvent = 'embed';
    service.clearIrrelevantEntries();
    expect(service.graphData).toBeTruthy();
  });
});
