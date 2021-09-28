import { Component, Input, OnInit } from '@angular/core';

// tslint:disable: max-line-length
@Component({
    selector: 'puc-gas-icon',
    template: `

  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  attr.height="{{size}}" attr.width="{{size}}" [ngStyle]="dimention" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip-gas">
      <rect width="100" height="100"/>
    </clipPath>
  </defs>
  <g id="gas" clip-path="url(#clip-gas)">
    <g id="Group_16" data-name="Group 16" transform="translate(7.016 -0.001)">
      <path id="Path_28" data-name="Path 28" d="M40.838,70.513a58.314,58.314,0,0,0,6.586-16.98A59.9,59.9,0,0,0,48.732,40.3c7.65,8.142,13.116,16.5,14.792,25.242,1.842,9.612-.93,19.824-10.492,30.922H31.17c-9.69-11.384-6.756-18.3-3.006-27.13a79.3,79.3,0,0,0,4.012-11,19.311,19.311,0,0,1,2.71,3.908,29.142,29.142,0,0,1,2.678,7.784,1.765,1.765,0,0,0,3.274.484M77.582,56.6C73.638,41.033,61.532,21.947,37.116.439a1.763,1.763,0,0,0-2.922,1.474c.158,6.354-5.166,15.862-11.09,26.444A227.977,227.977,0,0,0,12.4,49.127c-7.608,17.694-9.672,35.436,10.54,47.34H13.968a1.767,1.767,0,0,0,0,3.534H72.176a1.767,1.767,0,1,0,0-3.534H63.008C77.818,88.111,81.52,72.147,77.582,56.6Z" transform="translate(0 0)"  [ngStyle]="style" fill-rule="evenodd"/>
    </g>
  </g>
</svg>
  `
})
export class GasIconComponent implements OnInit {
    @Input() color: string;
    @Input() size: number;
    @Input() active: boolean;
    constructor() { }

    ngOnInit() {
        if (!this.color) {
            this.color = '#ef9453';
        }
        if (!this.size) {
            this.size = 30;
        }
    }

    get style() {
        return {
            fill: `${this.color}`
        };
    }

    get dimention() {
        return {
            width: `${this.size}px`,
            height: `${this.size}px`
        };
    }

}
