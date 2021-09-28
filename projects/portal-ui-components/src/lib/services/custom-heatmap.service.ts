import * as moment from 'moment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { cloneDeep, filter, find } from 'lodash';

import { ConfigurationService } from './configuration.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const SPECIFIED_RANGE = 'specifiedRange';

@Injectable({
  providedIn: 'root'
})
export class CustomHeatmapService {

  pasUrl;

  refreshVals: Array<any>;

  private readonly refreshValuesMinsMap = {
    '5m': 5, '1m': 1
  };

  SELECTION_FIELDS = {
    SCOPE: 'scope',
    PARAMETERS: 'parameters',
    GROUP_BY: 'groupBy',
    DATE_RANGE: 'dateRange',
    TIME_CONSTRAINT: 'timeConstraint',
    UNIT: 'unit',
    REFRESH_TIME: 'refreshTime',
  };

  TYPES = {
    TREND_TYPE: 'trend',
    TREND_BUILD_TYPE: 'builderTrendChart',
    TREND_CUSTOM_TYPE: 'customTrendChart'
  };

  URLS = {
    TREND_BUILDER_WIDGET: `trendchart-builder`,
    TREND_CUSTOM_WIDGET: `trendchart-custom`,
  }


  constructor(private http: HttpClient,
    private configService: ConfigurationService) {
      this.pasUrl = this.configService.getConfig('pasUrl');
    }


  // Get global viz details
  getGlobalDashboard(siteRef) {
    const url = `${this.pasUrl}/dashboard/heatmap/${siteRef}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  createGlobalDashboard(siteRef) {
    const url = `${this.pasUrl}/dashboard/heatmap/${siteRef}`;
    return this.http.post(url, null).pipe(catchError(this.handleError));
  }

  // This creates a default dashboard of type heatmap, the name is immaterial, but would be a mix of Entity Name_ Dashboard
  createEntityDashboard(entityName, siteRef) {
    const newDashbaordData = {
      name: `${entityName}_dashboard`,
      dashboardType: 'heatmap',
      timeConstraint: 'lastWeek',
      refreshCycleTime: 3,
      refreshCycleUnit: 'hours',
      organizations: [
        { organizationRef: 'dummy',
          allSitesInd: false,
          sites: [{
            siteRef,
            floors: []
          }]
        }
      ],
      gridWidth: 0,
      gridHeight: 0,
      groupByUnit: 'day',
      groupByTime: 1
    };

    return this.http.post(`${this.pasUrl}/dashboard`, newDashbaordData)
      .pipe(
        catchError(this.handleError)
      );
  }

  saveGlobalDashboard(siteRef, data) {
    const url = `${this.pasUrl}/dashboard/heatmap/${siteRef}`;
    return this.http.put(url, data).pipe(catchError(this.handleError));
  }


  deleteGlobalDashboard(siteRef) {
    const url = `${this.pasUrl}/dashboard/heatmap/${siteRef}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  // Should return the dashboard data, along with widgets under that dashboard.
  // This is used to get data at the Global Dashboard, and Entity level dashboards.
  getDashboardDetails(dashboardId, isGlobal, heatmapConfigId) {
    const url = `${this.pasUrl}/dashboard/${dashboardId}?heatmapConfig=${heatmapConfigId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError),
      map(data => {
        const widgetsList = [];

        const allWidgets = [...data.widgets, ...(data.builderTrendCharts || []), ...(data.customTrendCharts || [])];
        allWidgets.forEach(widget => {
          const transformedWidgetResponse = this.transformToUIWidget(widget, isGlobal);
          widgetsList.push(transformedWidgetResponse);
        });
        return widgetsList;
      })
    )
  }


  // Transform the incoming widget details to be modal compliant
  transformToUIWidget(widget, isGlobal) {
    const widgetTransformed: any = {
      dateRange: {},
    };

    widgetTransformed.name = widget.widgetName;
    widgetTransformed.widgetId = widget.widgetId;

    widgetTransformed.widgetType = 'predefined';

    if (widget.colorCode) {
      widgetTransformed.colorSelection = widget.colorCode;
    }

    widgetTransformed.refreshTime = widget.refreshCycleTime + (widget.refreshCycleUnit === 'hours' ? 'h' : 'm');

    // Position and Size
    widgetTransformed.cols = widget.width;
    widgetTransformed.rows = widget.height;
    widgetTransformed.x = widget.horizontalStartPosition;
    widgetTransformed.y = widget.verticalStartPosition;

    widgetTransformed.groupBy = 'daily';

    widgetTransformed.groupByTime = widget.groupByTime;
    widgetTransformed.groupByUnit = widget.groupByUnit;

    // trend chart changes
    if (widget.widgetType == this.TYPES.TREND_BUILD_TYPE
        || widget.widgetType == this.TYPES.TREND_CUSTOM_TYPE) {

      if (widget.timeConstraint
        && widget.timeConstraint != SPECIFIED_RANGE) {

        const dateRange = this.rangeToDate(widget.timeConstraint);
        widgetTransformed.dateRange['startDate'] = dateRange.startDate;
        widgetTransformed.dateRange['endDate'] = dateRange.endDate;

        widgetTransformed.timeConstraint = widget.timeConstraint;
      } else {

        widgetTransformed.dateRange['startDate'] = widget.dateTimeFrom;
        widgetTransformed.dateRange['endDate'] = widget.dateTimeThru;

        widgetTransformed.timeConstraint = SPECIFIED_RANGE;
      }

      widgetTransformed.siteSelections = (widget && widget.sites && widget.sites.length > 0) ? widget.sites[0] : [];
      widgetTransformed.chartType = 'trend';
      widgetTransformed.level = widget.widgetType == this.TYPES.TREND_BUILD_TYPE ? 'builder' : this.TYPES.TREND_CUSTOM_TYPE ? 'custom' : '';

      if (widget.widgetType == this.TYPES.TREND_BUILD_TYPE) {
        let scope = '';
        if (widgetTransformed.siteSelections.devices.length === 0 && widgetTransformed.siteSelections.rooms.length > 0) {
          scope = 'zone';
        } else if (widgetTransformed.siteSelections.devices.length > 0 && widgetTransformed.siteSelections.rooms.length === 0) {
          scope = 'ccu';
        }

        widgetTransformed.scope = scope;
      }

      if (widget.widgetType == this.TYPES.TREND_CUSTOM_TYPE) {
        widgetTransformed.filter = widget.filter;
      }

      widgetTransformed.chartName = (widget && widget.chartName) ? widget.chartName : '';
      widgetTransformed.pointConsolidationRule = widget.pointConsolidationRule || '';
      widgetTransformed.tags = (widget && widget.tags) ? widget.tags : [];
      widgetTransformed.hayStackQuery = (widget && widget.filter) ? widget.filter : '';
    }
    // ends

    return widgetTransformed;
  }


  getNodeIds(data, siteRef) {
    if (!data) {
      return [];
    }
    return filter(data, { checked: true, siteRef }).map((_item) => {
      return _item['id'].split(' ')[0];
    });
  }



  saveWidgetAfterTransformation(widgetSelectionsTransformed) {
    let url;
    if (widgetSelectionsTransformed.widgetType == this.TYPES.TREND_BUILD_TYPE) {
      url = `${this.pasUrl}/${this.URLS.TREND_BUILDER_WIDGET}`;
    } else if (widgetSelectionsTransformed.widgetType == this.TYPES.TREND_CUSTOM_TYPE) {
      url = `${this.pasUrl}/${this.URLS.TREND_CUSTOM_WIDGET}`;
    }

    if (widgetSelectionsTransformed['widgetId']) {
      // PUT request doesn't accept any of these fields
      delete widgetSelectionsTransformed['dashboardId'];
      return this.http.put(`${url}/${widgetSelectionsTransformed['widgetId']}`, widgetSelectionsTransformed)
        .pipe(
          catchError(this.handleError)
        );
    } else {
      // return of({widgetId: uuidv4()});
      return this.http.post(`${url}`, widgetSelectionsTransformed)
        .pipe(
          catchError(this.handleError)
        );
    }
  }


  deleteWidget(widgetId): Observable<any> {
    return this.http.delete(`${this.pasUrl}/dashboard/widget/${widgetId}`)
      .pipe(
        catchError(this.handleError)
      );
  }


  updateWidgetsPosition(dashboardId, data) {
    return this.http.post(`${this.pasUrl}/dashboard/${dashboardId}/widget-position`, data).pipe(
      catchError(this.handleError)
    );
  }



  getTrendChartData(level, widgetId, heatmapConfigId, dateParams = {}) {
    let url;
    if (level === 'builder') {
      url = `${this.pasUrl}/${this.URLS.TREND_BUILDER_WIDGET}`;
    } else if (level == 'custom') {
      url = `${this.pasUrl}/${this.URLS.TREND_CUSTOM_WIDGET}`;
    }

    let params = new HttpParams();
    params = params.set('heatmapConfig', heatmapConfigId);

    if (dateParams && dateParams['startDate']) {
      for (const key of Object.keys(dateParams)) {
        params=params.set(key, dateParams[key]);
      }
    }

    return this.http.get(`${url}/${widgetId}/data`, {params});
  }


  getSiteTags(siteRef): Observable<any> {
    let data = `ver:"3.0"\nid`;
    data += `\n@${siteRef}`;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/zinc');

    return this.http.post(`${this.configService.getConfig('tagsUrl')}`, data, { headers }).pipe(catchError(this.handleError));
  }


  private handleError(error: any): Promise<any> {
    console.error('Error inside AnalyticsVisBuilderService - ', error);
    return Promise.reject(error);
  }


  /****************************************************/
  getRefreshVals() {
    this.refreshVals = [{
        label: '5 min',
        value: '5m',
        refreshCycleTime: 5,
        refreshCycleUnit: 'minutes'
    },
    {
        label: '1 min',
        value: '1m',
        refreshCycleTime: 1,
        refreshCycleUnit: 'minutes'
    }];
    return this.refreshVals;
  }


  rangeToDate(label) {
    switch (label) {
        case 'today':
            return { startDate: moment().startOf('day'), endDate: moment().endOf('day') };
        case 'last3Days':
            return { startDate: moment().subtract(2, 'days').startOf('day'), endDate: moment().endOf('day') };
        case 'lastWeek':
            return { startDate: moment().subtract(6, 'days').startOf('day'), endDate: moment().endOf('day') };
        case 'lastMonth':
            return { startDate: moment().subtract(1, 'month').add(1, 'days').startOf('day'), endDate: moment().endOf('day') };
        case 'last6Months':
            return { startDate: moment().subtract(6, 'month').add(1, 'days').startOf('day'), endDate: moment().endOf('day') };
        case 'lastYear':
            return {
                startDate: moment().subtract(12, 'month').add(1, 'days').startOf('day'),
                endDate: moment().endOf('day')
            };
        default:
            return { startDate: moment().startOf('day'), endDate: moment().endOf('day') };
    }
  }


  getGroupByTime(startDate, endDate) {
    const diff = endDate.diff(startDate, 'days');
    let groupByTime = 1;
    if (diff < 2) {
      groupByTime = 1;
    } else if (diff >= 2 && diff < 15) {
      groupByTime = 5;
    } else if (diff >= 15 && diff < 60) {
      groupByTime = 15;
    } else if (diff >= 60) {
      groupByTime = 60;
    }

    return groupByTime;
  }
}
