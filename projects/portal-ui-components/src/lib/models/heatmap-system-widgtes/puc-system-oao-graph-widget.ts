import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
/**
 * @description: System Oao Graph Widget
 */
export class PucSystemOaoGraphWidget {
    constructor() { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // outsideAirDamperPosition
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Outside Air Damper Position');
        params.push(new PucGraphWidgetParam('outsideAirDamperPosition', PucGraphColors.THIN_BLUE_COLOR,
            PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // returnDamperPosition
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Return Damper Position');
        params.push(new PucGraphWidgetParam('returnDamperPosition', PucGraphColors.LIGHT_GREEN,
            PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // CO2Threshold
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2 Threshold');
        params.push(new PucGraphWidgetParam('CO2Threshold', PucGraphColors.BRIGHT_RED, PucGraphTypes.DASHED_LINE, toolTip));  // dotted

        // returnAirCO2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Return Air CO2');
        params.push(new PucGraphWidgetParam('returnAirCO2', PucGraphColors.BLUE, PucGraphTypes.LINE, toolTip));    // line

        // co2DamperOpeningRate
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2 Damper Opening Rate');
        params.push(new PucGraphWidgetParam('co2DamperOpeningRate',
            PucGraphColors.VERY_LIGHT_MAGENTA, PucGraphTypes.LINE, toolTip));   // line

        // exhaustFanStage1
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Exhaust Fan Stage1');
        params.push(new PucGraphWidgetParam('exhaustFanStage1',
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));   // line

        // exhaustFanStage2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Exhaust Fan Stage2');
        params.push(new PucGraphWidgetParam('exhaustFanStage2',
            PucGraphColors.OCEAN_GREEN, PucGraphTypes.LINE, toolTip));   // line

        // co2WeightedAverage
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2 Weighted Average');
        params.push(new PucGraphWidgetParam('co2WeightedAverage', PucGraphColors.PALE_MAGENTA, PucGraphTypes.LINE, toolTip));   // line

        // usePerRoomCo2Sensing
        toolTip = new PucToolTipModel(true, '', true, 'On',true,'Use Per Room CO2 Sensing'); // stacked-merged
        params.push(new PucGraphWidgetParam('usePerRoomCo2SensingOn',
            PucGraphColors.PALE_RED, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 8 : 0.75));
        // off
        toolTip = new PucToolTipModel(true, '', true, 'Off',true,'Use Per Room CO2 Sensing'); // stacked-merged
        params.push(new PucGraphWidgetParam('usePerRoomCo2SensingOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 8 : 0.75));

        // freeCoolingAvailable
        toolTip = new PucToolTipModel(true, '', true, 'On', true, 'Free Cooling - Economization Action'); // stacked-merged
        params.push(new PucGraphWidgetParam('freeCoolingEconomizeOn',
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 9 : 1.75));
        // off
        toolTip = new PucToolTipModel(true, '', true, 'Off',true, 'Free Cooling - Economization Action'); // stacked-merged
        params.push(new PucGraphWidgetParam('freeCoolingEconomizeOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 9 : 1.75));

         // freeCoolingAvailable
         toolTip = new PucToolTipModel(true, '', true, 'On',true, 'Free Cooling - DCV Ventilation Action'); // stacked-merged
         params.push(new PucGraphWidgetParam('freeCoolingDCVOn',
             PucGraphColors.SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 10 : 2.75));
         // off
         toolTip = new PucToolTipModel(true, '', true, 'Off',true, 'Free Cooling - DCV Ventilation Action'); // stacked-merged
         params.push(new PucGraphWidgetParam('freeCoolingDCVOff',
             PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 10 : 2.75));

         // freeCoolingAvailable
         toolTip = new PucToolTipModel(true, '', true, 'On',true, 'Free Cooling - Limited by MAT'); // stacked-merged
         params.push(new PucGraphWidgetParam('freeCoolingMatOn',
             PucGraphColors.VIVID_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 11 : 3.75));
         // off
         toolTip = new PucToolTipModel(true, '', true, 'Off',true, 'Free Cooling - Limited by MAT'); // stacked-merged
         params.push(new PucGraphWidgetParam('freeCoolingMatOff',
             PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 11 : 3.75));

        return new PucGraphWidgetModel('OAO Details', 'OAO', 'OAO', params, null, null, PucGraphWidgetHeight.XLARGE);
    }
}
