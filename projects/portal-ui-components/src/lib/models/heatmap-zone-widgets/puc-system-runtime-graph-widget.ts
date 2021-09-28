import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
/**
 * @description:System Runtime Graph Widget
 */
export class PucSystemRuntimeGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();

        return new PucGraphWidgetModel('Fetching System Profile...', 'runtimesystemprofile',
            'runtime', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
