import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description: Damper Position Graph Widget
 */
export class PucDamperPositionGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(isdualDuct = false, isFac = false) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // maxHeatingDamperPos
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Max Heating Damper Pos');
        params.push(new PucGraphWidgetParam('maxHeatingDamperPos' + this.moduleIdentifier,
            isdualDuct ? PucGraphColors.BRIGHT_RED : PucGraphColors.BRIGHT_RED, PucGraphTypes.DASHED_LINE, toolTip));  // dotted

        // maxCoolingDamperPos
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Max Cooling Damper Pos');
        params.push(new PucGraphWidgetParam('maxCoolingDamperPos' + this.moduleIdentifier,
            isdualDuct ? PucGraphColors.BLUE : PucGraphColors.BLUE, PucGraphTypes.DASHED_LINE, toolTip)); // dotted

        // minHeatingDamperPos
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Min Heating Damper Pos');
        params.push(new PucGraphWidgetParam('minHeatingDamperPos' + this.moduleIdentifier,
            isdualDuct ? PucGraphColors.THIN_PINK_COLOR : PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.DASHED_LINE, toolTip)); // dotted

        // minCoolingDamperPos
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Min Cooling Damper Pos');
        params.push(new PucGraphWidgetParam('minCoolingDamperPos' + this.moduleIdentifier,
            isdualDuct ? PucGraphColors.THIN_BLUE_COLOR : PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip)); // dotted

        // damperPos
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Damper Pos');
        params.push(new PucGraphWidgetParam('damperPos' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));   // line

        // coolingDamper
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Cooling Damper Pos');
        params.push(new PucGraphWidgetParam('coolingDamperPos' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.LINE, toolTip));   // line

        // heatingDamper
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Heating Damper Pos');
        params.push(new PucGraphWidgetParam('heatingDamperPos' + this.moduleIdentifier,
            PucGraphColors.BRIGHT_RED, PucGraphTypes.LINE, toolTip));  // line

        // reheatPosition
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Reheat Position');
        params.push(new PucGraphWidgetParam('reheatPosition' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.LINE, toolTip));  // line

        // seriesFan
        // on
        toolTip = new PucToolTipModel(true, 'SeriesFan', true); // stacked-merged
        params.push(new PucGraphWidgetParam('seriesFanOn' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 6 : 0));
        // off
        toolTip = new PucToolTipModel(true, 'SeriesFan', true); // stacked-merged
        params.push(new PucGraphWidgetParam('seriesFanOff' + this.moduleIdentifier,
            PucGraphColors.OCEAN_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 6 : 0));

        // parallelFan
        // on
        toolTip = new PucToolTipModel(true, 'ParallelFan', true); // stacked-merged
        params.push(new PucGraphWidgetParam('parallelFanOn' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 6 : 0));
        // off
        toolTip = new PucToolTipModel(true, 'ParallelFan', true); // stacked-merged
        params.push(new PucGraphWidgetParam('parallelFanOff' + this.moduleIdentifier,
            PucGraphColors.OCEAN_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 6 : 0));

        return new PucGraphWidgetModel('Damper Position', 'damperPosGraph', 'damperPos', params,
            null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
