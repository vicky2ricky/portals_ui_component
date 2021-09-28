import { TestBed } from '@angular/core/testing';

import { ChartService } from './chart.service';

describe('Service: ChartService', () => {
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartService);
  });

  it('createScaleBand: create d3 scale band for number', () => {
    const res = service.createScaleBand(10, 0, 7, 0.2);
    expect(res(1)).toBeGreaterThan(0.8);
    expect(res(10)).toBe(undefined);
  });

  it('createScaleBand: create d3 scale band for array of strings', () => {
    const arr = ['d1', 'd2', 'd3', 'd4', 'd5'];
    const res = service.createScaleBand(arr, 0, 5);
    expect(res('d1')).toBe(0);
    expect(res('d8')).toBe(undefined);
  });

  it('createScaleBand: create d3 scale band for number without passing padding', () => {
    const res = service.createScaleBand(10, 0, 7);
    expect(res(1)).toBe(0.7);
    expect(res(9)).toBe(6.3);
  });

  it('createScaleBand: create d3 scale band for invalid data', () => {
    const res = service.createScaleBand(10, 'test', 1, 9);
    expect(res(1)).toBeNaN();
  })

  it('createScaleLinear: create d3 linear scale', () => {
    const res = service.createScaleLinear(0, 10, 1, 9);
    expect(res(1)).toBe(2);
    expect(res(10)).toBe(9);
    expect(res(11)).toBe(10);
  });

  it('createScaleLinear: create d3 linear scale for invalid data', () => {
    const res = service.createScaleLinear('test', 10, 1, 9);
    expect(res(1)).toBeNaN();
  });

  it('createScaleLinearNotNice: create d3 linear scale without nice', () => {
    const res = service.createScaleLinearNotNice(0, 10, 1, 9);
    expect(res(1)).toBe(2);
    expect(res(10)).toBe(9);
    expect(res(11)).toBe(10);
  });

  it('createScaleLinearNotNice: create d3 linear scale for invalid data without nice', () => {
    const res = service.createScaleLinearNotNice('test', 10, 1, 9);
    expect(res(1)).toBeNaN();
  })

});
