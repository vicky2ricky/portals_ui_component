import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
/**
 * @description: System Cm Data Graph Widget
 */
export class PucSystemCmDataGraphWidget {
    constructor() { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // CMDesiredTemperatureHeating
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CM Heating Desired Temperature');
        params.push(new PucGraphWidgetParam('CMDesiredTemperatureHeating',
            PucGraphColors.VERY_SOFT_RED, PucGraphTypes.LINE, toolTip));
        // CMDesiredTemperatureCooling
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CM Cooling Desired Temperature');
        params.push(new PucGraphWidgetParam('CMDesiredTemperatureCooling',
            PucGraphColors.LIGHT_GRAYISH_CYAN, PucGraphTypes.LINE, toolTip));
        // CMCurrentTemperature
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CM Current Temperature');
        params.push(new PucGraphWidgetParam('CMCurrentTemperature',
            PucGraphColors.ZONE_DARK_MODERATE_BLUE, PucGraphTypes.LINE, toolTip));
        // CMAlive
        toolTip = new PucToolTipModel(true, 'CMAlive', true, 'On'); // stacked-merged
        params.push(new PucGraphWidgetParam('CMAliveOn',
            PucGraphColors.VERY_SOFT_MAGENTA, PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 4 : 0));
        // off
        toolTip = new PucToolTipModel(true, 'CMAlive', true, 'Off'); // stacked-merged
        params.push(new PucGraphWidgetParam('CMAliveOff',
            PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 4 : 0));

        return new PucGraphWidgetModel('CM Data', 'cmData', 'cmData', params);
    }
}
