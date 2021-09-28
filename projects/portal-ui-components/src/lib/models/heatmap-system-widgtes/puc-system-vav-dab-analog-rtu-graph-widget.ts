import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
/**
 * @description: System Vav Dab Analog Rtu Graph Widget
 */
export class PucSystemVavDabAnalogRtuGraphWidget {
    constructor() { }

    getGraphWidget(profileName: string, isFac = false) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // cooling
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Cooling');
        params.push(new PucGraphWidgetParam('cooling', PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.LINE, toolTip)); // line


        // fanSpeed
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Speed');
        params.push(new PucGraphWidgetParam('fanSpeed',
            PucGraphColors.VERY_DARK_CYAN_LIME_GREENISH, PucGraphTypes.LINE, toolTip));    // line

        // heating
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Heating');
        params.push(new PucGraphWidgetParam('heating',
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.LINE, toolTip)); // line

        // fanEnable
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Enable');
        params.push(new PucGraphWidgetParam('fanEnable',
            PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));   // stacked gray

        // systemDeHumidifier
        // systemDeHumidifierOff
        toolTip = new PucToolTipModel(true, 'Dehumidifier', true); // stacked-merged
        params.push(new PucGraphWidgetParam('systemDeHumidifierOff', PucGraphColors.GREY,
            PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 8 : 0));    // stacked gray
        // systemDeHumidifierOn
        toolTip = new PucToolTipModel(true, 'Dehumidifier', true); // stacked-merged
        params.push(new PucGraphWidgetParam('systemDeHumidifierOn', PucGraphColors.MOSTLY_PURE_BLUE,
            PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 8 : 0));    // stacked gray

        // systemHumidifier
        // systemHumidifierOff
        toolTip = new PucToolTipModel(true, 'Humidifier', true, 'Off'); // stacked-merged
        params.push(new PucGraphWidgetParam('systemHumidifierOff', PucGraphColors.GREY,
            PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 8: 1));  // stacked gray
        // systemHumidifierOn
        toolTip = new PucToolTipModel(true, 'Humidifier', true, 'On'); // stacked-merged
        params.push(new PucGraphWidgetParam('systemHumidifierOn', PucGraphColors.LIGHT_CYAN,
            PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 8 : 1));  // stacked gray

        // CW
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Chilled Water Valve Position');
        params.push(new PucGraphWidgetParam('chilledwatervalveposition',
            PucGraphColors.CHILLED_WATER_VALUE_POSITION, PucGraphTypes.LINE, toolTip)); // line

        // Inlet
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Inlet Chilled Water Temperature');
        params.push(new PucGraphWidgetParam('inletchilledwatertemperature',
            PucGraphColors.INLET_CHILLED_WATER_VALUE_POSITION, PucGraphTypes.LINE, toolTip)); // line


        // Outlet
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Exit Chilled Water Temperature');
        params.push(new PucGraphWidgetParam('exitchilledwatertemperature',
            PucGraphColors.EXIT_CHILLED_WATER_VALUE_POSITION, PucGraphTypes.LINE, toolTip)); // line

        // adaptive
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Adaptive Comfort Threshold');
        params.push(new PucGraphWidgetParam('adaptivecomfortthreshold',
            PucGraphColors.ADAPTIVE_COMFORT_THRESHOLD, PucGraphTypes.LINE, toolTip)); // line

        // Outlet exit temp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Chilled Water Exit Temperature Target');
        params.push(new PucGraphWidgetParam('chilledwatertargetexittemperature',
            PucGraphColors.CHILLED_WATER_TARGET_EXIT_TEMP, PucGraphTypes.LINE, toolTip)); // line


        return new PucGraphWidgetModel(profileName, 'runtimesystemprofile', 'runtimesystemprofile',
            params, null, null, PucGraphWidgetHeight.LARGE);
    }
}

