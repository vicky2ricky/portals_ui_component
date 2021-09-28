import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ClickService } from '../../services/click.service';
import { Subject } from 'rxjs';
import { find } from 'lodash-es';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'puc-chart-picker',
    templateUrl: './chart-picker.component.html',
    styleUrls: ['./chart-picker.component.scss']
})
export class ChartPickerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() charts: Array<any> = ['lineChart', 'areaChart', 'barChartVert', 'dashed'];
    @Input() selectedChart: any = 'lineChart';
    @Input() showChartContainer? = false;

    chartPickerId;

    unsubscribe$: Subject<boolean> = new Subject();

    chartOptions: Array<any> = [];
    selectedChartInfo: any;
    @Output() activate: EventEmitter<any> = new EventEmitter();
    defaultCharts: Array<any> = [
        {

            imgSrc: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtbGluZV9jaGFydCI+CiAgICAgIDxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPGcgaWQ9ImxpbmVfY2hhcnQiIGNsaXAtcGF0aD0idXJsKCNjbGlwLWxpbmVfY2hhcnQpIj4KICAgIDxnIGlkPSJHcm91cF8zIiBkYXRhLW5hbWU9Ikdyb3VwIDMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUpIj4KICAgICAgPHBhdGggaWQ9IlBhdGhfNiIgZGF0YS1uYW1lPSJQYXRoIDYiIGQ9Ik00MS43ODIsNDIuN0g2LjA1MlY4Ljk2NmExLjA4NiwxLjA4NiwwLDEsMC0yLjE3MiwwVjQzLjc4MmExLjA4NiwxLjA4NiwwLDAsMCwxLjA4NiwxLjA4Nkg0MS43ODJhMS4wODYsMS4wODYsMCwxLDAsMC0yLjE3MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yLjg4IC0wLjg4KSIgZmlsbD0iI2I0YjRiNCIvPgogICAgICA8cGF0aCBpZD0iUGF0aF85IiBkYXRhLW5hbWU9IlBhdGggOSIgZD0iTTczOS41MDksNTMuMjIxczIuMjU0LTI3LjY3LDI0Ljc5NS0yNi4yNzMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MzIgLTEyLjkyNSkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZTA2NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgICAgPHBhdGggaWQ9IlBhdGhfMTAiIGRhdGEtbmFtZT0iUGF0aCAxMCIgZD0iTTczOS41MDksNDMuMjgzczIuNTIxLTE3LjIyNCwyNy43MjUtMTYuMzU0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzMyIC0yLjk4NykiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2YzNjQ2YSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=',
            label: 'Line Chart',
            type: 'lineChart'
        },
        {

            imgSrc: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtYXJlYV9jaGFydCI+CiAgICAgIDxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPGcgaWQ9ImFyZWFfY2hhcnQiIGNsaXAtcGF0aD0idXJsKCNjbGlwLWFyZWFfY2hhcnQpIj4KICAgIDxnIGlkPSJub3VuX0FyZWFfQ2hhcnRfMTU5NjY0MiIgZGF0YS1uYW1lPSJub3VuX0FyZWEgQ2hhcnRfMTU5NjY0MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUuOTk2IDQ1KSI+CiAgICAgIDxnIGlkPSJHcm91cF8xIiBkYXRhLW5hbWU9Ikdyb3VwIDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjk5NiAtMzcpIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8xIiBkYXRhLW5hbWU9IlBhdGggMSIgZD0iTTMuMTQ4LDFIMVYzNS40MzRIMzUuNDMxVjMzLjI4MkgzLjE0OFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjk5NiAtMSkiIGZpbGw9IiNiNGI0YjQiLz4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8yIiBkYXRhLW5hbWU9IlBhdGggMiIgZD0iTTE1Ljk4OSw3LDMsMTMuMnYxMC4zNEgzMy4zVjdMMjIuNDgyLDEzLjJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjE0OCA2Ljc1NSkiIGZpbGw9IiNmMzY0NmEiLz4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zIiBkYXRhLW5hbWU9IlBhdGggMyIgZD0iTTIyLjQ4Miw4LjIsMTUuOTg5LDIsMyw4LjJ2OC4wMjNMMTYuNDIyLDkuODE3bDYuNDA2LDYuMTIxTDMzLjMsOS45MlYyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4xNDggMC4wNjgpIiBmaWxsPSIjZmFiNjY2Ii8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=',
            label: 'Area Chart',
            type: 'areaChart'
        },
        {

            imgSrc: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtdmVydGljYWxfYmFyIj4KICAgICAgPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIi8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KICA8ZyBpZD0idmVydGljYWxfYmFyIiBjbGlwLXBhdGg9InVybCgjY2xpcC12ZXJ0aWNhbF9iYXIpIj4KICAgIDxnIGlkPSJub3VuX3N0YWNrZWRfYmFyX2NoYXJ0XzYyNDI3OCIgZGF0YS1uYW1lPSJub3VuX3N0YWNrZWQgYmFyIGNoYXJ0XzYyNDI3OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE1IC0yNDEpIj4KICAgICAgPHBhdGggaWQ9IlBhdGhfOCIgZGF0YS1uYW1lPSJQYXRoIDgiIGQ9Ik0xMS42MTEsNDBINVYzNC4xNjdoNi42MTFabTAtMTUuOTQ0SDV2OC41NTZoNi42MTFaTTIxLjMzMywyNmgtN1Y0MGg3Wm0wLTExLjY2N2gtN1YyNC40NDRoN1ptOS4zMzMsMjEuNzc4aC03VjQwaDdabS03LTEuNTU2aDdWNWgtN1ptOS43MjItMi4zMzNWNDBINDBWMzIuMjIyWm0wLTEyLjA1NnYxMC41SDQwdi0xMC41WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIxMiAyNDQpIiBmaWxsPSIjZjM2NDZhIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K',
            label: 'Vertical Bar Chart',
            type: 'barChartVert'
        },
        {

            imgSrc: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtZGFzaGVkIj4KICAgICAgPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIi8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KICA8ZyBpZD0iZGFzaGVkIiBjbGlwLXBhdGg9InVybCgjY2xpcC1kYXNoZWQpIj4KICAgIDxwYXRoIGlkPSJQYXRoXzYiIGRhdGEtbmFtZT0iUGF0aCA2IiBkPSJNNDEuNzgyLDQyLjdINi4wNTJWOC45NjZhMS4wODYsMS4wODYsMCwxLDAtMi4xNzIsMFY0My43ODJhMS4wODYsMS4wODYsMCwwLDAsMS4wODYsMS4wODZINDEuNzgyYTEuMDg2LDEuMDg2LDAsMSwwLDAtMi4xNzJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjEyIC0wLjg4KSIgZmlsbD0iI2I0YjRiNCIvPgogICAgPHBhdGggaWQ9IlBhdGhfOSIgZGF0YS1uYW1lPSJQYXRoIDkiIGQ9Ik03MzkuNTA5LDUzLjIyMXMyLjI1NC0yNy42NywyNC43OTUtMjYuMjczIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzI3IC0xMi45MjUpIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmUwNjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtZGFzaGFycmF5PSI0Ii8+CiAgICA8cGF0aCBpZD0iUGF0aF8xMCIgZGF0YS1uYW1lPSJQYXRoIDEwIiBkPSJNNzM5LjUwOSw0My4yODNzMi41MjEtMTcuMjI0LDI3LjcyNS0xNi4zNTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MjcgLTIuOTg3KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjM2NDZhIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCIvPgogIDwvZz4KPC9zdmc+Cg==',
            label: 'Dashed',
            type: 'dashed'
        }
    ]
    constructor(
        private sanitizer: DomSanitizer,
        private clickService: ClickService
    ) { }

    sanitizeImageUrl(imageUrl: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    update() {
        this.chartOptions = this.defaultCharts.filter((_item) => {
            if (this.charts.includes(_item.type)) {
                return _item;
            }
        });
        this.selectedChartInfo = find(this.chartOptions, ['type', this.selectedChart]);
    }

    onSelectChart(chart) {
        this.selectedChart = (chart && chart.type) ? chart.type : '';
        if (this.selectedChart) {
            this.selectedChartInfo = find(this.chartOptions, ['type', this.selectedChart]);
            this.showChartContainer = false;
            this.activate.emit(this.selectedChart);
        }

    }

    toggleChartPicker(event) {
      event.stopPropagation();
      const showChartContainer = !this.showChartContainer;
      if (showChartContainer) {
        this.clickService.setPickerClicked(this.chartPickerId);
      } else {
        this.clickService.setPickerClicked('');
      }
    }

    ngOnInit(): void {
      this.update();

      this.chartPickerId = this.clickService.createRandomId(8);

      this.clickService.getPickerClicked()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        pickerId => {
          this.showChartContainer = (pickerId === this.chartPickerId);
      });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.update();
        }
    }

    ngOnDestroy() {
      this.unsubscribe$.next(true);
      this.unsubscribe$.complete();
    }
}
