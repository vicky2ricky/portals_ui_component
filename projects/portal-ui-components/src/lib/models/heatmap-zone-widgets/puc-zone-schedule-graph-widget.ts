import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description: Zone Schedule Graph Widget
 */
export class PucZoneScheduleGraphWiget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // building
        toolTip = new PucToolTipModel(true, 'ScheduleType', true);   // stacked-merged
        params.push(new PucGraphWidgetParam('Building' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip));

        // zone
        toolTip = new PucToolTipModel(true, 'ScheduleType', true);   // stacked-merged
        params.push(new PucGraphWidgetParam('Zone' + this.moduleIdentifier,
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip));

        // named
        toolTip = new PucToolTipModel(true, 'ScheduleType', true);   // stacked-merged
        params.push(new PucGraphWidgetParam('Named' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip));

        return new PucGraphWidgetModel('zone schedule', 'zoneSchedule', 'zSchedule',
            params, null, null, PucGraphWidgetHeight.SMALL);
    }
}
