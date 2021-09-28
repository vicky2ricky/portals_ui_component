import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: VOC and VOC Target Graph Widget
 */
export class PucVOCAndVOCTargetGraphWidget {
    constructor(private moduleIdentifier: string) { }
    widgetName:any;
    getGraphWidget(profileType) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        if(profileType == "sense"){
            this.widgetName = 'VOC'
        } else {
            this.widgetName = 'VOC and VOC Target'
        }

        // voc
        toolTip = new PucToolTipModel(true, '', false, '', true, 'VOC Sensor(ppb)');   // line
        params.push(new PucGraphWidgetParam('voc' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN, PucGraphTypes.LINE, toolTip));

        // zoneVOCTarget
        toolTip = new PucToolTipModel(true, '', false, '', true, 'VOC Target(ppb)');   // line
        params.push(new PucGraphWidgetParam('zoneVOCTarget' + this.moduleIdentifier,
            PucGraphColors.SOFT_REDISH, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel(this.widgetName, 'vocGraph', 'voc', params);
    }
}
