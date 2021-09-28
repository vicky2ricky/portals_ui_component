import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Pi Loop Graph Widget
 */
export class PucPiLoopGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(piLoopData) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // Dynamic Target Value
        toolTip = new PucToolTipModel(true, '', false, '', true, piLoopData.dynamicTarget);
        params.push(new PucGraphWidgetParam('dynamicValue' + this.moduleIdentifier,
            PucGraphColors.ORANGE_SOFT, PucGraphTypes.LINE, toolTip));  // line

        // Target Value
        toolTip = new PucToolTipModel(true, '', false, '', true, piLoopData.target);
        params.push(new PucGraphWidgetParam('targetValue' + this.moduleIdentifier,
            PucGraphColors.ORANGE_SOFT, PucGraphTypes.LINE, toolTip));  // line

        // inputValue
        toolTip = new PucToolTipModel(true, '', false, '', true, piLoopData.input);
        params.push(new PucGraphWidgetParam('inputValue' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_YELLOWISH, PucGraphTypes.LINE, toolTip));  // line

        // controlSignal
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Control Signal');
        params.push(new PucGraphWidgetParam('controlSignal' + this.moduleIdentifier,
            PucGraphColors.LIGHT_ORANGE, PucGraphTypes.LINE, toolTip));  // line

        return new PucGraphWidgetModel('PI LOOP CONTROLLER', 'piLoopGraph', 'piLoopGraph', params);
    }


    
}
