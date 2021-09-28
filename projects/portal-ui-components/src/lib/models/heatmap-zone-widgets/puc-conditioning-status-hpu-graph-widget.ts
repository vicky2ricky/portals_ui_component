import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description: Conditioning Status Hpu Graph Widget
 */
export class PucConditioningStatusHpuGraphWidget {
    constructor(private moduleIdentifier: string) { }

    getGraphWidget(hpcType: string, hpuRelay5Config: string, isFac) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;
        let bumpOrder = false;

        let type: PucGraphTypes;
        let stackOrder: number;

        // compressorStage1
        // Heat
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Compressor Stage1 Heat');
        params.push(new PucGraphWidgetParam('compressorStage1Heat' + this.moduleIdentifier,
            PucGraphColors.SOFTISH_YELLOW, PucGraphTypes.AREA, toolTip));
        // Cool
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Compressor Stage1 Cool');
        params.push(new PucGraphWidgetParam('compressorStage1Cool' + this.moduleIdentifier,
            PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.AREA, toolTip));

        // compressorStage2
        // Heat
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Compressor Stage2 Heat');
        params.push(new PucGraphWidgetParam('compressorStage2Heat' + this.moduleIdentifier,
            PucGraphColors.VERY_LIGHT_ORANGE, PucGraphTypes.AREA, toolTip));
        // Cool
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Compressor Stage2 Cool');
        params.push(new PucGraphWidgetParam('compressorStage2Cool' + this.moduleIdentifier,
            PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.AREA, toolTip));

        // fanLow
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan Low');
        params.push(new PucGraphWidgetParam('fanLow' + this.moduleIdentifier,
            PucGraphColors.VERY_SOFT_CYAN_LIME_GREENISH, PucGraphTypes.AREA_LINE, toolTip));

        // auxHeating
        toolTip = new PucToolTipModel(true, '', false, '', true, 'Aux Heating');
        params.push(new PucGraphWidgetParam('auxHeating' + this.moduleIdentifier,
            PucGraphColors.SOFTISH_ORANGE, PucGraphTypes.AREA, toolTip));

        // hpuRelay5Config
        switch (parseInt(hpuRelay5Config, 10)) {
            // Na : relay is switched off
            case 0:
                // Do not show the relay5 stack
                break;
            // fanHigh
            case 1:
                // fanHigh
                toolTip = new PucToolTipModel(true, '', false, '', true, 'Fan High');
                params.push(new PucGraphWidgetParam('fanHigh' + this.moduleIdentifier,
                    PucGraphColors.OCEAN_GREEN, PucGraphTypes.AREA_LINE, toolTip));
                break;
            // humidifier
            case 2:
                bumpOrder = true;
                // hpuHumidifier
                // hpuHumidifierOn
                toolTip = new PucToolTipModel(true, 'Humidifier', true);
                params.push(new PucGraphWidgetParam('hpuHumidifierOn' + this.moduleIdentifier,
                    PucGraphColors.MODERATE_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 6.4 : 0));
                // hpuHumidifierOff
                toolTip = new PucToolTipModel(true, 'Humidifier', true);
                params.push(new PucGraphWidgetParam('hpuHumidifierOff' + this.moduleIdentifier,
                    PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 6.4 : 0));
                break;
            case 3:
                bumpOrder = true;
                // hpuDehumidifier
                // hpuDehumidifierOn
                toolTip = new PucToolTipModel(true, 'Dehumidifier', true);
                params.push(new PucGraphWidgetParam('hpuDehumidifierOn' + this.moduleIdentifier,
                    PucGraphColors.VERY_SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 6.4 : 0));
                // hpuDehumidifierOff
                toolTip = new PucToolTipModel(true, 'Dehumidifier', true);
                params.push(new PucGraphWidgetParam('hpuDehumidifierOff' + this.moduleIdentifier,
                    PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA, toolTip, isFac ? 6.4 : 0));
                break;
            default:
                throw new Error('Invalid relay5 config !');
        }

        if (bumpOrder) {
            stackOrder = 1;
            type = PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA;
        } else {
            stackOrder = 0;
            type = PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR;
        }

        // heatpumpChangeover
        switch (parseInt(hpcType, 10)) {
            // Na : relay is switched off
            case 0:
                // Do not show the HPC stack
                break;
            // cooling
            case 1:
                // heatpumpChangeoverCooling
                // heatpumpChangeoverCoolingOn
                toolTip = new PucToolTipModel(true, 'HeatpumpChangeover Cooling', true);
                params.push(new PucGraphWidgetParam('heatpumpChangeoverCoolingOn' + this.moduleIdentifier,
                    PucGraphColors.DARK_BLUE_COLOR, type, toolTip, isFac ? 7 : stackOrder));
                // heatpumpChangeoverCoolingOff
                toolTip = new PucToolTipModel(true, 'HeatpumpChangeover Cooling', true);
                params.push(new PucGraphWidgetParam('heatpumpChangeoverCoolingOff' + this.moduleIdentifier,
                    PucGraphColors.GREY, type, toolTip, isFac ? 7 : stackOrder));
                break;
            // heating
            case 2:
                // heatpumpChangeoverHeating
                // heatpumpChangeoverHeatingOn
                toolTip = new PucToolTipModel(true, 'HeatpumpChangeover Heating', true);
                params.push(new PucGraphWidgetParam('heatpumpChangeoverHeatingOn' + this.moduleIdentifier,
                    PucGraphColors.BRIGHT_RED, type, toolTip, isFac ? 7 : stackOrder));
                // heatpumpChangeoverCoolingOff
                toolTip = new PucToolTipModel(true, 'HeatpumpChangeover Heating', true);
                params.push(new PucGraphWidgetParam('heatpumpChangeoverHeatingOff' + this.moduleIdentifier,
                    PucGraphColors.GREY, type, toolTip, isFac ? 7 : stackOrder));
                break;
            default:
                throw new Error('Invalid Heat pump change over type !');
        }

        return new PucGraphWidgetModel('Conditioning Status', 'condGraph', 'cond', params, null, null, PucGraphWidgetHeight.MEDIUM);
    }
}
