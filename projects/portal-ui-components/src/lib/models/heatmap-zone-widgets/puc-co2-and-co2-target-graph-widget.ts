import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Co2 And Co2 Target Graph Widget
 */
export class PucCo2AndCo2TargetGraphWidget {
    constructor(private moduleIdentifier: string) { }
    widgetName :any;
    getGraphWidget(profileType) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        if(profileType == "sense"){
            this.widgetName = 'CO2'
        } else {
            this.widgetName = 'CO2 and CO2 Target'
        }

        // co2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2 Sensor(ppm)');  // line
        params.push(new PucGraphWidgetParam('co2' + this.moduleIdentifier,
            PucGraphColors.BRIGHT_RED, PucGraphTypes.LINE, toolTip));

        // zoneCO2Target
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CO2 Target(ppm)');  // line
        params.push(new PucGraphWidgetParam('zoneCO2Target' + this.moduleIdentifier,
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel(this.widgetName , 'co2Graph', 'co2', params);
    }
}
