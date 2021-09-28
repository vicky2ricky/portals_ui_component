import { transition } from 'd3-transition';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HeatMapToolTipService {
  // orig graph data collection
  public origGraphData: Map<string, any> = new Map<string, any>();

  // This holds the graph data set
  public graphData: Map<string, any> = new Map<string, any>();

  // This holds the tooltip data set
  public graphToolTipData: Map<string, any> = new Map<string, any>();

  // This holds the svg width data set
  public graphWidhts: Map<string, any> = new Map<string, any>();

  // This holds the orig svg height data set
  public origGraphHeights: Map<string, any> = new Map<string, any>();

  // This holds the svg height data set
  public graphHeights: Map<string, any> = new Map<string, any>();

  // This holds the SVG refs for graphs to append tooltip span to
  public graphSvgRefs: Map<string, any> = new Map<string, any>();

  // This holds the visibility of graphs
  public graphAccordianDataVisibility: Array<string> = [];

  // D3 Layer X : used to append tooltip
  public layerX: number = null;

  // D3 Offset X: used to generate tooltip
  public offsetX: number = null;

  // Holds X-Axis for the graph;
  public xAxis: any = null;

  // Holds tool tip visibility
  public isToolTipVisible = false;

  // Hold graph id for  hovered graph
  public hoveredGraphId: string = null;

  // Selected Date Range
  public selectedDateRange: any = null;

  // Unique Filter
  public relevantIdFilter: string;

  // rendered graph ids
  public graphIdCollection: Array<string> = new Array<string>();

  // cureves units collection
  public curveUnitsCollection: Map<string, string> = new Map<string, string>();

  // curves enum collection
  public curveEnumCollection: Map<string, string> = new Map<string, string>();

  // For CSS issue browser specific
  public browserOffset = 0;

  // Module identifier
  public moduleIdentifier = '';

  // to skip processing for specific regions
  public heatmapEvent: string;

  // ccu or zone and action type
  public ccuorzone: any;

  // correct xcoordinates
  public correctedToolTipXCords: number;

  // To prevent duplicate processing of data
  public dataParserCheckMap: Map<string, any> = new Map<string, any>();

  // Updates the toolTipData
  public updategraphData(graphId: string, graphData: any) {
    this.graphData.set(graphId, graphData);
    // Set to orig graph data too
    this.origGraphData.set(graphId, graphData);
  }

  // Updates the toolTipData
  public updategraphSvgRefs(graphId: string, svgData: any) {
    this.graphSvgRefs.set(graphId, svgData);
  }

  // Updates the graphWidhts
  public updategraphWidhts(graphId: string, width: any) {
    this.graphWidhts.set(graphId, width);
  }

  // Updates the graph Heights
  public updategraphHeights(graphId: string, height: any) {
    this.graphHeights.set(graphId, height);
    // set to orig graph heights too
    this.origGraphHeights.set(graphId, height);
  }

  // Clears the toolTipData
  public clearTooltipData() {
    if (this.heatmapEvent !== 'embed') {
      this.graphData.clear();
      this.origGraphData.clear();
      this.graphWidhts.clear();
      this.graphSvgRefs.clear();
      this.graphToolTipData.clear();
      this.graphIdCollection = [];
      this.graphAccordianDataVisibility = [];
      this.dataParserCheckMap.clear();
      this.origGraphHeights.clear();
      this.graphHeights.clear();
    }
  }

  // Deletes graph
  public deleteGraphData(graphId: string) {
    // delete from graphData
    this.graphData.delete(graphId);
    // delete tooltips from svg
    /* tslint:disable-next-line */
    this.graphSvgRefs.get(graphId) ? this.graphSvgRefs.get(graphId).selectAll('span.tooltip').remove() : '';
    // delete from graphSvgRefs
    this.graphSvgRefs.delete(graphId);
    // delete from tooltipdata
    this.graphToolTipData.delete(graphId);
  }

  // Deletes graph
  public deletefromOrigGraphData(graphId: string) {
    // delete from graphData
    this.origGraphData.delete(graphId);
    this.origGraphHeights.delete(graphId);
  }

  // Clear irrelevant entries
  public clearIrrelevantEntries() {
    if (this.heatmapEvent !== 'embed') {
      this.graphData.clear();
      this.graphToolTipData.clear();
      this.graphHeights.clear();

      this.origGraphData.forEach((value, key) => {
        /* tslint:disable-next-line */
        key.includes(this.relevantIdFilter) ? this.graphData.set(key, value) : '';
      });

      // this.graphIdCollection = this.graphIdCollection.filter(entry => {
      //     entry.includes(this.relevantIdFilter)
      // });
      // this.graphSvgRefs.forEach((value, key) => {
      //     key.includes(this.relevantIdFilter) ? '' : this.graphSvgRefs.delete(key);
      // });
      // this.graphWidhts.forEach((value, key) => {
      //     key.includes(this.relevantIdFilter) ? '' : this.graphWidhts.delete(key);
      // });
      // this.graphToolTipData.forEach((value, key) => {
      //     key.includes(this.relevantIdFilter) ? '' : this.graphToolTipData.delete(key);
      // });
      this.origGraphHeights.forEach((value, key) => {
        /* tslint:disable-next-line */
        key.includes(this.relevantIdFilter) ? this.graphHeights.set(key, value) : '';
      });
    }
  }

  /* istanbul ignore next  */
  private getRoundedDate(date, minutes) {
    const ms = 1000 * 60 * minutes; // convert minutes to ms
    const roundedDate = new Date(Math.round(date.getTime() / ms) * ms);
    return roundedDate;
  }

  /* istanbul ignore next  */
  private getStepVal() {
    let stepVal = 1;

    if (this.heatmapEvent !== 'embed') {
      // NOTE : the intervals is copied from haystack , any changes there will have to be reflected here too
      const start = this.selectedDateRange.startDate;
      const end = this.selectedDateRange.endDate;

      const diff = end.diff(start, 'days');

      const stepValLtTwoDays = 1;
      const stepValLtFifteenDays = 5;
      const stepValLtSixtyDays = 15;
      const stepValGtSixtyDays = 60;

      // Set the step val
      if (diff < 2) {
        stepVal = stepValLtTwoDays;
      } else if (diff >= 2 && diff < 15) {
        stepVal = stepValLtFifteenDays;
      } else if (diff >= 15 && diff < 60) {
        stepVal = stepValLtSixtyDays;
      } else if (diff >= 60) {
        stepVal = stepValGtSixtyDays;
      }
    }

    return stepVal;
  }

  // get tool tips
  /* istanbul ignore next  */
  public generateToolTip() {
    this.correctedToolTipXCords = this.offsetX - this.browserOffset;
    // Generate tool tip data for all graphs
    this.graphData.forEach((curves, graph) => {
      const stackValueMap: Map<number, boolean> = new Map<number, boolean>();
      let toolTipObj = {};
      let toolTipStr = '';
      const pointValue = this.getRoundedDate(new Date(this.xAxis.invert(this.correctedToolTipXCords)), this.getStepVal());
      if(this.getStepVal() == 60) {
        pointValue.setMinutes(0,0,0);
      }
      const xValMillis = 60000 * Math.floor(pointValue.valueOf() / 60000); // millis rounded to the nearest minute
      /* tslint:disable-next-line */
      const xValDt = pointValue.toDateString() + ' ' + pointValue.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });

      if (curves.length) {
        curves.forEach(curve => {
          if (curve.values.length > 0) {
            toolTipObj = Object.assign(toolTipObj, { [curve.id]: {} });
            toolTipObj[curve.id]['id'] = curve.id.replace(this.moduleIdentifier, '').replace(/([A-Z])/g, ' $1').trim();
            toolTipObj[curve.id]['color'] = curve.color;
            const matchVal = curve.values.find(val => {
              const ts = 60000 * Math.floor(new Date(val.ts).valueOf() / 60000); // round each timestamp (in millis) to the nearest minute
              return ts === xValMillis;
            });

            if (matchVal) {
              toolTipObj[curve.id]['value'] = (curve.tooltip.visibility) ? (matchVal.val !== null ? matchVal.val : '--') : '--';
              // To keep track of stack has values or not
              /* tslint:disable-next-line */
              curve.tooltip.isTypeEnum ? stackValueMap.set(curve.stackOrder, true) : '';
            } else {
              toolTipObj[curve.id]['value'] = '--';
              // To keep track of stack has values or not
              if (curve.tooltip.isTypeEnum) {
                if (stackValueMap.has(curve.stackOrder)) {
                  // do nothing
                } else {
                  stackValueMap.set(curve.stackOrder, false);
                }
              }
            }

            // set unit
            toolTipObj[curve.id]['unit'] = this.curveUnitsCollection.get(curve.id);

            // Set enum porperties
            toolTipObj[curve.id]['isTypeEnum'] = curve.tooltip.isTypeEnum;
            toolTipObj[curve.id]['enumName'] = curve.tooltip.enumName.replace(/([A-Z])/g, ' $1').trim();
            /* tslint:disable-next-line */
            toolTipObj[curve.id]['enumValue'] = this.getEnumMapping(curve.id, curve.tooltip.enumValue).replace(/([A-Z])/g, ' $1').trim();

            // Set alter name properties
            toolTipObj[curve.id]['hasAlterName'] = curve.tooltip.hasAlterName;
            toolTipObj[curve.id]['alterName'] = curve.tooltip.alterName;

            // Stack order
            if (curve.tooltip.isTypeEnum) {
              toolTipObj[curve.id]['stackOrder'] = curve.stackOrder;
              toolTipObj[curve.id]['stackValueMap'] = curve.tooltip.isTypeEnum ? stackValueMap : null;
            }

            // for ad-hoc visualizer
            if (this.heatmapEvent === 'embed') {
              toolTipObj[curve.id]['name'] = curve.name;
            }
          }
        });

        // append time stamp to tool tip data
        if (Object.keys(toolTipObj).length) {
          toolTipStr += `<i style="color: white;letter-spacing: -0.2px;font-size: 11px;margin-top: 5px;margin-bottom: 5px">@${xValDt}</i>`;
        }

        // Keep track of rendered enums , to prevent duplicate
        const renderedEnums: Map<number, boolean> = new Map<number, boolean>();

        Object.keys(toolTipObj).map(key => {
          if (toolTipObj[key].isTypeEnum) {
            if (toolTipObj[key].stackValueMap.get(toolTipObj[key].stackOrder)) {
              // Enum type curve
              if (toolTipObj[key].value === '--') {
                // dont show anything
              } else {
              /* tslint:disable-next-line */
                toolTipStr += `<i style="color: ${toolTipObj[key].color};font-size: 11px;font-weight: 700;letter-spacing: -0.2px; margin-top: 2px ;text-transform : none; font-family: "Lato Bold";">${toolTipObj[key].hasAlterName?toolTipObj[key].alterName:toolTipObj[key].enumName} : ${toolTipObj[key].enumValue}</i>`;
              }
            } else {
              if (renderedEnums && renderedEnums.get(toolTipObj[key].stackOrder)) {
                // skip , already rendered
              } else {
                toolTipStr += `<i style="color: #A8A8A8;font-size: 11px;font-weight: 700;letter-spacing: -0.2px; margin-top: 2px ;text-transform : none; font-family: "Lato Bold";">${toolTipObj[key].hasAlterName?toolTipObj[key].alterName:toolTipObj[key].enumName} : --</i>`;
                renderedEnums.set(toolTipObj[key].stackOrder, true);
              }
            }
          } else {
            const color = toolTipObj[key].value === '--' ? '#A8A8A8' : toolTipObj[key].color;
            if (toolTipObj[key].hasAlterName) {
              // curve with alter name
              /* tslint:disable-next-line */
              toolTipStr += `<i style="color: ${color};font-size: 11px;font-weight: 700;letter-spacing: -0.2px; margin-top: 2px ;text-transform : none; font-family: "Lato Bold";">${toolTipObj[key].alterName}: ${toolTipObj[key].value} ${toolTipObj[key].unit ? toolTipObj[key].unit : ''}</i>`;
            } else {
              // normal curve
              /* tslint:disable-next-line */
              toolTipStr += `<i style="color: ${color};font-size: 11px;font-weight: 700;letter-spacing: -0.2px; margin-top: 2px ;text-transform : none; font-family: "Lato Bold";">${this.heatmapEvent !== 'embed' ? toolTipObj[key].id : toolTipObj[key].name}: ${toolTipObj[key].value} ${toolTipObj[key].unit ? toolTipObj[key].unit : ''}</i>`;
            }
          }
        });

        this.graphToolTipData.set(graph, toolTipStr);
      } else {
        // its a defualt runtime profile , add dummy tooltip str
        toolTipStr += `<i></i>`;
        this.graphToolTipData.set(graph, toolTipStr);
      }
    });
    // Re-order Tooltip data
    this.reOrderGraphTooltips();
    // Wipe any existing tool tips
    this.clearToolTip();
    // Get tool tip
    this.appendToolTipToHoveredGraph();
  }

  /* istanbul ignore next  */
  public appendToolTipToHoveredGraph() {
    const selfPos = 5; // for hovered graph tool tip adjsutment

    const hoveredGraphIndex: number = Array.from(this.graphToolTipData.keys()).indexOf(this.hoveredGraphId);
    let index = 0;

    this.graphToolTipData.forEach((toolTipData, graphId) => {
      let top: string; // position where the tooltip be placed
      let visibility = 'visible'; // default

      // check if graph has tool tip data
      toolTipData === '' ? visibility = 'hidden' : visibility = 'visible';

      // Check if graph accordian is visible
      if (this.graphAccordianDataVisibility.indexOf(graphId) > -1) {
        // Graph Accordian is hidden
        visibility = 'hidden';
      }

      if (index === hoveredGraphIndex) {
        // Hovered graph is first one
        top = (selfPos-8).toString() + 'px';
      }

      if (index < hoveredGraphIndex) {
        // Hovered graph is somewhere below current iteration
        top = ((this.getWidgetTooltipPosition(index, hoveredGraphIndex)-4) * (-1)).toString() + 'px';
      }
      if (index > hoveredGraphIndex) {
        // Hovered graph is somewhere above current iteration
        top = ((this.getWidgetTooltipPosition(index, hoveredGraphIndex)-4)).toString() + 'px';
      }

      // Initialize the tooltip
      const toolTip = this.graphSvgRefs.get(this.hoveredGraphId).append('span')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('--barHeight', this.graphHeights.get(graphId) + 'px');
      // Append data to tool tip
      transition(toolTip)
        .select('tooltip')
        .transition()
        .duration(200);
      toolTip.html(toolTipData)
        // this calc is used to align the mouse pointer with tooltip
        .style('left', this.calcTooltipLeftPosition())
        .style('top', top)
        .style('opacity', 1)
        .style('border-radius', '5px')
        .style('padding-bottom', '7px')
        .style('z-index', '999')
        .style('visibility', visibility);

      // Increment the index
      index += 1;
    });
  }

  getWidgetTooltipPosition(index: number, hoveredIndex: number) {
    let pos = 0;
    const widgetHeaderAdjustment = 25;
    const widgetHeights = Array.from(this.graphHeights.keys());
    let iterator = 0;

    if (index < hoveredIndex) {
      iterator = index;
      while (iterator < hoveredIndex) {
        /* tslint:disable-next-line */
        pos += (this.graphAccordianDataVisibility.indexOf(widgetHeights[iterator]) > -1) ? widgetHeaderAdjustment : this.graphHeights.get(widgetHeights[iterator]) + widgetHeaderAdjustment;
        iterator++;
      }
    } else if (index > hoveredIndex) {
      iterator = hoveredIndex;
      while (iterator < index) {
        /* tslint:disable-next-line */
        pos += (this.graphAccordianDataVisibility.indexOf(widgetHeights[iterator]) > -1) ? widgetHeaderAdjustment : this.graphHeights.get(widgetHeights[iterator]) + widgetHeaderAdjustment;
        iterator++;
      }
    }

    return pos;
  }

  calcTooltipLeftPosition() {
    return this.layerX + 9 + 'px';
  }

  reOrderGraphWidgets() {
    const origGraphData = new Map(this.graphData);
    let reOrderedGraphWidgets;
    const runTimeWidget = origGraphData.get('runtimesystemprofile' + this.relevantIdFilter);
    const comfortIndexWidget = origGraphData.get('comfortIndex' + this.relevantIdFilter);

    // Re-order Runtime widget
    if (runTimeWidget) {
      reOrderedGraphWidgets = new Map<string, any>();
      reOrderedGraphWidgets.set('runtimesystemprofile' + this.relevantIdFilter, runTimeWidget);
      origGraphData.delete('runtimesystemprofile' + this.relevantIdFilter);

      origGraphData.forEach((curves, graph) => {
        reOrderedGraphWidgets.set(graph, curves);
      });
    } else {
      reOrderedGraphWidgets = new Map(origGraphData);
    }

    // Re-order ComforIndex widget
    if (comfortIndexWidget) {
      reOrderedGraphWidgets.delete('comfortIndex' + this.relevantIdFilter);
      reOrderedGraphWidgets.set('comfortIndex' + this.relevantIdFilter, comfortIndexWidget);
    }

    this.graphData = new Map(reOrderedGraphWidgets);
  }

  reOrderGraphTooltips() {
    const origTooltipData = new Map(this.graphToolTipData);
    let reOrderedGraphTooltips;
    const runTimeTooltip = origTooltipData.get('runtimesystemprofile' + this.relevantIdFilter);
    const comfortIndexTooltip = origTooltipData.get('comfortIndex' + this.relevantIdFilter);

    // Re-order Runtime widget
    if (runTimeTooltip) {
      reOrderedGraphTooltips = new Map<string, any>();
      reOrderedGraphTooltips.set('runtimesystemprofile' + this.relevantIdFilter, runTimeTooltip);
      origTooltipData.delete('runtimesystemprofile' + this.relevantIdFilter);

      origTooltipData.forEach((curves, graph) => {
        reOrderedGraphTooltips.set(graph, curves);
      });
    } else {
      reOrderedGraphTooltips = new Map(origTooltipData);
    }

    // Re-order ComforIndex widget
    if (comfortIndexTooltip) {
      reOrderedGraphTooltips.delete('comfortIndex' + this.relevantIdFilter);
      reOrderedGraphTooltips.set('comfortIndex' + this.relevantIdFilter, comfortIndexTooltip);
    }

    this.graphToolTipData = new Map(reOrderedGraphTooltips);
  }

  // Fetch enum mapping
  getEnumMapping(id: string, val: string) {
    return (this.curveEnumCollection.has(id) ? this.curveEnumCollection.get(id) : val);
  }

  // Clear tool tip
  public clearToolTip() {
    /* tslint:disable-next-line */
    this.graphSvgRefs.get(this.hoveredGraphId) ? this.graphSvgRefs.get(this.hoveredGraphId).selectAll('span.tooltip').remove() : '';
  }
}
