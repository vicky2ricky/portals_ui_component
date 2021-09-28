/// <reference types="@types/googlemaps" />

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { MapsTheme } from '../../../models/mapsTheme';

declare const d3v5: any;

const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="39" viewBox="-1 -1 27 38">
<path d="M12.25.25a12.254 12.254 0 0 0-12 12.494c0 6.444 6.488 12.109 11.059 22.564.549 1.256 1.333 1.256 1.882 0C17.762 24.853 24.25 19.186 24.25 12.744A12.254 12.254 0 0 0 12.25.25Z" style="fill:#markerFill;stroke:#222;stroke-width:1"></path>
<circle cx="12.5" cy="12.5" r="4" fill="#999" stroke="#444" ></circle>
</svg>`;

export interface IMapChart {
  unit: string;
  count: number;
  category: string;
  mappings: any;
  sites: Array<any>; // Each item would be have a id, name, location - { lat, long }, total and value for the keys
}

declare let google: any;

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  selector: 'puc-map',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapChartComponent implements OnInit, OnChanges, DoCheck {

  @Input() chartWidth;
  @Input() chartHeight;

  @Input() colorSet;
  @Input() chartData: IMapChart;

  @Input() mapId;
  @Input() zoom = 2;
  @Input() zoomClick;

  @Input() showTileBoundaries = false;
  @Input() subscriptionKey;

  // map;

  datasource;
  popup;

  hostElement; // Native element hosting the SVG container

  markers: google.maps.Marker[] = [];

  map: google.maps.Map;

  constructor(protected chartElement: ElementRef,
    protected ref: ChangeDetectorRef) {
    this.hostElement = this.chartElement.nativeElement;
  }


  ngDoCheck(): void {
    console.log('CD inside Map Chart');
  }


  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('Within Map onChanges');
    console.log(changes);

    this.ref.reattach();
    if (changes.chartData && changes.chartData.currentValue) {
      this.plotSites('data');
      this.ref.detach();
    } else if (
      ((changes.chartWidth && changes.chartWidth.currentValue)
        || (changes.chartHeight && changes.chartHeight.currentValue))
      && this.chartData) {
      this.plotSites('resize');
      this.ref.detach();
    }

    if (changes.colorSet && !changes.colorSet.firstChange && this.map) {
      // change the marker colors
      this.removeMarkers();
      this.addMarkers();
      this.ref.detach();
    }
  }


  private initMap(): void {
    if (this.mapId && this.mapId !== 'undefined') {
      const styledMapType = new google.maps.StyledMapType(MapsTheme);
      // Create a map object, and include the MapTypeId to add
      // to the map type control.
      this.map = new google.maps.Map(document.getElementById(this.mapId), {
        center: { lat: 12.972442, lng: 77.5946 },
        zoom: this.zoom || 5,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['styled_map']
        }
      });

      // Associate the styled map with the MapTypeId and set it to display.
      this.map.mapTypes.set('styled_map', styledMapType);
      this.map.setMapTypeId('styled_map');
      // this.cd.detectChanges();
    }
  }


  bindInfoWindow(marker, map, infowindow, html) {
    // let envObj = this;
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, this);
    });

    google.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
    });

    google.maps.event.addListener(marker, 'click', event => {
        // let siteDetails = marker.title.split(" ")
        // this.navToHeatmap(siteDetails[0],siteDetails[1]);
        this.map.setZoom(this.zoomClick || 15);
        map.setCenter(marker.getPosition());
    });
  }


  // Adding markers on the Map
  plotSites(reason) {
    if (reason === 'data' && this.mapId) {
      const existingMapDiv = document.querySelector(`#${this.mapId}`);
      if (!existingMapDiv) {
        d3v5.select(this.hostElement).select('.content')
          .append('div')
          .attr('id', `${this.mapId}`)
          .style('width', `${this.chartWidth}px`)
          .style('height', `${this.chartHeight}px`);
      }

      if (!this.map) {
        this.initMap();
        // this.map.resize();

        this.removeMarkers();
        this.addMarkers();
      }
    } else if (reason === 'resize') {
      d3v5.select(this.hostElement).select('.content').select(`#${this.mapId}`).remove();
      d3v5.select(this.hostElement).select('.content')
        .append('div')
        .attr('id', `${this.mapId}`)
        .style('width', `${this.chartWidth}px`)
        .style('height', `${this.chartHeight}px`);

      this.initMap();
      this.removeMarkers();
      this.addMarkers();
    }
  }


  addMarkers() {
    this.chartData.sites.map(site => {
      const color = (this.colorSet && this.colorSet[site.quartile]) ? this.colorSet[site.quartile] : '#E24301';
      const markerTemplate = markerSvg.replace(/#markerFill/gi, `${color}`);

      const valueObject = {};
      // for (const [key, value] of Object.entries(this.chartData.mappings)) {
      for (const key of Object.keys(this.chartData.mappings)) {
        valueObject[this.chartData.mappings[key]] = (site[key] || site[key] == 0) ? site[key] : null;
      }

      const content = this.generatePopupText({
        name: site.name,
        total: site.total,
        details: valueObject
      })

      const infowindow = new google.maps.InfoWindow({
        content
      });

      const marker = new google.maps.Marker({
        // icon: `<div><div class=\'pin\'>${markerTemplate}</div><div class='pulse'></div></div>`,
        icon: { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerTemplate), scaledSize: new google.maps.Size(32, 32) },
        title: site.name,
        position: { lat: parseFloat(site.location.lat), lng: parseFloat(site.location.lng) },
        map: this.map
      });
      this.markers.push(marker);
      // add an event listener for this marker
      this.bindInfoWindow(marker, this.map, infowindow, '<p>' + site.name + '</p>');
    });
  }


  removeMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }


  generatePopupText(properties) {
    let popUpText = `<div class="mapPopup">`;
    popUpText += `<label class="siteName">${properties.name}</label>`;
    popUpText += `<div><label class="total">Total ${this.chartData.category}</label><span class="value">${properties.total} ${this.chartData.unit}</span></div>`;

    const detailEntries = Object.entries(properties.details);
    detailEntries.sort((detail1: any, detail2: any) => detail2[1] - detail1[1]);
    for (const [key, value] of detailEntries) {
      popUpText += `<div><label class="breakup">${key}</label><span class="value">${value === null? '--' : value} ${this.chartData.unit}</span></div>`;
    }

    popUpText += '</div>';
    return popUpText;
  }


  DoCheck() {

  }

}
