import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Conditioning Status Sse Graph Widget
 */
export class PucConditioningStatusSseGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;


        // coolStage1
        // Disabled
        toolTip = new PucToolTipModel(true, 'CoolStage1', true); // stacked-merged
        params.push(new PucGraphWidgetParam('coolStage1Disbaled' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // Enabled
        toolTip = new PucToolTipModel(true, 'CoolStage1', true); // stacked-merged
        params.push(new PucGraphWidgetParam('coolStage1Enabled' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

        // heatStage1
        // Disabled
        toolTip = new PucToolTipModel(true, 'HeatStage1', true); // stacked-merged
        params.push(new PucGraphWidgetParam('heatStage1Disbaled' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // Enabled
        toolTip = new PucToolTipModel(true, 'HeatStage1', true); // stacked-merged
        params.push(new PucGraphWidgetParam('heatStage1Enabled' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

        // fan
        // Disabled
        toolTip = new PucToolTipModel(true, 'Fan', true); // stacked-merged
        params.push(new PucGraphWidgetParam('fanOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));
        // Enabled
        toolTip = new PucToolTipModel(true, 'Fan', true); // stacked-merged
        params.push(new PucGraphWidgetParam('fanOn' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));


        return new PucGraphWidgetModel('Conditioning Status', 'condGraph', 'cond', params);
    }
}
