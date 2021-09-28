import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';

/**
 * @description System VAV/DAB Hybrid RTU Graph Widget
 */
export class PucSystemVavDabHybridRtuGraphWidget {
    constructor() { }

    capitalizeFirstLetter(str) {
        const s = str.charAt(0).toUpperCase() + str.slice(1);
        return s.replace(/([A-Z])/g, ' $1').trim();
    }

    getGraphWidget(profileName: string, parameters: Array<any>, isFac = false) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

        parameters.forEach(param => {
            if (param === 'humidifier') {
                // on
                toolTip = new PucToolTipModel(true, 'Humidifier', true, 'On'); // stacked-merged
                params.push(new PucGraphWidgetParam('humidifierOn', PucGraphColors.LIGHT_CYAN,
                    PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 7 : 0));
                // off
                toolTip = new PucToolTipModel(true, 'Humidifier', true, 'Off'); // stacked-merged
                params.push(new PucGraphWidgetParam('humidifierOff', PucGraphColors.GREY,
                    PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 7 : 0));
            } else if (param === 'dehumidifier') {
                // on
                toolTip = new PucToolTipModel(true, 'Dehumidifier', true); // stacked-merged
                params.push(new PucGraphWidgetParam('dehumidifierOn', PucGraphColors.MOSTLY_PURE_BLUE,
                    PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 7 : 0));
                // off
                toolTip = new PucToolTipModel(true, 'Dehumidifier', true); // stacked-merged
                params.push(new PucGraphWidgetParam('dehumidifierOff', PucGraphColors.GREY,
                    PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR, toolTip, isFac ? 7 : 0));
            } else {
                toolTip = new PucToolTipModel(true, '', false, '', true, this.capitalizeFirstLetter(param));
                params.push(new PucGraphWidgetParam(param, this.getParamGraphColor(param),
                    this.getParamGraphType(param), toolTip));
            }
        });

        return new PucGraphWidgetModel(profileName, 'runtimesystemprofile', 'runtimesystemprofile',
            params, null, null, PucGraphWidgetHeight.LARGE);
    }

    getParamGraphType(param: string) {
        let type;
        switch (param) {
            case 'fanStage1': case 'fanStage2': case 'fanStage3': case 'fanStage4': case 'fanStage5':
                type = PucGraphTypes.AREA_LINE;
                break;
            case 'modulatingCooling': case 'modulatingFanSpeed': case 'modulatingHeating': case 'compositeSignal':
                type = PucGraphTypes.LINE;
                break;
            default:
                type = PucGraphTypes.AREA;
        }
        return type;
    }

    getParamGraphColor(param: string) {
        let color;
        switch (param) {
            case 'fanStage1':
                color = PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN;
                break;
            case 'fanStage2':
                color = PucGraphColors.VERY_SOFT_CYAN_LIME_GREEN;
                break;
            case 'fanStage3':
                color = PucGraphColors.LIGHT_GREEN;
                break;
            case 'fanStage4':
                color = PucGraphColors.OCEAN_GREEN;
                break;
            case 'fanStage5':
                color = PucGraphColors.STRONG_CYAN_LIME_GREEN;
                break;
            case 'coolingStage1':
                color = PucGraphColors.LIGHT_NAVY_BLUE_COLOR;
                break;
            case 'coolingStage2':
                color = PucGraphColors.VERY_LIGHT_SOFT_BLUISH;
                break;
            case 'coolingStage3':
                color = PucGraphColors.THIN_BLUE_COLOR;
                break;
            case 'coolingStage4':
                color = PucGraphColors.BRIGHT_BLUISH;
                break;
            case 'coolingStage5':
                color = PucGraphColors.VIVID_BLUE;
                break;
            case 'heatingStage1':
                color = PucGraphColors.LIGHT_PINK_COLOR;
                break;
            case 'heatingStage2':
                color = PucGraphColors.VERY_SOFT_REDISH;
                break;
            case 'heatingStage3':
                color = PucGraphColors.SOFTISH_RED;
                break;
            case 'heatingStage4':
                color = PucGraphColors.BRIGHT_REDISH;
                break;
            case 'heatingStage5':
                color = PucGraphColors.VIVID_REDISH;
                break;
            case 'modulatingCooling':
                color = PucGraphColors.STRONG_BLUISH;
                break;
            case 'modulatingFanSpeed':
                color = PucGraphColors.VERY_DARK_CYAN_LIME_GREENISH;
                break;
            case 'modulatingHeating':
                color = PucGraphColors.VIVID_THICK_RED;
                break;
            case 'compositeSignal':
                color = PucGraphColors.DESATURATED_MAGENTA;
                break;
            default:
                color = PucGraphColors.GREY;
        }
        return color;
    }
}
