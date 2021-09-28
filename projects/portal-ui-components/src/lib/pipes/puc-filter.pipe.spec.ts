import { PucFilterPipe } from './puc-filter.pipe';

describe('PucFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new PucFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform: should return filtered data set from given data set for given term if found', () => {
    const pipe = new PucFilterPipe();

    const dataSet = [
      { markers: ['dab'], name: 'dabTest1', _id: 'dab1' },
      { markers: ['vav'], name: 'vavTest1', _id: 'vav1' },
      { markers: ['vav'], name: 'vavTest2', _id: 'vav2' },
      { markers: ['ti'], name: 'timeTest2', _id: 'time1' }
    ];

    expect(pipe.transform(dataSet, 'dab')).toEqual([{ markers: ['dab'], name: 'dabTest1', _id: 'dab1' }]);
  });

  it('transform: should return filtered data set from given data set for given term and key if found', () => {
    const pipe = new PucFilterPipe();

    const dataSet = [
      { markers: ['dab'], name: 'dabTest1', _id: 'dab1' },
      { markers: ['vav'], name: 'vavTest1', _id: 'vav1' },
      { markers: ['vav'], name: 'vavTest2', _id: 'vav2' },
      { markers: ['ti'], name: 'timeTest2', _id: 'time1' }
    ];

    expect(pipe.transform(dataSet, 'dab', 'markers')).toEqual([{ markers: ['dab'], name: 'dabTest1', _id: 'dab1' }]);
  });

  it('transform: should return all data set from given data set for given term if not found', () => {
    const pipe = new PucFilterPipe();

    const dataSet = [
      { markers: ['dab'], name: 'dabTest1', _id: 'dab1' },
      { markers: ['vav'], name: 'vavTest1', _id: 'vav1' },
      { markers: ['vav'], name: 'vavTest2', _id: 'vav2' },
      { markers: ['ti'], name: 'timeTest2', _id: 'time1' }
    ];

    expect(pipe.transform(dataSet, 'test')).toEqual(dataSet);
  });

  it('transform: should return all data set from given data set for null term', () => {
    const pipe = new PucFilterPipe();

    const dataSet = [
      { markers: ['dab'], name: 'dabTest1', _id: 'dab1' },
      { markers: ['vav'], name: 'vavTest1', _id: 'vav1' },
      { markers: ['vav'], name: 'vavTest2', _id: 'vav2' },
      { markers: ['ti'], name: 'timeTest2', _id: 'time1' }
    ];

    expect(pipe.transform(dataSet, '')).toEqual(dataSet);
  });

  it('transform: should return all data set from given data set for undefined entry in given data set', () => {
    const pipe = new PucFilterPipe();

    const dataSet = [
      { markers: ['dab'], name: 'dabTest1', _id: 'dab1' },
      { markers: ['vav'], name: 'vavTest1', _id: 'vav1' },
      { markers: ['vav'], name: 'vavTest2', _id: 'vav2' },
      { markers: ['ti'], name: 'timeTest2', _id: 'time1' },
      undefined
    ];

    expect(pipe.transform(dataSet, '')).toEqual(dataSet);
  });

  it('transform: should handle undefined and null in given dataset', () => {
    const pipe = new PucFilterPipe();

    const dataSet = [
      { undefined },
      { markers: [undefined], name: 'vavTest2', _id: 'vav2' },
      { undefined: ['ti'], name: null, _id: 'time1' }
    ];

    expect(pipe.transform(dataSet, 'name')).toEqual([]);
  });
});
