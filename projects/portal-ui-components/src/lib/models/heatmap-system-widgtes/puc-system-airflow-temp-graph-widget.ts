import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
/**
 * @description: System Airflow Temp Graph Widget
 */
export class PucSystemAirflowTempGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // minCoolingAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'MinCoolingAirflowTemperature');
        params.push(new PucGraphWidgetParam('minCoolingAirflowTemp',
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // maxCoolingAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'MaxCoolingAirflowTemperature');
        params.push(new PucGraphWidgetParam('maxCoolingAirflowTemp',
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // minHeatingAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'MinHeatingAirflowTemperature');
        params.push(new PucGraphWidgetParam('minHeatingAirflowTemp',
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.DASHED_LINE, toolTip)); // dotted

        // maxHeatingAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'MaxHeatingAirflowTemperature');
        params.push(new PucGraphWidgetParam('maxHeatingAirflowTemp',
            PucGraphColors.BRIGHT_RED, PucGraphTypes.DASHED_LINE, toolTip));  // dotted

        // coolingAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CoolingAirflowTemperature');
        params.push(new PucGraphWidgetParam('coolingAirflowTemp',
            PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.LINE, toolTip));    // line

        // heatingAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'HeatingAirflowTemperature');
        params.push(new PucGraphWidgetParam('heatingAirflowTemp',
            PucGraphColors.VERY_SOFT_RED, PucGraphTypes.LINE, toolTip));   // line

        // averageAirflowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'AverageAirflowTemperature');
        params.push(new PucGraphWidgetParam('averageAirflowTemp',
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));   // line

        return new PucGraphWidgetModel('airflow temperature', 'airFlowTemp', 'airFlowTemp', params);
    }
}
