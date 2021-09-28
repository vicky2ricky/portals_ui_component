import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Zone Modes Graph Widget 2P 4P Fcu
 */
export class PucZoneModesGraphWidget2P4PFcu {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // ZoneConditionMode
        // ZoneConditionModeOff
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('ZoneConditionModeOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));
        // ZoneConditionModeauto
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);
        params.push(new PucGraphWidgetParam('ZoneConditionModeauto' + this.moduleIdentifier,
            PucGraphColors.SOFT_MAGENTA, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));  // stacked-merged
        // ZoneConditionModeHeatOnly
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);
        params.push(new PucGraphWidgetParam('ZoneConditionModeHeatOnly' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));  // stacked-merged
        // ZoneConditionModeCoolOnly
        toolTip = new PucToolTipModel(true, 'ConditioningMode', true);
        params.push(new PucGraphWidgetParam('ZoneConditionModeCoolOnly' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));  // stacked-merged

        // ZoneOperationalMode
        // ZoneOperationalModeCooling
        toolTip = new PucToolTipModel(true, 'OperationMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('ZoneOperationalModeCooling' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // ZoneOperationalModeHeating
        toolTip = new PucToolTipModel(true, 'OperationMode', true);   // stacked merged
        params.push(new PucGraphWidgetParam('ZoneOperationalModeHeating' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));
        // ZoneOperationalModeOff
        toolTip = new PucToolTipModel(true, 'OperationMode', true);  // stacked merged
        params.push(new PucGraphWidgetParam('ZoneOperationalModeOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

        // FanModeFCU
        // off
        toolTip = new PucToolTipModel(true, 'FanMode', true);
        params.push(new PucGraphWidgetParam('FanModeFCUOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));    // stacked-merged
        // auto
        toolTip = new PucToolTipModel(true, 'FanMode', true);
        params.push(new PucGraphWidgetParam('FanModeFCUAuto' + this.moduleIdentifier,
            PucGraphColors.OCEAN_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));    // stacked-merged
        // fanLow
        toolTip = new PucToolTipModel(true, 'FanMode', true);
        params.push(new PucGraphWidgetParam('FanModeFCULow' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));    // stacked-merged
        // fanMedium
        toolTip = new PucToolTipModel(true, 'FanMode', true);
        params.push(new PucGraphWidgetParam('FanModeFCUMedium' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));    // stacked-merged
        // fanHigh
        toolTip = new PucToolTipModel(true, 'FanMode', true);
        params.push(new PucGraphWidgetParam('FanModeFCUHigh' + this.moduleIdentifier,
            PucGraphColors.STRONG_CYAN_LIME_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));    // stacked-merged

        return new PucGraphWidgetModel('Modes', 'modes', 'modes', params);
    }
}
