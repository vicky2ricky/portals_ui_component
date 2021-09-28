import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
/**
 * @description: System Comfort Index Graph Widget
 */
export class PucSystemComfortIndexGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();

        return new PucGraphWidgetModel('Fetching Comfort Index...', 'comfortIndex', 'comfortIndex', params);
    }
}
