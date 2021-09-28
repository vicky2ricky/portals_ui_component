import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
import { PucGraphWidgetHeight } from '../heatmap-graph-widgets/puc-graph-widget-height.enum';
/**
 * @description: Modes
 */
export class PucVrvHyperStatModesGraphWidget {
    constructor(private moduleIdentifier: string) { }
    getGraphWidget(isMasterControllerEnabled) {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

       // OperationMode Off
       toolTip = new PucToolTipModel(true, 'OperationMode', true, 'Off');  // stacked-merged
       params.push(new PucGraphWidgetParam('operationModeOff' + this.moduleIdentifier,
           PucGraphColors.GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      // OperationMode Fan
      toolTip = new PucToolTipModel(true, 'OperationMode', true, 'Fan');  // stacked-merged
      params.push(new PucGraphWidgetParam('operationModeFan' + this.moduleIdentifier,
          PucGraphColors.OCEAN_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      // OperationMode Heating
      toolTip = new PucToolTipModel(true, 'OperationMode', true, 'Heating');  // stacked-merged
      params.push(new PucGraphWidgetParam('operationModeHeat' + this.moduleIdentifier,
          PucGraphColors.VERY_SOFT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      // OperationMode Cooling
      toolTip = new PucToolTipModel(true, 'OperationMode', true, 'Cooling');  // stacked-merged
      params.push(new PucGraphWidgetParam('operationModeCool' + this.moduleIdentifier,
          PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      // OperationMode Auto
      toolTip = new PucToolTipModel(true, 'OperationMode', true, 'Auto');  // stacked-merged
      params.push(new PucGraphWidgetParam('operationModeAuto' + this.moduleIdentifier,
          PucGraphColors.LIGHT_GRAYISH_CYAN_LIME_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      if(!isMasterControllerEnabled) {
      // masterOperationMode Off
      toolTip = new PucToolTipModel(true, 'MasterOperationMode', true, 'Off');  // stacked-merged
      params.push(new PucGraphWidgetParam('masterOperationModeOff' + this.moduleIdentifier,
          PucGraphColors.DARK_GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      // masterOperationMode Fan
      toolTip = new PucToolTipModel(true, 'MasterOperationMode', true, 'Fan');  // stacked-merged
      params.push(new PucGraphWidgetParam('masterOperationModeFan' + this.moduleIdentifier,
          PucGraphColors.VERY_DARK_CYAN_LIME_GREENISH, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      // masterOperationMode Heating
      toolTip = new PucToolTipModel(true, 'MasterOperationMode', true, 'Heating');  // stacked-merged
      params.push(new PucGraphWidgetParam('masterOperationModeHeat' + this.moduleIdentifier,
          PucGraphColors.BRIGHT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      // masterOperationMode Cooling
      toolTip = new PucToolTipModel(true, 'MasterOperationMode', true, 'Cooling');  // stacked-merged
      params.push(new PucGraphWidgetParam('masterOperationModeCool' + this.moduleIdentifier,
          PucGraphColors.BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      // masterOperationMode Auto
      toolTip = new PucToolTipModel(true, 'MasterOperationMode', true, 'Auto');  // stacked-merged
      params.push(new PucGraphWidgetParam('masterOperationModeAuto' + this.moduleIdentifier,
          PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      }


        return new PucGraphWidgetModel('Modes', 'vrvHyperStatModesGraph', 'vrvHyperStatModes', params, null, null, PucGraphWidgetHeight.SMALL);
    }
}
