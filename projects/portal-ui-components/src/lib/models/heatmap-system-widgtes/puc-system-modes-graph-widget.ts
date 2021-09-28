import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import {
    PucGraphColors
} from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
/**
 * @description: System Modes Graph Widget
 */
export class PucSystemModesGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;


        // OperationalMode
        // OperationalModeCooling
        toolTip = new PucToolTipModel(true, 'OperationMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('OperationalModeCooling',
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));
        // OperationalModeHeating
        toolTip = new PucToolTipModel(true, 'OperationMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('OperationalModeHeating',
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));
        // OperationalModeOff
        toolTip = new PucToolTipModel(true, 'OperationMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('OperationalModeOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));

        // ConditionMode
        // ConditionModeOff
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('ConditionModeOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // ConditionModeauto
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);
        params.push(new PucGraphWidgetParam('ConditionModeauto',
            PucGraphColors.SOFT_MAGENTA, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));  // stacked-merged
        // ConditionModeHeatOnly
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);
        params.push(new PucGraphWidgetParam('ConditionModeHeatOnly',
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));  // stacked-merged
        // ConditionModeCoolOnly
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);
        params.push(new PucGraphWidgetParam('ConditionModeCoolOnly',
            PucGraphColors.LIGHT_GRAYISH_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));  // stacked-merged


        // occupancyMode
        // Setpoint
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Occupied');   // stacked-merged
        params.push(new PucGraphWidgetParam('setpoint',
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // Setback
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Unoccupied');   // stacked-merged
        params.push(new PucGraphWidgetParam('setback',
            PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // Vacation
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'vacation');   // stacked-merged
        params.push(new PucGraphWidgetParam('vacation',
            PucGraphColors.SOFT_CYAN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // preconditioning
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'preconditioning');   // stacked-merged
        params.push(new PucGraphWidgetParam('preconditioning',
            PucGraphColors.LIGHT_ORANGE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // temporaryHold
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'temporaryHold');   // stacked-merged
        params.push(new PucGraphWidgetParam('temporaryHold',
            PucGraphColors.SLIGHTLY_DESATURATED_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // away
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'away');   // stacked-merged
        params.push(new PucGraphWidgetParam('away',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

        //Occ Status
        //inOccupied
        toolTip = new PucToolTipModel(true, 'OccupancyStatus', true,'Occupied');   // stacked merged
        params.push(new PucGraphWidgetParam('Occupied',
            PucGraphColors.OCCSTATUS_OCCUPIED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));
        //UNOccupied
        toolTip = new PucToolTipModel(true, 'OccupancyStatus', true,'Unoccupied');
        params.push(new PucGraphWidgetParam('Unoccupied',
            PucGraphColors.OCCSTATUS_UNOCCUPIED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));  // stacked-merged
        //tntor
        toolTip = new PucToolTipModel(true, 'OccupancyStatus', true,'Tenant Override');
        params.push(new PucGraphWidgetParam('Tenant Override',
            PucGraphColors.OCCSTATUS_TENEANTOVERRIDE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));  // stacked-merged



        return new PucGraphWidgetModel('modes', 'modes', 'modes', params);
    }
}
