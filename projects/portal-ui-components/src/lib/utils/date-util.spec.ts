import { DateUtil } from './date-util';
import * as moment from 'moment';

describe('DateUtil: to test date manipulation functions', () => {
  it('should create an instance', () => {
    expect(new DateUtil()).toBeTruthy();
  });

  it('contains: should return true if inner range lies within outer range', () => {
    const outerStDt = moment('2020-08-20 11:00:00');
    const outerEnDt = moment('2020-08-20 11:00:00').add(12, 'hours');
    const innerStDt = moment('2020-08-20 11:00:00').add(2, 'hours');
    const innerEnDt = moment('2020-08-20 11:00:00').add(4, 'hours');

    expect(DateUtil.contains(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(true);
  });

  it('contains: should return false if inner range lies outside outer range', () => {
    const outerStDt = moment('2020-08-20 00:00:00');
    const outerEnDt = moment('2020-08-20 00:00:00').add(12, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(13, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');

    expect(DateUtil.contains(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(false);
  });

  it('intersect: should return intersection if (start <= otherStart) && (otherStart < end) && (end < otherEnd)', () => {
    const outerStDt = moment('2020-08-20 00:00:00');
    const outerEnDt = moment('2020-08-20 00:00:00').add(12, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(8, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(null);
  });

  it('intersect: should return intersection for (otherStart < start) && (start <= end) && (end < otherEnd)', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(8, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(12, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['08:00', '12:00']);
  });

  it('intersect: should return intersection for (otherStart < start) && (start < otherEnd) && (otherEnd <= end)', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(8, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(12, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(11, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['08:00', '11:00']);
  });

  it('intersect: should return intersection for (start <= otherStart) && (otherStart <= otherEnd) && (otherEnd <= end)', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(12, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(8, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(11, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['08:00', '11:00']);
  });

  it('intersect: should return null start == end', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(8, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(11, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(null);
  });

  it('intersect: should return null otherstart == start', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(11, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(null);
  });

  it('intersect: should return null otherend == start', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(null);
  });

  it('intersect: should return intersection for (point > otherStart) && (point < otherEnd)', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(8, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['07:00', '07:00']);
  });

  it('intersect: should return null for inner and outer being same', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(null);
  });

  it('intersect: should return null for start == otherStart', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['07:00', '17:00']);
  });

  it('intersect: should return null for otherEnd == otherStart', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(7, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(null);
  });

  it('intersect: should return intersection for otherEnd == otherStart and (point > start) && (point < end)', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['06:00', '06:00']);
  });

  it('intersect: should return intersection for (start <= otherStart) && (otherStart < end) && (end < otherEnd)', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(18, 'hours').format('HH:mm');

    expect(DateUtil.intersect(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(['06:00', '17:00']);
  });

  it('adjacent: should return false for non adjacent dates', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const outerEnDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours');
    const innerEnDt = moment('2020-08-20 00:00:00').add(18, 'hours');

    expect(DateUtil.adjacent(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(false);
  });

  it('adjacent: should return false for non adjacent dates', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const outerEnDt = moment('2020-08-20 00:00:00').add(8, 'hours');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours');
    const innerEnDt = moment('2020-08-20 00:00:00').add(5, 'hours');

    expect(DateUtil.adjacent(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(false);
  });

  it('adjacent: should return false for non adjacent dates', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const outerEnDt = moment('2020-08-20 00:00:00').add(8, 'hours');
    const innerStDt = moment('2020-08-20 00:00:00').add(8, 'hours');
    const innerEnDt = moment('2020-08-20 00:00:00').add(5, 'hours');

    expect(DateUtil.adjacent(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(false);
  });

  it('adjacent: should return true for adjacent dates', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const outerEnDt = moment('2020-08-20 00:00:00').add(8, 'hours');
    const innerStDt = moment('2020-08-20 00:00:00').add(8, 'hours');
    const innerEnDt = moment('2020-08-20 00:00:00').add(9, 'hours');

    expect(DateUtil.adjacent(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(true);
  });

  it('overlaps: should return true if dates overlap', () => {
    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours').format('HH:mm');
    const outerEnDt = moment('2020-08-20 00:00:00').add(17, 'hours').format('HH:mm');
    const innerStDt = moment('2020-08-20 00:00:00').add(6, 'hours').format('HH:mm');
    const innerEnDt = moment('2020-08-20 00:00:00').add(18, 'hours').format('HH:mm');

    expect(DateUtil.overlaps(outerStDt, outerEnDt, innerStDt, innerEnDt)).toEqual(true);
  });

  it('overlaps: should return false if dates dont overlap', () => {
    const options: any = {};
    options.adjacent = true;

    const outerStDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const outerEnDt = moment('2020-08-20 00:00:00').add(5, 'hours');
    const innerStDt = moment('2020-08-20 00:00:00').add(4, 'hours');
    const innerEnDt = moment('2020-08-20 00:00:00').add(12, 'hours');

    expect(DateUtil.overlaps(outerStDt, outerEnDt, innerStDt, innerEnDt, options)).toEqual(true);
  });
});
