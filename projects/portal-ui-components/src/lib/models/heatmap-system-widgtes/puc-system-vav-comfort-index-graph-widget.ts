
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
/**
 * @description: System Vav Comfort Index Graph Widget
 */
export class PucSystemVavComfortIndexGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // ActualComfortIndex
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Actual Comfort Index (System CI)');
        params.push(new PucGraphWidgetParam('ActualComfortIndex',
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.LINE, toolTip));   // line

        // PerceivedComfortIndex
        // toolTip = new PucToolTipModel(true);
        // params.push(new PucGraphWidgetParam('PerceivedComfortIndex', PucGraphColors.STRONG_RED, PucGraphTypes.LINE, toolTip));   //line

        // ComfortSelector
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Comfort Selector (Desired CI)');
        params.push(new PucGraphWidgetParam('ComfortSelector', PucGraphColors.VERY_SOFT_MAGENTA, PucGraphTypes.LINE, toolTip));  // line

        // weightedAverageCoolingLoadMA
        toolTip = new PucToolTipModel(true, '', false, '', true, 'WeightedAverageCoolingLoadMA');
        params.push(new PucGraphWidgetParam('weightedAverageCoolingLoadMA',
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.LINE, toolTip));  // line

        // weightedAverageHeatingLoadMA
        toolTip = new PucToolTipModel(true, '', false, '', true, 'WeightedAverageHeatingLoadMA');
        params.push(new PucGraphWidgetParam('weightedAverageHeatingLoadMA',
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.LINE, toolTip));  // line

        return new PucGraphWidgetModel('Comfort Index', 'comfortIndex', 'comfortIndex', params);
    }
}
