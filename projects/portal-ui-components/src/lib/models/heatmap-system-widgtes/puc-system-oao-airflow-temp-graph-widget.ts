import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
/**
 * @description: System Oao Airflow Temp Graph Widget
 */
export class PucSystemOaoAirflowTempGraphWidget {
    constructor() { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // outsideEnthalpy
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Outside Enthalpy');
        params.push(new PucGraphWidgetParam('outsideEnthalpy', PucGraphColors.THIN_BLUE_COLOR,
            PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // insideEnthalpy
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Inside Enthalpy');
        params.push(new PucGraphWidgetParam('insideEnthalpy', PucGraphColors.LIGHT_GREEN, PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // maxAirTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Max Air Temperature');
        params.push(new PucGraphWidgetParam('maxAirTemp', PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // minAirTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Min Air Temperature');
        params.push(new PucGraphWidgetParam('minAirTemp',
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.DASHED_LINE, toolTip));   // dotted

        // supplyAirTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Supply Air Temperature');
        params.push(new PucGraphWidgetParam('supplyAirTemp', PucGraphColors.BRIGHT_RED, PucGraphTypes.DASHED_LINE, toolTip));  // dotted

        // mixedAirFlowTemp
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Mixed AirFlow Temperature');
        params.push(new PucGraphWidgetParam('mixedAirFlowTemp',
            PucGraphColors.SOFT_YELLOWISH, PucGraphTypes.LINE, toolTip));    // line

        // weatherOAT
        // toolTip = new PucToolTipModel(true, '', false, '', true, 'weather OAT');  // line
        // params.push(new PucGraphWidgetParam('weatherOAT', PucGraphColors.SLIGHTLY_DESATURATED_LIME_GREEN, PucGraphTypes.LINE, toolTip));

        // LocalOAT
        // toolTip = new PucToolTipModel(true, '', false, '', true, 'Local OAT');  // line
        // params.push(new PucGraphWidgetParam('LocalOAT', PucGraphColors.DARK_LIGHT_SOFT_BLUE, PucGraphTypes.LINE, toolTip));

        return new PucGraphWidgetModel('OAO temperature', 'OaoTemp', 'OaoTemp', params, null, null, PucGraphWidgetHeight.LARGE);
    }
}
