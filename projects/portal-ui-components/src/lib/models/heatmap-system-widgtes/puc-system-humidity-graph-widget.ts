import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
/**
 * @description: System Humidity Graph Widget
 */
export class PucSystemHumidityGraphWidget {
    constructor() { }

    getGraphWidget(humidifierEnabled) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // humidityCompOffset
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Humidity Compensation Offset');
        params.push(new PucGraphWidgetParam('humidityCompOffset', PucGraphColors.VERY_LIGHT_RED, PucGraphTypes.LINE, toolTip)); // line

        // cmHumidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CM Humidity');
        params.push(new PucGraphWidgetParam('cmHumidity', PucGraphColors.SOFT_MAGENTA, PucGraphTypes.LINE, toolTip));  // line

        // outsideHumidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Outside Humidity');
        params.push(new PucGraphWidgetParam('outsideHumidity', PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));    // line

        // insideHumidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Inside Humidity');
        params.push(new PucGraphWidgetParam('insideHumidity',
            PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));   // line

        // calcHumidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Calculated Humidity');
        params.push(new PucGraphWidgetParam('calcHumidity', PucGraphColors.SOFT_YELLOWISH, PucGraphTypes.LINE, toolTip));   // line

        // humidifierTarget
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Humidifier Target');
        params.push(new PucGraphWidgetParam('humidifierTarget', PucGraphColors.BRIGHT_RED,
            PucGraphTypes.DASHED_LINE, toolTip));  // dotted

        // useHumidityComp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Use Humidity Compensation');
        params.push(new PucGraphWidgetParam('useHumidityComp',
            PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.LINE, toolTip));   // stacked gray

        // maxAirHumidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Max Inside Humidity');
        params.push(new PucGraphWidgetParam('maxAirHumidity',
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.LINE, toolTip));  // dotted

        // minAirHumidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Min Inside Humidity');
        params.push(new PucGraphWidgetParam('minAirHumidity',
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip));  // dotted

        if(humidifierEnabled) {
            // Humidity Set Point
            toolTip = new PucToolTipModel(true, '', false, '', true, 'Humidity Setpoint','maxAirHumidity',);
            params.push(new PucGraphWidgetParam('setPoint', 
            PucGraphColors.SOFT_BLUE, PucGraphTypes.LINE, toolTip));   // line
        }
    

        return new PucGraphWidgetModel('humidity', 'humidity', 'humidity', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
