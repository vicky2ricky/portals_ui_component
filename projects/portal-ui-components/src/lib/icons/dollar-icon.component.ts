import { Component, Input, OnInit } from '@angular/core';

// tslint:disable: max-line-length
@Component({
    selector: 'puc-dollar-icon',
    template: `

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" attr.height="{{size}}px" attr.width="{{size}}px" [ngStyle]="dimention" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip-dollar">
      <rect width="100" height="100"/>
    </clipPath>
  </defs>
  <g id="dollar" clip-path="url(#clip-dollar)">
    <g id="noun_dollar_223793" transform="translate(-4.4 -4.4)">
      <path id="Path_14" data-name="Path 14"
        d="M54.4,4.4a50,50,0,1,0,50,50A49.978,49.978,0,0,0,54.4,4.4ZM68.764,74.137a16.951,16.951,0,0,1-8.333,5.373c-1.425.439-2.083,1.206-1.974,2.632s0,2.961,0,4.386a1.873,1.873,0,0,1-1.974,2.083H51.768c-1.425,0-2.083-.768-2.083-2.193V83.128c0-2.412-.11-2.522-2.412-2.851a27.7,27.7,0,0,1-8.443-2.412c-2.083-.987-2.3-1.535-1.754-3.728.439-1.645.877-3.289,1.425-4.934.329-1.206.768-1.754,1.316-1.754A3.365,3.365,0,0,1,41.242,68a28.473,28.473,0,0,0,9.43,2.851,8.3,8.3,0,0,0,1.645.11,12.613,12.613,0,0,0,4.5-.877c3.618-1.645,4.276-5.811,1.1-8.443A16.442,16.442,0,0,0,54.4,59.554c-3.18-1.425-6.579-2.522-9.649-4.276-4.934-2.961-8.114-7.018-7.675-13.048.439-6.8,4.276-11.075,10.526-13.268,2.522-.987,2.632-.877,2.632-3.618V22.6c0-1.974.439-2.412,2.412-2.412h2.3c3.838,0,3.838.11,3.838,4.276,0,3.07,0,3.07,3.07,3.509a29.215,29.215,0,0,1,6.689,1.974,2,2,0,0,1,1.316,2.632c-.548,1.864-.987,3.728-1.645,5.592-.329,1.1-.768,1.645-1.425,1.645a3.305,3.305,0,0,1-1.425-.439,21.057,21.057,0,0,0-9.32-2.083H54.839a8.236,8.236,0,0,0-2.851.548c-3.18,1.425-3.728,4.934-.987,7.127A23.851,23.851,0,0,0,55.606,47.6a71.918,71.918,0,0,1,8.333,3.838C72.492,56.045,74.795,66.79,68.764,74.137Z"
        [ngStyle]="style" />
    </g>
  </g>
</svg>
  `
})
export class DollarIconComponent implements OnInit {
    @Input() color: string;
    @Input() size: number;
    @Input() active: boolean;
    constructor() { }

    ngOnInit() {
        if (!this.color) {
            this.color = '#f7c325';
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
