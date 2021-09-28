import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Airflow Water Temp Sse Graph Widget
 */
export class PucAirflowWaterTempSseGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;


        // AirFlowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Airflow Temp');
        params.push(new PucGraphWidgetParam('AirFlowTemp' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GREEN, PucGraphTypes.LINE, toolTip));

        // airflow Alert
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Airflow Alert');
        params.push(new PucGraphWidgetParam('airflow Alert' + this.moduleIdentifier,
            PucGraphColors.BRIGHT_RED, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('Airflow/Water Flow Temperature', 'airflowGraph', 'airflow', params);
    }
}
