import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Conditioning Status 4pfcu Graph Widget
 */
export class PucConditioningStatus4pfcuGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // fanStage1
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Low Speed');
        params.push(new PucGraphWidgetParam('fanLow' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));

        // fanStage2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Medium Speed');
        params.push(new PucGraphWidgetParam('fanMedium' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));

        // fanStage3
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan High Speed');
        params.push(new PucGraphWidgetParam('fanHigh' + this.moduleIdentifier,
            PucGraphColors.STRONG_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));

        // waterHeatingValve
        // heatingValveOff
        toolTip = new PucToolTipModel(true, 'Water Valve Energize in Heating', true,
            'Off', true, 'Water Valve Energize in Heating') // stacked-merged
        params.push(new PucGraphWidgetParam('heatingValveOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 4.5 : 0));
        // heatingValveOn
        toolTip = new PucToolTipModel(true, 'Water Valve Energize in Heating', true,
            'On', true, 'Water Valve Energize in Heating') // stacked-merged
        params.push(new PucGraphWidgetParam('heatingValveOn' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 4.5 : 0));

        // watercoolingValve
        // coolingValveOff
        toolTip = new PucToolTipModel(true, 'Water Valve Energize in Cooling', true,
            'Off', true, 'Water Valve Energize in Cooling') // stacked-merged
        params.push(new PucGraphWidgetParam('coolingValveOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 5.2 : 1));
        // coolingValveOn
        toolTip = new PucToolTipModel(true, 'Water Valve Energize in Cooling', true,
            'On', true, 'Water Valve Energize in Cooling') // stacked-merged
        params.push(new PucGraphWidgetParam('coolingValveOn' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 5.2 : 1));

        return new PucGraphWidgetModel('Conditioning Status', 'condGraph', 'cond', params);
    }
}
