import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Airflow Water Temp 2pfcu Graph Widget
 */
export class PucAirflowWaterTemp2pfcuGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // airflowTempSensorTh1
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Airflow Temp Sensor TH1');
        params.push(new PucGraphWidgetParam('airflowTempSensorTh1' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));

        // SupplyWaterTemperature
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Supply Water Temperature');
        params.push(new PucGraphWidgetParam('SupplyWaterTemperature' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.LINE, toolTip));

        // airflow Alert
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Airflow Alert');
        params.push(new PucGraphWidgetParam('airflowAlert' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('Airflow/Water Flow Temperature', 'airflowGraph', 'airflow', params);
    }
}
