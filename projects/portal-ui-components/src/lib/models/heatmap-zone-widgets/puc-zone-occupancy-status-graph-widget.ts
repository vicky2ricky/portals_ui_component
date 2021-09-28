import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description: Zone Occupancy Graph Widget
 */
export class PucZoneOccupancyStatusGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // windowDetection
        toolTip = new PucToolTipModel(true);    // stacked-merged gray
        params.push(new PucGraphWidgetParam('WindowDetection' + this.moduleIdentifier,
            PucGraphColors.SOFT_YELLOWISH, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip));

        // IAQOverride
        toolTip = new PucToolTipModel(true);    // stacked-merged gray
        params.push(new PucGraphWidgetParam('IAQOverride' + this.moduleIdentifier,
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip));

        // zoneOccupancy
        // zoneSetpoint
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Occupied'); // stacked-merged
        params.push(new PucGraphWidgetParam('zoneSetpoint' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // zoneSetback
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Unoccupied');  // stacked-merged
        params.push(new PucGraphWidgetParam('zoneSetback' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // zoneVacation
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Vacation');  // stacked-merged
        params.push(new PucGraphWidgetParam('zoneVacation' + this.moduleIdentifier,
            PucGraphColors.SOFT_CYAN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // zonePreconditioning
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Preconditioning');  // stacked-merged
        params.push(new PucGraphWidgetParam('zonePreconditioning' + this.moduleIdentifier,
            PucGraphColors.LIGHT_ORANGE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // zoneTemporaryHold
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Temporary hold');  // stacked-merged
        params.push(new PucGraphWidgetParam('zoneTemporaryHold' + this.moduleIdentifier,
            PucGraphColors.SLIGHTLY_DESATURATED_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // zoneAway
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Away');  // stacked-merged
        params.push(new PucGraphWidgetParam('zoneAway' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

        // occupancyDetection
        // on
        toolTip = new PucToolTipModel(true, 'OccupancyDetection', true); // stacked-merged
        params.push(new PucGraphWidgetParam('occupancyDetectionOn' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_MAGENTA, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));
        // off
        toolTip = new PucToolTipModel(true, 'OccupancyDetection', true); // stacked-merged
        params.push(new PucGraphWidgetParam('occupancyDetectionOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

        return new PucGraphWidgetModel('zone occupancy status', 'occupancyGraph', 'occup',
            params, null, null, PucGraphWidgetHeight.SMALL);
    }
}
