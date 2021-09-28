import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';

import { ChartService } from '../../../services/chart.service';
import { ColorService } from '../../../services/color.service';
import { ITerrainChart } from '../../../models/ITerrainChart';

declare const Plotly: any;

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
    selector: 'puc-terrain-chart',
    templateUrl: './terrain-chart.component.html',
    styleUrls: ['./terrain-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerrainChartComponent implements OnInit, OnChanges, DoCheck {

    @Input() chartData: ITerrainChart;
    @Input() colorSet: any;

    @Input() chartWidth?;
    @Input() chartHeight?;
    @Input() id: any;

    @Output() terrainMapped: EventEmitter<any> = new EventEmitter<any>();

    width;
    height;

    @Input() margin = { top: 20, right: 8, bottom: 24, left: 8 };

    @Input() view?: [number, number];

    layout;

    zData: Array<any>;
    xAxisLabels: Array<any>;
    yAxisLabels: Array<any>;

    colorScale;

    xTickPosition = [0, 4, 8, 12, 16, 20, 23];

    /* The plot target container. */
    plotContainer;
    plc;
    hoverInfo;
    // @ViewChild('terrinPlotContainer') plotContainer: ElementRef;


    constructor(
        protected chartElement: ElementRef,
        private ref: ChangeDetectorRef,
        private colorService: ColorService,
        private chartService: ChartService,
        private ngZone: NgZone) {
        this.plotContainer = this.chartElement.nativeElement;
    }

    ngOnInit(): void {

    }


    ngDoCheck() {
        console.log('CD Inside Terrain Chart');
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.chartData && changes.chartData.currentValue) {
            this.chartData = changes.chartData.currentValue;
        }

        this.update();
    }


    update() {

        if (this.view) {
            this.chartWidth = this.view[0];
            this.chartHeight = this.view[1];
        }

        // default values if width or height are 0 or undefined
        if (!this.chartWidth) {
            this.chartWidth = 840;
        }

        if (!this.chartHeight) {
            this.chartHeight = 480;
        }

        this.chartWidth = Math.floor(this.chartWidth);
        this.chartHeight = Math.floor(this.chartHeight);

        this.computeWidth();
        this.computeHeight();

        if (this.chartData) {
            this.createChart();
        }

    }

    computeWidth() {
        this.width = this.chartWidth + (this.margin['left'] + this.margin['right']);
    }

    computeHeight() {
        this.height = this.chartHeight + (this.margin['top'] + this.margin['bottom']);
    }

    processData() {
      this.chartData.data = this.chartData.data.filter(dataItem => dataItem.readings.length > 0);
      if (!this.chartData || (this.chartData.data && Array.isArray(this.chartData.data && this.chartData.data.length === 0))) {
          this.zData = [];
      } else {
          this.zData = this.chartData.data
              .map(item => item['readings']
                  .filter((_filterItem) => _filterItem)
                  .map((reading) => reading['value']));
          // this.zData = this.zData.filter(zDataItem => zDataItem.length > 0);
          console.log(this.zData);
      }
    }

    setXAxisLabels() {
        if (!this.chartData || (this.chartData.data && Array.isArray(this.chartData.data && this.chartData.data.length === 0))) {
            this.xAxisLabels = [];
        } else {
            this.xTickPosition = [];

            // While there are multiple sites, one of them might not have any readings, so pick the one which has the max count
            let readingsToUse = [];
            this.chartData.data.forEach(_siteData => {
              if(_siteData.readings && _siteData.readings.length >= readingsToUse.length) {
                readingsToUse = _siteData.readings;
              }
            });

            const ticksCount = readingsToUse.length;

            const maxTicks = 8;
            const modFactor = Math.ceil(ticksCount / maxTicks);

            this.xAxisLabels = readingsToUse
                .map((mapItem, i) => {
                    if ((i + 1) % modFactor === 0 || i == 0 || readingsToUse.length <= maxTicks) {
                        this.xTickPosition.push(i);
                    }
                    // return mapItem['time']
                    // Instead calculate a label and return that
                    const xLabel = this.chartService.generateXLabel(this.chartData.groupBy, mapItem, i);
                    return xLabel;
                });
        }
    }

    setYAxisLabels() {
        if (!this.chartData || (this.chartData.data && Array.isArray(this.chartData.data && this.chartData.data.length === 0))) {
            this.yAxisLabels = [];
        } else {
            this.yAxisLabels = this.chartData.data.map((item) => item['site']);
        }
    }

    createChart() {
        console.log('Terrain Chart');
        if (this.chartData && Object.keys(this.chartData).length) {
            this.processData();
            this.setXAxisLabels();
            this.setYAxisLabels();
            this.layout = {
                width: this.width,
                height: this.height,
                automargin: true,
                showlegend: false,
                margin: {
                    l: this.margin.left,
                    r: this.margin.right,
                    b: this.margin.bottom,
                    t: this.margin.top,
                    autoexpand: false,
                },
                font: {
                    family: 'Lato, serif',
                    size: 13
                },
                scene: {
                    aspectmode: 'manual',
                    aspectratio: {
                        x: 2.3, y: 1, z: 1,
                    },
                    camera: {
                        center: {
                            x: 0, y: 0, z: 0
                        },
                        eye: {
                            x: 2, y: 2, z: 0.3
                        },
                        up: {
                            x: 0, y: 0, z: 1
                        }
                    },
                    xaxis: {
                        title: '',
                        ticktext: this.xAxisLabels.filter((label, i) => (this.xTickPosition.includes(i)))
                            .map(tickValue => `  ${tickValue}`),
                        tickvals: this.xTickPosition,
                        tickmode: 'array',
                        ticks: 'outside',
                        tickwidth: 1,
                        showgrid: true,
                        zeroline: false,
                        showline: false,
                        automargin: true,
                        tickfont: {
                            family: 'Lato, serif',
                            size: 12,
                            color: '#666'
                        }
                    },
                    yaxis: {
                        title: '',
                        // nticks: this.yAxisLabels.length,
                        ticktext: this.yAxisLabels,
                        tickvals: [...Array(this.yAxisLabels.length).keys()],
                        ticks: '',
                        tickwidth: 4,
                        ticklen: 10,
                        separatethousands: true,
                        showgrid: true,
                        zeroline: false,
                        showline: false,
                        tickfont: {
                            family: 'Lato, serif',
                            size: 12,
                            color: '#666'
                        }
                    },
                    zaxis: {
                        title: {
                            text: `${this.chartData.unit}`,
                            font: {
                                family: 'Lato, serif',
                                size: 13,
                                color: '#666'
                            }
                        },
                        ticks: '',
                        tick0: 0,
                        tickwidth: 4,
                        showgrid: true,
                        zeroline: false,
                        showline: false,
                        // ticksuffix: ` ${this.chartData.unit}`,
                        tickfont: {
                            family: 'Lato, serif',
                            size: 12,
                            color: '#666'
                        },
                    }
                }
            };

            if (this.colorSet) {
                this.generateColorScale(this.colorSet);
            }
            this.initPlot();
        }
    }

    private initPlot() {
        this.ref.reattach();
        this.plc = this.plotContainer.querySelector('#plc');
        this.emptyOutPlot();

        const text = this.yAxisLabels.map((y, yi) => this.xAxisLabels.map((x, xi) =>
            ` ${this.yAxisLabels[yi]} <br> Value: ${parseFloat(this.zData[yi][xi]).toFixed(2)} ${this.chartData.unit} <br> @ ${this.xAxisLabels[xi]}`
        ));

        const data = [{
            z: this.zData,
            type: 'surface',
            colorscale: this.colorScale,
            contours: {
                x: { highlight: false },
                y: { highlight: false },
                z: { highlight: false }
            },
            hoverinfo: 'text',
            text
        }];

        this.ngZone.runOutsideAngular(() => {
            // Plotly.newPlot(this.plc, data, this.layout, { staticPlot: false, displayModeBar: false })
            Plotly.newPlot(this.plc, data, this.layout, {
              staticPlot: false,
              displaylogo: false,
              responsive: true,
              modeBarButtonsToRemove: [
                'toImage', 'resetCameraDefault3d', 'resetCameraLastSave3d', 'hoverClosest3d'
              ] })
              // modeBarButtonsToRemove: [
              //   'toImage', 'zoom3d', 'orbitRotation', 'tableRotation', 'handleDrag3d',
              //   'resetCameraDefault3d', 'resetCameraLastSave3d', 'hoverClosest3d'
              // ] })
                .then((gd) => {
                    // console.log('Terrain Chart created');
                    this.terrainMapped.emit(true);
                    this.ref.detectChanges();
                    this.ref.detach();
                    return Plotly.toImage(gd, { format: 'png' });
                })
                .then((canvas) => {
                    const element = document.createElement('img');
                    const id = this.id || 'hidden-terrain-img'
                    const hiddenImg = document.querySelector(`img#${CSS.escape(id)}`);
                    if (hiddenImg) {
                        hiddenImg.remove();
                    }
                    element.setAttribute('id', id);
                    element.setAttribute('src', canvas);
                    element.setAttribute('width', '500px');
                    element.setAttribute('height', '500px');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                });
        });
    }


    emptyOutPlot() {
        this.plc.innerHTML = '';
    }

    generateColorScale(colorSet) {
        this.colorScale = [];

        // const steps = this.yAxisLabels.length;
        const steps = 8;
        const stopColor0 = colorSet['stopColor0'] || '#0000fc';
        const stopColor100 = colorSet['stopColor100'] || '#00ff1d';
        const stopColor0Repr = this.colorService.hexTorgb(stopColor0);
        const stopColor100Repr = this.colorService.hexTorgb(stopColor100);

        const interpolatedColorArray =
            this.colorService.generateInterpolatedColors(stopColor0Repr, stopColor100Repr, steps);
        console.log(interpolatedColorArray);

        for (let i = 0; i < steps; i++) {
            this.colorScale.push([i / steps, interpolatedColorArray[i]]);
        }

        this.colorScale.push([1, stopColor100Repr]);
    }

}
