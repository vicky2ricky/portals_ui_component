import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
/**
 * @description:System Default Profile Graph Widget
 */
export class PucSystemDefaultProfileGraphWidget {
    constructor() { }

    getGraphWidget(profileName: string) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();

        return new PucGraphWidgetModel(profileName, 'runtimesystemprofile', 'runtime', params);
    }
}
