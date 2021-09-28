import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Pi Loop Graph Widget
 */
export class PucHyperSenseGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(senseData) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // Th1
        toolTip = new PucToolTipModel(true, '', false, '', true, senseData.th1);
        params.push(new PucGraphWidgetParam('th1' + this.moduleIdentifier,
            PucGraphColors.THIN_BLUE_COLOR , PucGraphTypes.LINE, toolTip));  // line

        //Th2
        toolTip = new PucToolTipModel(true, '', false, '', true, senseData.th2);
        params.push(new PucGraphWidgetParam('th2' + this.moduleIdentifier,
            PucGraphColors.BLUE, PucGraphTypes.LINE, toolTip));  // line

        // analog1
        toolTip = new PucToolTipModel(true, '', false, '', true, senseData.analog1);
        params.push(new PucGraphWidgetParam('analog1' + this.moduleIdentifier,
            PucGraphColors.STRONG_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));  // line

        // analog2
        toolTip = new PucToolTipModel(true, '', false, '', true, senseData.analog2);
        params.push(new PucGraphWidgetParam('analog2' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREENISH, PucGraphTypes.LINE, toolTip));  // line


        return new PucGraphWidgetModel('SENSE', 'senseGraph', 'senseGraph', params);
    }


    
}
