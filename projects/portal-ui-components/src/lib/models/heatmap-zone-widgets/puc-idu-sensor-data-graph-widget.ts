import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
/**
 * @description:  IDU Sensor Data
 */
export class PucIduSensorDataGraphWidget {
    constructor(private moduleIdentifier: string) { }
    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // humidity
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Current Humidity');
        params.push(new PucGraphWidgetParam('humidity' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.LINE, toolTip));    // line


        return new PucGraphWidgetModel('IDU Sensor Data', 'iduSensorGrpah', 'idu', params);
    }
}
