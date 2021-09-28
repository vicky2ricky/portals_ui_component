import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description: Current Vs Desired Temp Graph Widget
 */
export class PucCurrentVsDesiredTempGraphWidget {
    constructor(private moduleIdentifier: string) { }
    widgetName:any

    getGraphWidget(profileType) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        if(profileType == "sense"){
            this.widgetName = 'Current'
        } else {
            this.widgetName = 'current vs desired' 
        }

        // desiredTempHeating
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Heating Desired Temp');
        params.push(new PucGraphWidgetParam('desiredTempHeating' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.LINE, toolTip)); // line

        // desiredTempCooling
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Cooling Desired Temp');
        params.push(new PucGraphWidgetParam('desiredTempCooling' + this.moduleIdentifier,
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.LINE, toolTip)); // line

        // currenttemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Current Temp');
        params.push(new PucGraphWidgetParam('currentTemp' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip)); // line

        // coolingUserLimitMax
        toolTip = new PucToolTipModel(true, '', false, '', true, 'User Cooling Max Limit');
        params.push(new PucGraphWidgetParam('coolingUserLimitMax' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GRAYISH_BLUE, PucGraphTypes.BAND, toolTip));     // type band

        // coolingUserLimitMin
        toolTip = new PucToolTipModel(true, '', false, '', true, 'User Cooling Min Limit');
        params.push(new PucGraphWidgetParam('coolingUserLimitMin' + this.moduleIdentifier,
            PucGraphColors.LIGHT_GRAYISH_BLUE, PucGraphTypes.BAND, toolTip));    // type band

        // heatingUserLimitMax
        toolTip = new PucToolTipModel(true, '', false, '', true, 'User Heating Max Limit');
        params.push(new PucGraphWidgetParam('heatingUserLimitMax' + this.moduleIdentifier,
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.BAND, toolTip)); // type band

        // heatingUserLimitMin
        toolTip = new PucToolTipModel(true, '', false, '', true, 'User Heating Min Limit');
        params.push(new PucGraphWidgetParam('heatingUserLimitMin' + this.moduleIdentifier,
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.BAND, toolTip)); // type band

        return new PucGraphWidgetModel(this.widgetName, 'tempGraph', 'temp', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
