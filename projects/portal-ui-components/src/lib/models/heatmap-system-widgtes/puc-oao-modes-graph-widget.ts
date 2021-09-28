import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
/**
 * @description: Oao Modes Graph Widget
 */
export class PucOaoModesGraphWidget {
    constructor() { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // OperationalMode
        // OperationalModeCooling
        toolTip = new PucToolTipModel(true, 'OperationMode', true, 'cooling');   // stacked merged
        params.push(new PucGraphWidgetParam('OperationalModeCooling',
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 4));
        // OperationalModeHeating
        toolTip = new PucToolTipModel(true, 'OperationMode', true, 'heating');   // stacked merged
        params.push(new PucGraphWidgetParam('OperationalModeHeating',
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 4));
        // OperationalModeOff
        toolTip = new PucToolTipModel(true, 'OperationMode', true, 'Off');   // stacked merged
        params.push(new PucGraphWidgetParam('OperationalModeOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 4));

        // ConditionMode
        // ConditionModeOff
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true, 'Off');   // stacked merged
        params.push(new PucGraphWidgetParam('ConditionModeOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));
        // ConditionModeauto
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true, 'auto');
        params.push(new PucGraphWidgetParam('ConditionModeauto',
            PucGraphColors.SOFT_MAGENTA, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));  // stacked-merged
        // ConditionModeHeatOnly
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true, 'heatOnly');
        params.push(new PucGraphWidgetParam('ConditionModeHeatOnly',
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));  // stacked-merged
        // ConditionModeCoolOnly
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true, 'coolOnly');
        params.push(new PucGraphWidgetParam('ConditionModeCoolOnly',
            PucGraphColors.LIGHT_GRAYISH_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));  // stacked-merged

        // occupancyMode
        // Setpoint
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Occupied');   // stacked-merged
        params.push(new PucGraphWidgetParam('setpoint',
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // Setback
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'Unoccupied');   // stacked-merged
        params.push(new PucGraphWidgetParam('setback',
            PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // Vacation
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'vacation');   // stacked-merged
        params.push(new PucGraphWidgetParam('vacation',
            PucGraphColors.SOFT_CYAN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // preconditioning
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'preconditioning');   // stacked-merged
        params.push(new PucGraphWidgetParam('preconditioning',
            PucGraphColors.LIGHT_ORANGE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // temporaryHold
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'temporaryHold');   // stacked-merged
        params.push(new PucGraphWidgetParam('temporaryHold',
            PucGraphColors.SLIGHTLY_DESATURATED_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // away
        toolTip = new PucToolTipModel(true, 'OccupancyMode', true, 'away');   // stacked-merged
        params.push(new PucGraphWidgetParam('away',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

        // Epidemic mode system state
        // off
        toolTip = new PucToolTipModel(true, 'EpidemicMode', true, 'Off');   // stacked-merged
        params.push(new PucGraphWidgetParam('Off',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // prepurge
        toolTip = new PucToolTipModel(true, 'EpidemicMode', true, 'PrePurge');   // stacked-merged
        params.push(new PucGraphWidgetParam('PrePurge',
            PucGraphColors.PALE_MAGENTA, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // postpurge
        toolTip = new PucToolTipModel(true, 'EpidemicMode', true, 'PostPurge');   // stacked-merged
        params.push(new PucGraphWidgetParam('PostPurge',
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // Enhanced Ventilation
        toolTip = new PucToolTipModel(true, 'EpidemicMode', true, 'EnhancedVentilation');   // stacked-merged
        params.push(new PucGraphWidgetParam('EnhancedVentilation',
            PucGraphColors.VERY_SOFT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));


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

        return new PucGraphWidgetModel('modes', 'modes', 'modes', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
