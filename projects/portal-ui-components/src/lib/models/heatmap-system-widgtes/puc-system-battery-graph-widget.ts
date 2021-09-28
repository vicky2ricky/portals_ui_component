import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
/**
 * @description: System Battery Graph Widget
 */
export class PucSystemBatteryGraphWidget {
    constructor() { }

    getGraphWidget(isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // BatteryLevel
        toolTip = new PucToolTipModel(true);
        params.push(new PucGraphWidgetParam('BatteryLevel', PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.LINE, toolTip));

        // BatteryCharging
        // on
        toolTip = new PucToolTipModel(true, 'BatteryCharging', true, 'On'); // stacked-merged
        params.push(new PucGraphWidgetParam('batteryOn', PucGraphColors.LIGHT_GREEN,
            PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 3.75 : 0));
        // off
        toolTip = new PucToolTipModel(true, 'BatteryCharging', true, 'Off'); // stacked-merged
        params.push(new PucGraphWidgetParam('batteryOff', PucGraphColors.GREY,
            PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 3.75 : 0));

        // PowerConnected
        // on
        toolTip = new PucToolTipModel(true, 'PowerConnected', true, 'On'); // stacked-merged
        params.push(new PucGraphWidgetParam('powerConnectedOn', PucGraphColors.THIN_PINK_COLOR,
            PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 4.5 : 1));
        // off
        toolTip = new PucToolTipModel(true, 'PowerConnected', true, 'Off'); // stacked-merged
        params.push(new PucGraphWidgetParam('powerConnectedOff', PucGraphColors.GREY,
            PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 4.5 : 1));

        // USBConnected
        // toolTip = new PucToolTipModel(true);
        // params.push(new PucGraphWidgetParam('USBConnected', PucGraphColors.STRONG_RED, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('Battery', 'Battery', 'Battery', params);
    }
}
