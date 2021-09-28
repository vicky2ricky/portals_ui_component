import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Zone Priority Graph Widget
 */
export class PucZonePriorityGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // zonePriority
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Zone Priority');
        params.push(new PucGraphWidgetParam('zonePriority' + this.moduleIdentifier, PucGraphColors.SOFT_RED, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('zone priority', 'zonePriority', 'zPriority', params);
    }
}
