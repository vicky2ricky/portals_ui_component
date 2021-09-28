import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
/**
 * @description: Humidity And Humidity Target Graph Widget
 */
export class PucHumidityAndHumidityTargetGraphWidget {
    constructor(private moduleIdentifier: string) { }
    widgetName:any;
    getGraphWidget(profileType) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;
        if(profileType == "sense"){
            this.widgetName ='humidity'
        } else {
            this.widgetName = 'humidity and humidity target'
        }

        // humidity
         toolTip = new PucToolTipModel(true, '', false, '', true, 'Humidity');
        params.push(new PucGraphWidgetParam('humidity' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.LINE, toolTip));    // line

        // targetMaxInsideHumidty
         toolTip = new PucToolTipModel(true, '', false, '', true, 'TargetMaxInsideHumidty');
        params.push(new PucGraphWidgetParam('targetMaxInsideHumidty' + this.moduleIdentifier,
            PucGraphColors.ORANGE_SOFT, PucGraphTypes.LINE, toolTip));  // line

        return new PucGraphWidgetModel(this.widgetName, 'humidGraph', 'humid', params);
    }
}
