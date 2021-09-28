import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ModalComponent, ModalHeaderDirective } from './modal/modal.component';

import { AccordionComponent } from './accordion/accordion.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AlertComponent } from './alert/alert.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertsPopupComponent } from './alerts-popup/alerts-popup.component';
import { AnalyticsSelectionComponent } from './heatmapCustom/analytics-selection/analytics-selection.component';
import { AnalyticsVisBuilderComponent } from './heatmapCustom/analytics-vis-builder/analytics-vis-builder.component';
import { AnalyticsVisBuilderModalComponent } from './heatmapCustom/analytics-vis-builder-modal/analytics-vis-builder-modal.component';
import { AreaChartComponent } from './charts/area-chart/area-chart.component';
import { AverageDemandComponent } from './charts/average-demand/average-demand.component';
import { BarChartHorizontalComponent } from './charts/bar-chart-horizontal/bar-chart-horizontal.component';
import { BarChartVerticalComponent } from './charts/bar-chart-vertical/bar-chart-vertical.component';
import { BaseChartComponent } from './charts/common/base-chart.component';
import { BoxWhiskerComponent } from './charts/box-whisker/box-whisker.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { CarbonFootprintReductionComponent } from './charts/carbon-footprint-reduction/carbon-footprint-reduction.component';
import { ChartPickerComponent } from './chart-picker/chart-picker.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ColorPickerComponent } from './colors/color-picker/color-picker.component';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ConfirmationBoxComponent } from './shape-confirmation-box/confirmation-box.component';
import { CustomToolTipComponent } from './custom-tooltip/custom-tool-tip.component';
import { CustomWidgetsViewComponent } from './heatmapCustom/custom-widgets-view/custom-widgets-view.component';
import { DeviceSettingsComponent } from './device-settings/device-settings.component';
import { DonutCombinationComponent } from './charts/donut-combination/donut-combination.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FloorZoneComponent } from './floor-zone/floor-zone.component';
import { GradientSwatchComponent } from './colors/gradient-swatch/gradient-swatch.component';
import { GraphComponent } from './graph/graph.component';
import { GraphXaxisComponent } from './graph-xaxis/graph-xaxis.component';
import { GroupSwatchComponent } from './colors/group-swatch/group-swatch.component';
import { HeatmapChartComponent } from './charts/heatmap-chart/heatmap-chart.component';
import { IconsModule } from '../icons/icons.module';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { LoaderComponent } from './loader/loader.component';
import { LoadingPlaceholderComponent } from './loading-placeholder/loading-placeholder.component';
import { MapChartComponent } from './charts/map-chart/map-chart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../material.module';
import { MutedAlertDialogComponent } from './muted-alert-dialog/muted-alert-dialog.component';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NotificationPreferenceComponent } from './notification-preference/notification-preference.component';
import { OverridePriorityComponent } from './override-priority/override-priority.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { PlannerLayoutComponent } from './floor-planner/planner-layout.component';
import { PortfolioEnergyUsageComponent } from './charts/portfolio-energy-usage/portfolio-energy-usage.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProgressiveSwatchComponent } from './colors/progressive-swatch/progressive-swatch.component';
import { PucDirectivesModule } from '../directives/directives.module';
import { PucPipesModule } from '../pipes/pipes.module';
import { ReferenceLineChartComponent } from './charts/reference-line-chart/reference-line-chart.component';
import { RouterModule } from '@angular/router';
import { SavingsScorecardComponent } from './charts/savings-scorecard/savings-scorecard.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulerModalComponent } from './scheduler-modal/scheduler-modal.component';
import { SelectComponent } from './select/select.component';
import { SelectDropdownComponent } from './select-dropdown/select-dropdown.component';
import { SelectGroupViewComponent } from './select-group-view/select-group-view.component';
import { SelectorAndEditorComponent } from './heatmapCustom/selector-and-editor/selector-and-editor.component';
import { SingleSwatchComponent } from './colors/single-swatch/single-swatch.component';
import { SmartGroupDeleteComponent } from './smart-group-delete/smart-group-delete.component';
import { SmartGroupTableComponent } from './smart-group-table/smart-group-table.component';
import { SortOrderComponent } from './sort-order/sort-order.component';
import { SunburstComponent } from './charts/sunburst/sunburst.component';
import { TableComponent } from './table/table.component';
import { TerrainChartComponent } from './charts/terrain-chart/terrain-chart.component';
import { TrendLineChartComponent } from './charts/trend-line-chart/trend-line-chart.component'
import { TrendLineWrapperComponent } from './chartWrappers/trend-line-wrapper/trend-line-wrapper.component';
import { TunerListComponent } from './tuner-list/tuner-list.component';
import { TunersModalComponent } from './tuners-modal/tuners-modal.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UserIntentRangesliderComponent } from './user-intent-rangeslider/user-intent-rangeslider.component';
import { UserIntentRangesliderSchedulerComponent } from './user-intent-rangeslider-scheduler/user-intent-rangeslider-scheduler.component';
import { VacationModalComponent } from './vacation-modal/vacation-modal.component';
import { VacationsComponent } from './vacations/vacations.component';
import { WidgetAccordionComponent } from './heatmapCustom/widget-accordion/widget-accordion.component';
import { WidgetComponent } from './widget/widget.component';

@NgModule({
  declarations: [
    WidgetComponent,
    AlertsComponent,
    AlertsPopupComponent,
    ButtonGroupComponent,
    CheckboxComponent,
    ConfirmModalComponent,
    GraphXaxisComponent,
    LoadingPlaceholderComponent,
    ModalComponent,
    ModalHeaderDirective,
    SelectComponent,
    SelectDropdownComponent,
    HeatmapChartComponent,
    PortfolioEnergyUsageComponent,
    AreaChartComponent,
    AverageDemandComponent,
    BarChartHorizontalComponent,
    BarChartVerticalComponent,
    BoxWhiskerComponent,
    CarbonFootprintReductionComponent,
    PieChartComponent,
    SavingsScorecardComponent,
    SunburstComponent,
    TerrainChartComponent,
    LineChartComponent,
    DonutCombinationComponent,
    BaseChartComponent,
    ReferenceLineChartComponent,
    SingleSwatchComponent,
    GroupSwatchComponent,
    GradientSwatchComponent,
    ProgressiveSwatchComponent,
    TrendLineChartComponent,
    AccordionComponent,
    ColorPickerComponent,
    ChartPickerComponent,
    MapChartComponent,
    AccordionComponent,
    AlertComponent,
    LoaderComponent,
    OverridePriorityComponent,
    UserIntentRangesliderComponent,
    UserIntentRangesliderSchedulerComponent,
    TunerListComponent,
    TunersModalComponent,
    VacationsComponent,
    DeviceSettingsComponent,
    ProfilesComponent,
    SchedulerModalComponent,
    SchedulerComponent,
    GraphComponent,
    FloorZoneComponent,
    TableComponent,
    SmartGroupTableComponent,
    SmartGroupDeleteComponent,
    TrendLineWrapperComponent,
    NotificationPreferenceComponent,
    SelectGroupViewComponent,
    AnalyticsSelectionComponent,
    SelectorAndEditorComponent,
    AnalyticsVisBuilderComponent,
    AnalyticsVisBuilderModalComponent,
    WidgetAccordionComponent,
    CustomWidgetsViewComponent,
    VacationModalComponent,
    AddEditComponent,
    MutedAlertDialogComponent,
    CustomToolTipComponent,
    SortOrderComponent,
    ConfirmationBoxComponent,
    PlannerLayoutComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    IconsModule,
    DragDropModule,
    MaterialModule,
    PucPipesModule,
    PucDirectivesModule,
    NgxSkeletonLoaderModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#e24301',
      switchColor: '#ffffff',
      defaultBgColor: '#cccccc',
      defaultBoColor: '#cccccc',
      checkedLabel: ' ',
      uncheckedLabel: ' '
    }),
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxSkeletonLoaderModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [
    WidgetComponent,
    ButtonGroupComponent,
    AlertsComponent,
    AlertsPopupComponent,
    CheckboxComponent,
    ConfirmModalComponent,
    GraphXaxisComponent,
    LoadingPlaceholderComponent,
    ModalComponent,
    ModalHeaderDirective,
    SelectComponent,
    SelectDropdownComponent,
    HeatmapChartComponent,
    PortfolioEnergyUsageComponent,
    AreaChartComponent,
    AverageDemandComponent,
    BarChartHorizontalComponent,
    BarChartVerticalComponent,
    BoxWhiskerComponent,
    CarbonFootprintReductionComponent,
    PieChartComponent,
    SavingsScorecardComponent,
    SunburstComponent,
    TerrainChartComponent,
    LineChartComponent,
    ReferenceLineChartComponent,
    DonutCombinationComponent,
    SingleSwatchComponent,
    GroupSwatchComponent,
    GradientSwatchComponent,
    ProgressiveSwatchComponent,
    TrendLineChartComponent,
    AccordionComponent,
    ColorPickerComponent,
    ChartPickerComponent,
    MapChartComponent,
    AccordionComponent,
    AlertComponent,
    LoaderComponent,
    OverridePriorityComponent,
    UserIntentRangesliderComponent,
    UserIntentRangesliderSchedulerComponent,
    TunerListComponent,
    TunersModalComponent,
    VacationsComponent,
    DeviceSettingsComponent,
    ProfilesComponent,
    SchedulerModalComponent,
    SchedulerComponent,
    GraphComponent,
    FloorZoneComponent,
    TableComponent,
    SmartGroupTableComponent,
    SmartGroupDeleteComponent,
    TrendLineWrapperComponent,
    NotificationPreferenceComponent,
    SelectGroupViewComponent,
    AnalyticsSelectionComponent,
    SelectorAndEditorComponent,
    AnalyticsVisBuilderComponent,
    AnalyticsVisBuilderModalComponent,
    WidgetAccordionComponent,
    CustomWidgetsViewComponent,
    VacationModalComponent,
    AddEditComponent,
    MutedAlertDialogComponent,
    CustomToolTipComponent,
    SortOrderComponent,
    ConfirmationBoxComponent,
    PlannerLayoutComponent
  ],
  entryComponents: [
    SchedulerModalComponent,
    VacationModalComponent,
    AlertsPopupComponent,
    MutedAlertDialogComponent,
    CustomToolTipComponent,
    SortOrderComponent
  ]
})
export class PucComponentsModule { }
