import { PucCMBoardPortsMappings } from './puc-cmboard-ports-mappings.model';

describe('PucCMBoardPortsMappings', () => {
  it('should create an instance', () => {
    expect(new PucCMBoardPortsMappings('', true, '')).toBeTruthy();
  });
});
