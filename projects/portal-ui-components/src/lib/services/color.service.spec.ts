import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';
const color1 = 'rgba(12,20,21,1)';
const color2 = 'rgba(42,230,211,1)';
describe('Service: ColorService', () => {
  let service: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorService);
  });

  it('generateInterpolatedColors: generate interpolate colors by using two colors', () => {

    const res = service.generateInterpolatedColors(color1, color2, 5);
    expect(res[0]).toBe('rgba(12,20,21,1)');
    expect(res[1]).toBe('rgba(20,73,69,1)');
    expect(res[2]).toBe('rgba(27,125,116,1)');
    expect(res[3]).toBe('rgba(35,178,164,1)');
    expect(res[4]).toBe('rgba(42,230,211,1)');
  });

  it('generateInterpolatedColors: passing step factor 0', () => {
    const res = service.generateInterpolatedColors(color1, color2, 0);
    expect(res.length).toBe(0);
  });

  it('generateInterpolatedColors: passing step factor 1', () => {
    const res = service.generateInterpolatedColors(color1, color2, 1);
    expect(res.length).toBe(1);
    expect(res[0]).toBe('rgba(12,20,21,1)');
  });

  it('generateInterpolatedColors: get interpolate colors for hexadecimal codes also', () => {
    const res = service.generateInterpolatedColors('#454545', '#454545', 1);
    expect(res.length).toBe(1);
    expect(res[0]).toBe('rgba(69,69,69,1)');
  });

  it('hexTorgb: convert hexadecimal code to rgb', () => {
    const res = service.hexTorgb('#adadad');
    expect(res).toBe('rgba(173,173,173,1)');
  });

  it('generateOpacityArray: genarate lighter colors based on input color', () => {
    const res = service.generateOpacityArray(color1, 0.2, 4);
    expect(res.length).toBe(4);
    expect(res[0]).toBe('rgba(12, 20, 21, 1)');
    expect(res[3]).toBe('rgba(12, 20, 21, 0.2)');
  });

  it('generateOpacityArray: genarate lighter colors for passing total color as 0', () => {
    const res = service.generateOpacityArray(color1, 0.2, 0);
    expect(res.length).toBe(0);
  });

  it('generateOpacityArray: genarate lighter colors for hexa decimal codes', () => {
    const res = service.generateOpacityArray('#ffffff', 0.2, 1);
    expect(res.length).toBe(1);
    expect(res[0]).toBe('rgba(255, 255, 255, 0.2)');
  });

  it('lightenColor: get lighten color', () => {
    const res = service.lightenColor('#563642', 0.2, 1);
    expect(res).toBe('#343434');
  });

  it('darkenColor: get darken color', () => {
    const res = service.darkenColor('rgba(173,173,173,1)', 2);
    expect(res).toBe('#afafaf');
  });

  it('darkenColor: get darken color for hexadecimal code', () => {
    const res = service.darkenColor('#afafaf', 2);
    expect(res).toBe('#b1b1b1');
  });

  it('fullColorHex: get hexadecimal code for rgb', () => {
    const res = service.fullColorHex('rgba(0,0,0,1)');
    expect(res).toBe('#000000');
  });

  it('rgbToHex: convert rgb code to hex', () => {
    const res = service.rgbToHex('12');
    expect(res).toBe('0c');
  });

});
