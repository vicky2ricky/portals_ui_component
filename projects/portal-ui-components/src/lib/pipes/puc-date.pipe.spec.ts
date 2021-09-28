import { PucDatePipe } from './puc-date.pipe';
import * as moment from 'moment';

describe('PucDatePipe', () => {
  it('create an instance', () => {
    const pipe = new PucDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('transform: should return formatted date for DD MM YY', () => {
    const pipe = new PucDatePipe();
    const dateSample = moment('2020-08-24');

    expect(pipe.transform(dateSample, 'DD MM YY')).toEqual('24 08 20');
  });

  it('transform: should return formatted date for HH:mm', () => {
    const pipe = new PucDatePipe();
    const dateSample = moment('2020-08-24');

    expect(pipe.transform(dateSample, 'HH:mm')).toEqual('00:00');
  });

  it('transform: should return value as is if not a valid moment date', () => {
    const pipe = new PucDatePipe();
    const dateSample = 'Twenty20 Aug 24';

    expect(pipe.transform(dateSample, 'DD MM YY')).toEqual('Twenty20 Aug 24');
  });

  it('transform: should return value as is if no fprmat passed', () => {
    const pipe = new PucDatePipe();
    const dateSample = '2020-08-24';

    expect(pipe.transform(dateSample)).toEqual(moment('2020-08-24').format());
  });
});
