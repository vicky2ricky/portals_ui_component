import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';

/**
 * @description: Conditioning Status Cpu Graph Widget
 */
export class PucConditioningStatusCpuGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(cpuRelay6Config: string, isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        // fanLow
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Low');
        params.push(new PucGraphWidgetParam('condfanLow' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREENISH, PucGraphTypes.AREA_LINE, toolTip));

        // hpuRelay5Config
        switch (parseInt(cpuRelay6Config, 10)) {
            // Na : relay is switched off
            case 0:
                // Do not show the relay5 stack
                break;
            // fanHigh
            case 1:
                // fanHigh
                // fanHigh
                toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan High');
                params.push(new PucGraphWidgetParam('condfanHigh' + this.moduleIdentifier,
                    PucGraphColors.OCEAN_GREEN, PucGraphTypes.AREA_LINE, toolTip));
                break;
            // humidifier
            case 2:
                // hpuHumidifier
                // hpuHumidifierOn
                toolTip = new PucToolTipModel(true, 'humidifier', true);
                params.push(new PucGraphWidgetParam('cpuHumidifierOn' + this.moduleIdentifier,
                    PucGraphColors.MODERATE_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ?5 : 0))
                // hpuHumidifierOff
                toolTip = new PucToolTipModel(true, 'humidifier', true);
                params.push(new PucGraphWidgetParam('cpuHumidifierOff' + this.moduleIdentifier,
                    PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ?5 : 0))
                break;
            case 3:
                // hpuDehumidifier
                // hpuDehumidifierOn
                toolTip = new PucToolTipModel(true, 'Dehumidifier', true);
                params.push(new PucGraphWidgetParam('cpuDehumidifierOn' + this.moduleIdentifier,
                    PucGraphColors.VERY_SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ?5 : 0))
                // hpuDehumidifierOff
                toolTip = new PucToolTipModel(true, 'Dehumidifier', true);
                params.push(new PucGraphWidgetParam('cpuDehumidifierOff' + this.moduleIdentifier,
                    PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ?5 : 0))
                break;
            default:
                throw new Error('Invalid relay6 config !');
        }

        // coolingStage1
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Cooling Stage1');
        params.push(new PucGraphWidgetParam('condcoolingStage1' + this.moduleIdentifier,
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.AREA, toolTip));

        // coolingStage2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Cooling Stage2');
        params.push(new PucGraphWidgetParam('condcoolingStage2' + this.moduleIdentifier,
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.AREA, toolTip));

        // heatingStage1
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Heating Stage1');
        params.push(new PucGraphWidgetParam('condheatingStage1' + this.moduleIdentifier,
            PucGraphColors.LIGHT_PINK_COLOR, PucGraphTypes.AREA, toolTip));

        // heatingStage2
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Heating Stage2');
        params.push(new PucGraphWidgetParam('condheatingStage2' + this.moduleIdentifier,
            PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.AREA, toolTip));

        return new PucGraphWidgetModel('Conditioning Status', 'condGraph', 'cond', params);
    }
}
