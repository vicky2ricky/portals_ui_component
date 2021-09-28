import { Component, Input, OnInit, TemplateRef } from '@angular/core';

import {TooltipComponent} from '@angular/material/tooltip';

@Component({
    selector: 'app-custom-tool-tip', // tslint:disable-line
    templateUrl: './custom-tool-tip.component.html',
    styleUrls: ['./custom-tool-tip.component.scss']
  })
  export class CustomToolTipComponent extends TooltipComponent {

    @Input() text: string;
    @Input() contentTemplate: TemplateRef<any>;
    @Input() isHandlePos : boolean;
  }
