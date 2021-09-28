import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
/**
 * @description: System Avg Temp Graph Widget
 */
export class PucSystemAvgTempGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // avgcurrenttemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Average Current Temperature');
        params.push(new PucGraphWidgetParam('avgcurrenttemp', PucGraphColors.VERY_LIGHTISH_MAGENTA,
            PucGraphTypes.LINE, toolTip)); // line

        // heatingUserLimitMax
        toolTip = new PucToolTipModel(true, '', false, '', true, 'HeatingUserLimitMax');
        params.push(new PucGraphWidgetParam('heatingUserLimitMax', PucGraphColors.LIGHT_PINK_COLOR,
            PucGraphTypes.DASHED_LINE, toolTip));    // dotted

        // heatingUserLimitMin
        toolTip = new PucToolTipModel(true, '', false, '', true, 'HeatingUserLimitMin');
        params.push(new PucGraphWidgetParam('heatingUserLimitMin', PucGraphColors.THIN_PINK_COLOR,
            PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // coolinguserLimitMin
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CoolingUserLimitMin');
        params.push(new PucGraphWidgetParam('coolingUserLimitMin', PucGraphColors.LIGHT_NAVY_BLUE_COLOR,
            PucGraphTypes.DASHED_LINE, toolTip)); // dotted

        // coolinguserLimitMax
        toolTip = new PucToolTipModel(true, '', false, '', true, 'CoolingUserLimitMax');
        params.push(new PucGraphWidgetParam('coolingUserLimitMax', PucGraphColors.THIN_BLUE_COLOR
            , PucGraphTypes.DASHED_LINE, toolTip)); // dotted

        // buildingLimitMax
        toolTip = new PucToolTipModel(true, '', false, '', true, 'BuildingLimitMax');
        params.push(new PucGraphWidgetParam('buildingLimitMax', PucGraphColors.BRIGHT_RED,
            PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // buildingLimitMin
        toolTip = new PucToolTipModel(true, '', false, '', true, 'BuildingLimitMin');
        params.push(new PucGraphWidgetParam('buildingLimitMin',
            PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip)); // dotted


        return new PucGraphWidgetModel('average temperature', 'avgTemp', 'avgTemp', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
