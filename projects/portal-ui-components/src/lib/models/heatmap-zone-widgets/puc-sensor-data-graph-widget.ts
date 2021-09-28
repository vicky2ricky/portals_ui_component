import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: sensor data ss Graph Widget
 */

export class PucSensorDataGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(isFac = false) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // SENSOR_CO
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO Sensor(ppm)');
        params.push(new PucGraphWidgetParam('CO' + this.moduleIdentifier,
            PucGraphColors.SOFTISH_ORANGE, PucGraphTypes.LINE, toolTip));    // line

        // SENSOR_NO
        toolTip = new PucToolTipModel(true, '', false, '', true, 'NO Sensor');
        params.push(new PucGraphWidgetParam('NO' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));    // line

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

        //pm2p5
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Pm2P5 Sensor');
        params.push(new PucGraphWidgetParam('pm2p5' + this.moduleIdentifier,
            PucGraphColors.ORANGE_SOFT , PucGraphTypes.LINE, toolTip));    // line

        //pm10
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Pm10 Sensor');
        params.push(new PucGraphWidgetParam('pm10' + this.moduleIdentifier,
            PucGraphColors.INLET_CHILLED_WATER_VALUE_POSITION  , PucGraphTypes.LINE, toolTip));    // line

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
            PucGraphColors.VERY_PALE_YELLOW, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 7 : 0));
        // OccupancyOff
        toolTip = new PucToolTipModel(true, 'Occupancy', true); // stacked-merged
        params.push(new PucGraphWidgetParam('OccupancyOff' + this.moduleIdentifier,
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 7 : 0));


        return new PucGraphWidgetModel('Sensor Data', 'sensorData', 'sensor', params);
    }
}
