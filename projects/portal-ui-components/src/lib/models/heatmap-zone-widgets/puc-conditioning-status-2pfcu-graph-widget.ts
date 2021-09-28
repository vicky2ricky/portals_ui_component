import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Conditioning Status 2pfcu Graph Widget
 */
export class PucConditioningStatus2pfcuGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // fanStage1
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Low Speed');
        params.push(new PucGraphWidgetParam('fanLow' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN, PucGraphTypes.AREA_LINE, toolTip));

        // fanStage2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Medium Speed');
        params.push(new PucGraphWidgetParam('fanMedium' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.AREA_LINE, toolTip));

        // fanStage3
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan High Speed');
        params.push(new PucGraphWidgetParam('fanHigh' + this.moduleIdentifier,
            PucGraphColors.STRONG_CYAN_LIME_GREEN, PucGraphTypes.AREA_LINE, toolTip));

        // auxHeating
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Aux Heating Stage');
        params.push(new PucGraphWidgetParam('auxHeating' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.AREA, toolTip));

        // waterValve
        // waterValveOff
        toolTip = new PucToolTipModel(true, 'WaterValve', true, 'Off', true, 'WaterValve') // stacked-merged
        params.push(new PucGraphWidgetParam('waterValveOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 5 : 0));
        // waterValveOn
        toolTip = new PucToolTipModel(true, 'WaterValve', true, 'On', true, 'WaterValve') // stacked-merged
        params.push(new PucGraphWidgetParam('waterValveOn' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 5 : 0));

        return new PucGraphWidgetModel('Conditioning Status', 'condGraph', 'cond', params);
    }
}
