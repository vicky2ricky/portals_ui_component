import { PucGraphWidgetParam } from './puc-graph-widget-param.model';
import { PucGraphTypes } from './puc-graph-types.model';

describe('PucGraphWidgetParam', () => {
  it('should create an instance', () => {
    expect(new PucGraphWidgetParam('', '', PucGraphTypes.LINE, undefined, 0, true)).toBeTruthy();
  });
});
