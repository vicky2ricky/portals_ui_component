import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description System VAV/DAB Daikin IE Graph Widget
 */
export class PucSystemVavDabDaikinIEGraphWidget {
    constructor() { }

    getGraphWidget(profileName: string) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // coolingDischargeAirTemperature
        toolTip = new PucToolTipModel(true); // line
        params.push(new PucGraphWidgetParam('CoolingDischargeAirTemperature', PucGraphColors.DARK_BLUE_COLOR,
            PucGraphTypes.LINE, toolTip));

        // heatingDischargeAirTemperature
        toolTip = new PucToolTipModel(true);   // line
        params.push(new PucGraphWidgetParam('HeatingDischargeAirTemperature', PucGraphColors.THIN_PINK_COLOR,
            PucGraphTypes.LINE, toolTip));

        // //conditioningMode
        // //conditioningModeCooling
        // toolTip = new PucToolTipModel(true);   //Merged stack
        // params.push(new PucGraphWidgetParam('conditioningModeCooling', PucGraphColors.MODERATE_LIGHT_BLUE,
        // PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip));
        // //conditioningModeHeating
        // toolTip = new PucToolTipModel(true);   //Merged stack
        // params.push(new PucGraphWidgetParam('conditioningModeHeating', PucGraphColors.MODERATE_ORANGE,
        // PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip));

        // Fan Speed
        toolTip = new PucToolTipModel(true);   // line
        params.push(new PucGraphWidgetParam('FanSpeed', PucGraphColors.FAN_SPEED,
            PucGraphTypes.LINE, toolTip));

        // Fan LOOP OUTPUT
        toolTip = new PucToolTipModel(true);   // line
        params.push(new PucGraphWidgetParam('FanLoopOutput', PucGraphColors.LIGHT_GREEN ,
                PucGraphTypes.LINE, toolTip));
    
        //Static Pressure
        toolTip = new PucToolTipModel(true);   // line
        params.push(new PucGraphWidgetParam('StaticPressure', PucGraphColors.STATIC_PRESSURE,
                PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel(profileName, 'runtimesystemprofile', 'runtimesystemprofile', params);
    }
}
