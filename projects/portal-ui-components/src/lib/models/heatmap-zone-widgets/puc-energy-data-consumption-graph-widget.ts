import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
/**
 * @description: Energy Data Consumption Graph Widget
 */
export class PucEnergyDataConsumptionGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // Energymeter
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Energy Meter Reading');
        params.push(new PucGraphWidgetParam('energyMeterReading' + this.moduleIdentifier,
            PucGraphColors.SLIGHTLY_DESATURATED_LIME_GREENISH, PucGraphTypes.LINE, toolTip)); // dotted

        // currentrate
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Current Rate');
        params.push(new PucGraphWidgetParam('currentRate' + this.moduleIdentifier,
            PucGraphColors.PALE_MAGENTA, PucGraphTypes.LINE, toolTip));  // line

        return new PucGraphWidgetModel('ENERGY DATA CONSUMPTION', 'energyGraph', 'energyGraph', params);
    }
}
