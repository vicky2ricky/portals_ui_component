import { PucGraphWidgetParam } from '../heatmap-graph-widgets/puc-graph-widget-param.model';
import { PucToolTipModel } from '../heatmap-graph-widgets/puc-tool-tip.model';
import { PucGraphTypes } from '../heatmap-graph-widgets/puc-graph-types.model';
import { PucGraphColors } from '../heatmap-graph-widgets/puc-graph-colors.enum';
import { PucGraphWidgetModel } from '../heatmap-graph-widgets/puc-graph-widget-model.model';
/**
 * @description: VRV HyperStat
 */
export class PucVrvHyperStatGraphWidget {
    constructor(private moduleIdentifier: string) { }
    getGraphWidget() {
        const params: Array<PucGraphWidgetParam> = new Array<PucGraphWidgetParam>();
        let toolTip;

       // FanSpeed Low
       toolTip = new PucToolTipModel(true, 'FanSpeed', true, 'Low');  // stacked-merged
       params.push(new PucGraphWidgetParam('fanSpeedLow' + this.moduleIdentifier,
           PucGraphColors.VERY_LIGHT_GREEN_CYAN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));

      // FanSpeed Medium
      toolTip = new PucToolTipModel(true, 'FanSpeed', true, 'Medium');  // stacked-merged
      params.push(new PucGraphWidgetParam('fanSpeedMedium' + this.moduleIdentifier,
          PucGraphColors.LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));

      // FanSpeed High
      toolTip = new PucToolTipModel(true, 'FanSpeed', true, 'High');  // stacked-merged
      params.push(new PucGraphWidgetParam('fanSpeedHigh' + this.moduleIdentifier,
          PucGraphColors.VERY_DARK_CYAN_LIME_GREENISH, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));

      // FanSpeed Auto
      toolTip = new PucToolTipModel(true, 'FanSpeed', true, 'Auto');  // stacked-merged
      params.push(new PucGraphWidgetParam('fanSpeedAuto' + this.moduleIdentifier,
          PucGraphColors.DARK_LIGHT_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 3));

      // AirFlow Direction Postion0
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Position0');  // stacked-merged
      params.push(new PucGraphWidgetParam('position0' + this.moduleIdentifier,
          PucGraphColors.LIGHT_NAVY_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // AirFlow Direction Postion1
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Position1');  // stacked-merged
      params.push(new PucGraphWidgetParam('position1' + this.moduleIdentifier,
          PucGraphColors.VERY_LIGHT_SOFT_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // AirFlow Direction Postion2
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Position2');  // stacked-merged
      params.push(new PucGraphWidgetParam('position2' + this.moduleIdentifier,
          PucGraphColors.THIN_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // AirFlow Direction Postion3
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Position3');  // stacked-merged
      params.push(new PucGraphWidgetParam('position3' + this.moduleIdentifier,
          PucGraphColors.DARK_BLUE_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // AirFlow Direction Postion4
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Position4');  // stacked-merged
      params.push(new PucGraphWidgetParam('position4' + this.moduleIdentifier,
          PucGraphColors.BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // AirFlow Direction Swing
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Swing');  // stacked-merged
      params.push(new PucGraphWidgetParam('swing' + this.moduleIdentifier,
          PucGraphColors.VERY_DARK_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // AirFlow Direction Auto
      toolTip = new PucToolTipModel(true, 'AirflowDirection', true, 'Auto');  // stacked-merged
      params.push(new PucGraphWidgetParam('auto' + this.moduleIdentifier,
          PucGraphColors.VERY_DARK_BLUE, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 2));

      // Filter Status does not need reset
      toolTip = new PucToolTipModel(true, 'FilterStatus', true, 'Does not need reset');  // stacked-merged
      params.push(new PucGraphWidgetParam('filterStatusOff' + this.moduleIdentifier,
          PucGraphColors.MEDIUM_DARK_GREY, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      // Filter Status need reset
      toolTip = new PucToolTipModel(true, 'FilterStatus', true, 'Need Reset');  // stacked-merged
      params.push(new PucGraphWidgetParam('filterStatusOn' + this.moduleIdentifier,
          PucGraphColors.CARIBBEAN_GREEN, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 1));

      // Cool Heat Right A
      toolTip = new PucToolTipModel(true, 'CoolHeatRight', true, 'A');  // stacked-merged
      params.push(new PucGraphWidgetParam('coolHeatRightA' + this.moduleIdentifier,
          PucGraphColors.VERY_SOFTISH_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      // Cool Heat Right C
      toolTip = new PucToolTipModel(true, 'CoolHeatRight', true, 'C');  // stacked-merged
      params.push(new PucGraphWidgetParam('coolHeatRightC' + this.moduleIdentifier,
          PucGraphColors.THIN_PINK_COLOR, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

      // Cool Heat Right D
      toolTip = new PucToolTipModel(true, 'CoolHeatRight', true, 'D');  // stacked-merged
      params.push(new PucGraphWidgetParam('coolHeatRightD' + this.moduleIdentifier,
          PucGraphColors.LIGHT_RED, PucGraphTypes.HORIZONTALLY_STACKED_MERGED, toolTip, 0));

        return new PucGraphWidgetModel('IDU Parameters', 'vrvHyperStatGraph', 'vrvHyperStat', params);
    }
}
