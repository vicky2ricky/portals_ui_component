import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description: sensor data ss Graph Widget
 */

export class PucSensorDataSsGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // SENSOR_HUMIDITY
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Humidity Sensor');
        params.push(new PucGraphWidgetParam('Humidity' + this.moduleIdentifier,
            PucGraphColors.BLUE, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_CO2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2 Sensor(ppm)');
        params.push(new PucGraphWidgetParam('CO2' + this.moduleIdentifier,
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_CO
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO Sensor(ppm)');
        params.push(new PucGraphWidgetParam('CO' + this.moduleIdentifier,
            PucGraphColors.SOFTISH_ORANGE, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_NO
        toolTip = new PucToolTipModel(true, '', false, '', true, 'NO Sensor');
        params.push(new PucGraphWidgetParam('NO' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_VOC
        toolTip = new PucToolTipModel(true, '', false, '', true, 'VOC Sensor(ppb)');
        params.push(new PucGraphWidgetParam('VOC' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_PRESSURE
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Pressure Sensor');
        params.push(new PucGraphWidgetParam('Pressure' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_SOUND
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Sound Sensor');
        params.push(new PucGraphWidgetParam('sound' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFTISH_RED, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_CO2_EQUIVALENT
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2-Eq(ppm)');
        params.push(new PucGraphWidgetParam('CO2Equivalent' + this.moduleIdentifier,
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_ILLUMINANCE
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Illuminance');
        params.push(new PucGraphWidgetParam('Illuminance' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFTISH_YELLOW, PucGraphTypes.LINE, toolTip));   // line

        // SENSOR_UVI
        toolTip = new PucToolTipModel(true, '', false, '', true, 'UVI');
        params.push(new PucGraphWidgetParam('UVI' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_MAGENTA, PucGraphTypes.LINE, toolTip));   // line

        // SENSOR_OCCUPANCY
        // OccupancyOn
        toolTip = new PucToolTipModel(true, 'Occupancy', true); // stacked-merged
        params.push(new PucGraphWidgetParam('OccupancyOn' + this.moduleIdentifier,
            PucGraphColors.VERY_PALE_YELLOW, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 6.3 : 0));
        // OccupancyOff
        toolTip = new PucToolTipModel(true, 'Occupancy', true); // stacked-merged
        params.push(new PucGraphWidgetParam('OccupancyOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 6.3 : 0));

        return new PucGraphWidgetModel('Sensor Data', 'sensorData', 'sensor', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
