import { PucGraphWidgetModel } from './puc-graph-widget-model.model';
import { PucGraphWidgetParam } from './puc-graph-widget-param.model';
import { PucGraphColors } from './puc-graph-colors.enum';
import { PucGraphTypes } from './puc-graph-types.model';
import { PucToolTipModel } from './puc-tool-tip.model';

describe('PucGraphWidgetModel', () => {
  it('should create an instance', () => {
    expect(new PucGraphWidgetModel('some', 'sample', 'data', [], [], '')).toBeTruthy();
  });
  it('should create an instance', () => {
    expect(new PucGraphWidgetModel('some', 'sample', 'data', [], [], 'something')).toBeTruthy();
  });
  it('should create an instance', () => {
    const toolTip = new PucToolTipModel(true);
    const param = new PucGraphWidgetParam('zone', PucGraphColors.DARK_MODERATE_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip);
    expect(new PucGraphWidgetModel('some', 'sample', 'data', [param], ['name'], '', 2)).toBeTruthy();
  });
});
