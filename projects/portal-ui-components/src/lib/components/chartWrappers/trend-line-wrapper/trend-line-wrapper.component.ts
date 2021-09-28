import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { keyBy, round } from 'lodash-es';

import { CustomHeatmapService } from '../../../services/custom-heatmap.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const d3v5: any;


const refreshValuesMinsMap = {
  '24h': 1440, '12h': 720, '6h': 360, '3h': 180, '1h': 60, '5m': 5, '1m': 1
};

const NO_DATA_EXISTS = 'No data exists for this time period';
const UNAUTH_ERROR = 'You do not have enough permissions to view the data.';
const GENERIC_ERROR = 'Oops! Something went wrong!';

// const SPECIFIED_RANGE = 'specifiedRange';

@Component({
    selector: 'puc-trend-line-wrapper',
    templateUrl: './trend-line-wrapper.component.html',
    styleUrls: ['./trend-line-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendLineWrapperComponent implements OnInit, OnDestroy, OnChanges {

    @Input() widget;
    @Input() isOpen;

    @Input() widgetWidth;
    @Input() heatmapConfigId;

    @Input()
    set customDateRange( date ) {
      console.log('Date Set');
      if (date) {
        // console.log(this.previousSelection?.startDate.isSame(date.startDate));
        // console.log(this.previousSelection?.endDate.isSame(date.endDate));

        if (this.previousSelection?.startDate.isSame(date.startDate) &&
          this.previousSelection?.endDate.isSame(date.endDate)) {
            // Do nothing
          } else {
            // Make the call to get new data
            // console.log(date);
            this.dateParams = {
              startDate: date.startDate.format('YYYY-MM-DD'),
              endDate: date.endDate.format('YYYY-MM-DD'),
              groupByTime: this.customheatmapService.getGroupByTime(date.startDate, date.endDate),
              groupByUnit: this.widget.groupByUnit
            }

            this.getWrapperData(false);
          }

        this.previousSelection = date;
      }
    }

    previousSelection;
    dateParams = {};

    @Output() noApplicablePoints: EventEmitter<any> = new EventEmitter();
    @Output() dataRecieved: EventEmitter<any> = new EventEmitter();

    mouseEvent: any;
    showSettings = false;

    hoveredWidgetId: any;
    chartTooltips: Map<string, any> = new Map<string, any>();
    private timeseriesTooltipWorker: Worker;

    typesOfChart = '';

    isLoading = false;

    chartWidth;
    chartHeight;

    warningInChart = false;
    warningMsg;

    consumptionData;
    hasNoData = true;

    unsubscribe$: Subject<boolean> = new Subject();

    constructor(
      public ref: ChangeDetectorRef,
      private customheatmapService: CustomHeatmapService) {
        // if (typeof Worker !== 'undefined') {

        //   this.timeseriesTooltipWorker = this.createWorker(async e => {
        //     const response = await this.getTooltipData(e.data);
        //     postMessage(response, '*');
        //   });
        //   this.timeseriesTooltipWorker.onmessage = ({ data }) => {
        //       this.chartTooltips = new Map(data);
        //       this.ref.detectChanges();
        //       this.isLoading = false;
        //   };
        // } else {
        //     console.log('Web Workers are not supported by your browser');
        // }
    }


    ngOnInit(): void {
      if (this.widget) {
        this.isLoading = true;
      }
    }


    ngOnChanges(changes: SimpleChanges) {
      console.log('Trend Line Wrapper Changes : ', changes);
      if (changes.isOpen && changes.isOpen.currentValue && this.widget) {
        if (this.hasNoData) {
          this.getWrapperData();
        }
      }

      if (changes.widget && changes.widget.currentValue) {
        console.log(this.widget);

        if (this.widget.chartType) {
          // const chartType = this.widget.chartType;
          const margin = {top: 10, right: 10, bottom: 32, left: 24};

          // this.chartWidth = parseInt(this.widgetWidth.toString(), 10) - (margin.left + margin.right);
          this.chartWidth = parseInt((changes.widgetWidth.currentValue || this.widgetWidth).toString(), 10);
          this.chartHeight = parseInt(this.widget.rows.toString(), 10) - (16 + margin.top + margin.bottom);

          const refreshTime = this.widget.refreshTime;
          // const refreshInMins = refreshValuesMinsMap[refreshTime || '3h'];
        }
      }

      if (changes.widgetWidth && changes.widgetWidth.currentValue && !changes.widgetWidth.firstChange) {
        this.chartWidth = parseInt((changes.widgetWidth.currentValue || this.widgetWidth).toString(), 10);
      }
    }


    getWrapperData(loading = true) {
      if (loading) {
        this.isLoading = true;
        this.ref.detectChanges();
      }

      this.customheatmapService.getTrendChartData(this.widget.level, this.widget.widgetId, this.heatmapConfigId, this.dateParams)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe((_res) => {
          this.hasNoData = false;
          this.workWithIncomingData(_res);
        }, err => {
          this.handleErrorFromApi(err);
        });
    }


    workWithIncomingData(data) {
      try {
        this.additionalCalculations(data);
        this.dataRecieved.emit(this.consumptionData);
        this.warningInChart = false;

      } catch (err) {
        this.warningInChart = true;
        this.warningMsg = NO_DATA_EXISTS;

      } finally {
        // Setting the loader to false after the additional calculations are done.
        // What is being saved is the wrapperData and not the consumptionData
        this.isLoading = false;
        this.ref.detectChanges();
      }
    }


    handleErrorFromApi(err) {
      this.isLoading = false;
      // console.log(err);

      if (err.status === 401) {
        this.warningInChart = true;
        this.warningMsg = UNAUTH_ERROR;
      } else if (err.error && err.error.error) {
        this.warningInChart = true;

        if (err.error.error.toLowerCase().includes('api')) {
          this.warningMsg = GENERIC_ERROR;
        } else {
          this.warningMsg = err.error.error;
        }
      }

      this.ref.detectChanges();
    }


    additionalCalculations(data) {
        this.isLoading = true;

        // console.log(this.editHeight);
        if (this.widget.applicablePointIds && this.widget.applicablePointIds.length > 0) {
          const applicableCharts = [];
          data.charts.filter(chart => {
            const filteredPoints = chart.points.filter(point => this.widget.applicablePointIds.includes(point.pointRef));
            chart.points = filteredPoints;
            if (chart.points.length > 0) {
              applicableCharts.push(chart);
            }
          });

          data.charts = applicableCharts;
        }

        if (data.charts.length === 0) {
          this.noApplicablePoints.emit();

        } else {
          this.consumptionData = this.modifyTrendData(data);
          this.consumptionData.pointConsolidationRule = this.widget['pointConsolidationRule'];

          const pointConsolidationRule = this.widget['pointConsolidationRule'];
          this.typesOfChart = pointConsolidationRule === 'chartPerEquip' ? 'Equips' : pointConsolidationRule === 'oneChart' ? '' : 'Points';

          setTimeout(() => {
              // this.timeseriesTooltipWorker.postMessage({data: this.consumptionData}, []);
              this.chartTooltips = this.getTooltipData(this.consumptionData);
              this.ref.detectChanges();
          }, 1000);
        }


    }


    onMouseEventsChange(event) {
        this.mouseEvent = event;
    }


    hoveredIdEmitter(event) {
        this.hoveredWidgetId = event;
    }


    ngOnDestroy() {
        // this.timeseriesTooltipWorker.terminate();
    }


    // trend data starts
    modifyTrendData(data) {
      const colors = {
        grp1: { stopColor0: '#0000fc', stopColor100: '#00ff1d' },
        grp2: { stopColor0: '#f7c325', stopColor100: '#9635e2' },
        grp3: { stopColor0: '#e95e6f', stopColor100: '#439aeb' }
      };
      data['startDate'] = data['dateTimeFrom'];
      data['endDate'] = data['dateTimeThru'];

      if (data['charts'] && Array.isArray(data['charts'])) {
        const noOfPoints = data['charts'].reduce(
          (a, b) => a + (b['points']['length'] || 0),
          0
        );
        let startIndex = 0;
        data['charts'] = data['charts'].map((chart, index) => {
          chart['chartId'] = `widget_${data['widgetId']}_${index}`;
          // chart['chartName'] = 'test' + index;
          if (chart['points'] && Array.isArray(chart['points'])) {
            chart['points'].map((point, i) => {
              startIndex += i + 1;
              if (point['colorType'] == 'gradient') {
                const selectedColor = colors[point['colorCode'] || 'grp1'];
                const colorScale = d3v5
                  .scaleLinear()
                  .range([selectedColor.stopColor0, selectedColor.stopColor100])
                  .domain([0, noOfPoints]);
                point['colorCode'] = colorScale(startIndex - 1);
              }
              point['pointLabel'] = point['pointLabel'].includes(this.widget.siteName)
                ? point['pointLabel'].replace(`${this.widget.siteName}-`, '') :  point['pointLabel'];

              point['pointLabel'] = point['pointLabel'].startsWith('SystemEquip-')
                ? point['pointLabel'].replace(`SystemEquip-`, '') :  point['pointLabel'];

              return point;
            });
          }
          return chart;
        });

        data['charts'].sort((chart1, chart2) => {
          return chart1.chartName.localeCompare(chart2.chartName);
        });

        console.log(data);
      }

      return data;
    }


    getTooltipData(data) {
      const chartData = (data && data.charts && Array.isArray(data.charts)) ?
        data.charts : [];
      const chartTooltips: Map<string, any> = new Map<string, any>();
      for (const chart of chartData) {
        const chartId = chart['chartId'];
        const pointTooltip: Map<string, any> = new Map<string, any>();
        for (const point of chart['points']) {
          let timePeriods = (point && point.timePeriods && Array.isArray(point.timePeriods)) ?
            point.timePeriods : [];
          timePeriods = timePeriods.map(timePeriod => {
            timePeriod.value = round(timePeriod.value, 2);
            return timePeriod;
          });
          const tooltipData = keyBy(timePeriods, (row) => {
            return new Date(row['dateTime']).valueOf();
          });
          pointTooltip.set(point['pointRef'], tooltipData);
        }
        chartTooltips.set(chartId, pointTooltip);
      }
      return chartTooltips;
    }


    createWorker(fn) {
      const blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      return new Worker(url, {type: 'module'});
    }
}



