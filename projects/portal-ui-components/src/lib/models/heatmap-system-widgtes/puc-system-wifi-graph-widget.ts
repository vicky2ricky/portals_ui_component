import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description System Wifi Graph Widget
 */
export class PucSystemWifiGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // WifiLinkSpeed
        toolTip = new PucToolTipModel(true);
        params.push(new PucGraphWidgetParam('WifiLinkSpeed', PucGraphColors.VERY_SOFT_MAGENTA, PucGraphTypes.LINE, toolTip));
        // WifiRSSi
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Wifi RSSI');
        params.push(new PucGraphWidgetParam('WifiRSSi', PucGraphColors.VERY_SOFT_RED, PucGraphTypes.LINE, toolTip));
        // WifiStrength
        toolTip = new PucToolTipModel(true);
        params.push(new PucGraphWidgetParam('WifiStrength', PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('WiFi', 'WiFi', 'WiFi', params);
    }
}
