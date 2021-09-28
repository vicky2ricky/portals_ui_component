import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
/**
 * @description: System Outside Temp Graph Widget
 */
export class PucSystemOutsideTempGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // outsideTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Outside Temperature');   // line
        params.push(new PucGraphWidgetParam('outsideTemp', PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));

        // noCoolingBelowLockout
        toolTip = new PucToolTipModel(true);   // dotted
        params.push(new PucGraphWidgetParam('noCoolingBelowLockout',
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip));

        // noHeatingAboveLockout
        toolTip = new PucToolTipModel(true);   // dotted
        params.push(new PucGraphWidgetParam('noHeatingAboveLockout',
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.DASHED_LINE, toolTip));

        // useTempLockout
        toolTip = new PucToolTipModel(true);  // line
        params.push(new PucGraphWidgetParam('useTempLockout', PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.LINE, toolTip));

        // weatherOAT
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Weather OAT');  // line
        params.push(new PucGraphWidgetParam('weatherOAT', PucGraphColors.PALE_RED, PucGraphTypes.LINE, toolTip));

        // LocalOAT
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Local OAT');  // line
        params.push(new PucGraphWidgetParam('LocalOAT', PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('outside temperature', 'outsideTemp', 'outsideTemp', params);
    }
}
