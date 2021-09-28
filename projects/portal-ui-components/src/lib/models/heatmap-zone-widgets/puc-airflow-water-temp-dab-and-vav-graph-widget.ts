import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Airflow Water Temp Dab And Vav Graph Widget
 */

export class PucAirflowWaterTempDabAndVavGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(isDualDuct = false) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // enteringAirTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Entering Airflow Temp');
        params.push(new PucGraphWidgetParam('enteringAirTemp' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.LINE, toolTip));

        // dischargeAirTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Discharge Airflow Temp');
        params.push(new PucGraphWidgetParam('dischargeAirTemp' + this.moduleIdentifier,
            isDualDuct ? PucGraphColors.DARK_BLUE_COLOR : PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GRAY, PucGraphTypes.LINE, toolTip));

        // airflow Alert
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Airflow Alert');
        params.push(new PucGraphWidgetParam('airflow Alert' + this.moduleIdentifier,
            PucGraphColors.BRIGHT_RED, PucGraphTypes.LINE, toolTip));

        // coolingSupplyAir Alert
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Cooling Supply Airflow');
        params.push(new PucGraphWidgetParam('coolingSupplyAirflow' + this.moduleIdentifier,
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.LINE, toolTip));

        // heatingSupplyAir Alert
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Heating Supply Airflow');
        params.push(new PucGraphWidgetParam('heatingSupplyAirflow' + this.moduleIdentifier,
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('Airflow/Water Flow Temperature', 'airflowGraph', 'airflow', params);
    }
}
