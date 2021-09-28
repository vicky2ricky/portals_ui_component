import { PucSelectFilterPipe } from './puc-select-filter.pipe';

describe('PucSelectFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new PucSelectFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform: Should filter based on keys and return macth items for query string', () => {
    const siteData = [{
      id: '123',
      site: 'dummySite1',
      mock: 'some data'
    },
    {
      id: '456',
      site: 'dummySite2',
      mock: 'some data'
    },
    {
      id: '789',
      site: 'dummySite3',
      mock: 'some data'
    }];

    const pipe = new PucSelectFilterPipe();
    const result = pipe.transform(siteData, 'id,site', 'dummySite1');

    expect(result).toEqual([{
      id: '123',
      site: 'dummySite1',
      mock: 'some data'
    }]);
  });

  it('transform: Should return object as is if search string is empty', () => {
    const siteData = [{
      id: '123',
      site: 'dummySite1',
      mock: 'some data'
    },
    {
      id: '456',
      site: 'dummySite2',
      mock: 'some data'
    },
    {
      id: '789',
      site: 'dummySite3',
      mock: 'some data'
    }];

    const pipe = new PucSelectFilterPipe();
    const result = pipe.transform(siteData, 'id,site', '');

    expect(result).toEqual(siteData);
  });
});
